export default async function handler(req: any, res: any) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 로컬 테스트용 및 설정 미비 시 기본 더미 랭킹
  const mockRankings = [
    { id: '다람쥐대장', stage: 25 },
    { id: '도토리도둑', stage: 18 },
    { id: '햄스터박사', stage: 14 },
    { id: '씨앗수집가', stage: 10 },
    { id: '빠른쳇바퀴', stage: 7 }
  ];

  const hasCredentials = !!(url && token);

  if (req.method === 'GET') {
    if (!hasCredentials) {
      // 환경변수가 없으면 모의 랭킹 데이터 반환
      return res.status(200).json(mockRankings);
    }

    try {
      // Redis Sorted Set에서 상위 10개 조회 (내림차순, ZREVRANGE)
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(['ZREVRANGE', 'yabawi_rankings', 0, 9, 'WITHSCORES'])
      });

      if (!response.ok) {
        throw new Error(`Upstash API error: ${response.statusText}`);
      }

      const data = await response.json();
      const rawResult: string[] = data.result || [];

      // WITHSCORES 옵션으로 응답은 [member1, score1, member2, score2, ...] 형식으로 옵니다.
      const rankings = [];
      for (let i = 0; i < rawResult.length; i += 2) {
        const id = rawResult[i];
        const stage = parseInt(rawResult[i + 1], 10);
        rankings.push({ id, stage });
      }

      // 만약 가져온 랭킹 데이터가 비어있으면 초기 셋팅으로 mockRankings 등록 및 반환
      if (rankings.length === 0) {
        // ZADD 파이프라인으로 초기 데이터 삽입
        const pipeline = mockRankings.map(item => ['ZADD', 'yabawi_rankings', 'GT', item.stage, item.id]);
        await fetch(`${url}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(pipeline)
        });
        return res.status(200).json(mockRankings);
      }

      return res.status(200).json(rankings);
    } catch (error: any) {
      console.error('Error fetching rankings from Upstash:', error);
      // 에러 발생 시에도 중단 없이 모의 데이터 반환 (Robustness)
      return res.status(200).json(mockRankings);
    }
  }

  if (req.method === 'POST') {
    const { id, stage } = req.body || {};

    if (!id || typeof stage !== 'number') {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    if (!hasCredentials) {
      console.warn('Upstash Redis credentials are not configured. Score not saved globally.');
      return res.status(200).json({ success: true, message: 'Mock save successful (no credentials)' });
    }

    try {
      // 1. ZADD 명령으로 데이터 삽입 (GT 옵션: 기존 값이 있고 새 값이 더 높을 때만 업데이트)
      // 2. 리더보드 크기가 무한히 커지는 것을 방지하기 위해 상위 100개만 남기고 삭제 (ZREMRANGEBYRANK)
      // 파이프라인 요청 전송
      const response = await fetch(`${url}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['ZADD', 'yabawi_rankings', 'GT', stage, id],
          ['ZREMRANGEBYRANK', 'yabawi_rankings', 0, -101] // 상위 100등 밖의 모든 레코드 제거 (ZSET은 기본 오름차순이므로 0부터 -101번째까지를 지우면 상위 100개만 남음)
        ])
      });

      if (!response.ok) {
        throw new Error(`Upstash API error: ${response.statusText}`);
      }

      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Error saving ranking to Upstash:', error);
      return res.status(500).json({ error: 'Failed to save score' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
