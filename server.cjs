const express = require('express');
const cors = require('cors');
const db = require('./db.cjs');

const app = express();
app.use(cors());
app.use(express.json());

// ── 유저별 인메모리 락 (더블클릭 / 중복 요청 방지) ──────────────────
// ※ 서버리스 환경(Vercel)에서는 인스턴스가 분산되므로 이 락은 단일 인스턴스 내에서만 유효합니다.
const activeLocks = new Set();

// ── 미들웨어: 토큰으로 유저 조회 or 생성 ────────────────────────────
async function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '').trim();
  if (!token) return res.status(401).json({ error: '인증 토큰이 필요합니다.' });

  try {
    // 1. 유저 조회
    let { data: user, error } = await db
      .from('users')
      .select('*')
      .eq('token', token)
      .single();

    // PGRST116: 결과가 0개일 때의 Supabase 에러 코드
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // 2. 존재하지 않는 유저라면 생성
    if (!user) {
      const { data: newUser, error: insertError } = await db
        .from('users')
        .insert({ token, points: 10000 })
        .select('*')
        .single();
      
      if (insertError) throw insertError;
      user = newUser;
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('인증 미들웨어 오류:', err);
    res.status(500).json({ error: '인증 처리 중 오류가 발생했습니다.' });
  }
}

// ── GET /api/user : 포인트 잔액 + 최근 당첨내역 ──────────────────────
app.get('/api/user', authMiddleware, async (req, res) => {
  try {
    // 1. 최신 포인트 조회
    const { data: user, error: userError } = await db
      .from('users')
      .select('points')
      .eq('id', req.user.id)
      .single();

    if (userError) throw userError;

    // 2. 당첨 이력 조회 (rewards 테이블 조인)
    const { data: history, error: historyError } = await db
      .from('win_history')
      .select(`
        won_at,
        rewards (
          name,
          label,
          color
        )
      `)
      .eq('user_id', req.user.id)
      .order('won_at', { ascending: false })
      .limit(20);

    if (historyError) throw historyError;

    // 프론트엔드가 기대하는 JSON 포맷으로 맵핑
    const formattedHistory = (history || []).map(h => ({
      won_at: h.won_at,
      name: h.rewards?.name || '',
      label: h.rewards?.label || '',
      color: h.rewards?.color || ''
    }));

    res.json({ points: user.points, history: formattedHistory });
  } catch (err) {
    console.error('유저 정보 조회 오류:', err);
    res.status(500).json({ error: '사용자 정보를 불러오는 데 실패했습니다.' });
  }
});

// ── POST /api/roulette : 룰렛 돌리기 ─────────────────────────────────
app.post('/api/roulette', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const SPIN_COST = 10;

  // 1. 중복 요청 락 체크
  if (activeLocks.has(userId)) {
    return res.status(429).json({ error: '이미 룰렛이 돌아가는 중입니다.' });
  }
  activeLocks.add(userId);

  try {
    // 2. 최신 포인트 잔액 확인
    const { data: user, error: userError } = await db
      .from('users')
      .select('points')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    if (user.points < SPIN_COST) {
      return res.status(400).json({ error: '포인트가 부족합니다.' });
    }

    // 3. 전체 리워드 정보 가져오기
    const { data: allRewards, error: rewardsError } = await db
      .from('rewards')
      .select('*')
      .order('id', { ascending: true });

    if (rewardsError) throw rewardsError;

    // 4. 이번 주 고가 경품 당첨 횟수 조회 후 당첨 가능 목록 필터링
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: winsThisWeek, error: winsError } = await db
      .from('win_history')
      .select('reward_id')
      .gt('won_at', weekAgo);

    if (winsError) throw winsError;

    const winCounts = {};
    (winsThisWeek || []).forEach(w => {
      winCounts[w.reward_id] = (winCounts[w.reward_id] || 0) + 1;
    });

    const eligibleRewards = allRewards.filter(r => {
      if (r.weekly_limit >= 9999) return true;
      const count = winCounts[r.id] || 0;
      return count < r.weekly_limit;
    });

    if (eligibleRewards.length === 0) {
      return res.status(500).json({ error: '당첨 가능한 경품이 존재하지 않습니다.' });
    }

    // 5. 가중치 기반 랜덤 당첨 결정
    const totalProb = eligibleRewards.reduce((sum, r) => sum + r.probability, 0);
    let rand = Math.random() * totalProb;
    let selected = eligibleRewards[eligibleRewards.length - 1]; // 폴백
    for (const reward of eligibleRewards) {
      rand -= reward.probability;
      if (rand <= 0) {
        selected = reward;
        break;
      }
    }

    // 6. 포인트 변경 사항 반영 및 당첨 기록 추가
    const newPoints = user.points - SPIN_COST + selected.points_value;

    // 포인트 업데이트
    const { error: updateError } = await db
      .from('users')
      .update({ points: newPoints })
      .eq('id', userId);

    if (updateError) throw updateError;

    // 당첨 내역 추가
    const { error: insertError } = await db
      .from('win_history')
      .insert({ user_id: userId, reward_id: selected.id });

    if (insertError) throw insertError;

    // 7. 당첨 결과 반환 (룰렛의 몇 번째 칸인지 인덱스 포함)
    const rewardIndex = allRewards.findIndex(r => r.id === selected.id);

    res.json({
      reward: selected,
      rewardIndex,
      newPoints: newPoints
    });

  } catch (err) {
    console.error('룰렛 실행 오류:', err);
    res.status(500).json({ error: err.message || '룰렛 실행 중 오류가 발생했습니다.' });
  } finally {
    activeLocks.delete(userId);
  }
});

// ── POST /api/user/reset : 테스트용 포인트 리셋 ─────────────────────
app.post('/api/user/reset', authMiddleware, async (req, res) => {
  try {
    const { error } = await db
      .from('users')
      .update({ points: 10000 })
      .eq('id', req.user.id);

    if (error) throw error;
    res.json({ points: 10000 });
  } catch (err) {
    console.error('포인트 리셋 오류:', err);
    res.status(500).json({ error: '포인트 리셋 중 오류가 발생했습니다.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ 서버 실행 중: http://localhost:${PORT}`));
