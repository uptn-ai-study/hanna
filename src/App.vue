<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// ── 타입 ──────────────────────────────────────────────────────────────

interface HistoryItem {
  won_at: string
  name: string
  label: string
  color: string
}

// ── 상태 ──────────────────────────────────────────────────────────────
const token = ref('test-user-001')
const points = ref(0)
const history = ref<HistoryItem[]>([])
const isSpinning = ref(false)
const resultText = ref('')
const resultColor = ref('')
const showResult = ref(false)
const errorMsg = ref('')

// 룰렛 칸 (서버 rewards 순서와 동일하게 하드코딩)
const SLOTS = [
  { label: '꽝',       color: '#666666' }, // 비 강조 본문 컬러
  { label: '+5P',      color: '#8C8EFF' },
  { label: '+10P',     color: '#5F61FF' }, // 일반 강조 컬러
  { label: '+20P',     color: '#3B3DFF' },
  { label: '☕ 커피',  color: '#FFA825' },
  { label: '⭐ 스벅',  color: '#00BFA5' },
  { label: '🍗 치킨',  color: '#FF2034' }, // 꼭 봐야하는 강조 컬러
]

const SLOT_COUNT = SLOTS.length
const DEG_PER_SLOT = 360 / SLOT_COUNT

// SVG 파이 조각 계산
const svgSize = 300
const cx = svgSize / 2
const cy = svgSize / 2
const r = svgSize / 2 - 4

function polarToXY(deg: number, radius: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
}

const slicePaths = computed(() =>
  SLOTS.map((slot, i) => {
    const startDeg = i * DEG_PER_SLOT
    const endDeg = startDeg + DEG_PER_SLOT
    const start = polarToXY(startDeg, r)
    const end = polarToXY(endDeg, r)
    const largeArc = DEG_PER_SLOT > 180 ? 1 : 0
    const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`

    // 라벨 중심각
    const midDeg = startDeg + DEG_PER_SLOT / 2
    const labelPos = polarToXY(midDeg, r * 0.62)
    return { path, color: slot.color, label: slot.label, lx: labelPos.x, ly: labelPos.y }
  })
)

// 휠 회전 각도
const wheelRotation = ref(0)
const wheelStyle = computed(() => ({
  transform: `rotate(${wheelRotation.value}deg)`,
  transition: isSpinning.value
    ? 'transform 4s cubic-bezier(0.23, 1, 0.32, 1)'
    : 'none',
}))

// ── API 헬퍼 ──────────────────────────────────────────────────────────
const authHeaders = computed(() => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token.value}`,
}))

async function fetchUser() {
  const res = await fetch('/api/user', { headers: authHeaders.value })
  if (!res.ok) return
  const data = await res.json()
  points.value = data.points
  history.value = data.history
}

async function spin() {
  if (isSpinning.value) return
  errorMsg.value = ''
  showResult.value = false
  isSpinning.value = true

  try {
    const res = await fetch('/api/roulette', {
      method: 'POST',
      headers: authHeaders.value,
    })
    const data = await res.json()

    if (!res.ok) {
      errorMsg.value = data.error ?? '오류가 발생했습니다.'
      isSpinning.value = false
      return
    }

    // 당첨 칸이 위쪽 포인터(0도)에 오도록 각도 계산
    // 각 칸의 중심각 = rewardIndex * DEG_PER_SLOT + DEG_PER_SLOT / 2
    const targetSlotCenter = data.rewardIndex * DEG_PER_SLOT + DEG_PER_SLOT / 2
    // 최소 5바퀴 + 해당 칸
    const extraSpins = 5 * 360
    const currentNorm = ((wheelRotation.value % 360) + 360) % 360
    const delta = (360 - targetSlotCenter - currentNorm + 360) % 360
    wheelRotation.value += extraSpins + delta

    setTimeout(() => {
      isSpinning.value = false
      resultText.value = data.reward.name
      resultColor.value = data.reward.color
      showResult.value = true
      points.value = data.newPoints
      fetchUser()
    }, 4200)
  } catch {
    errorMsg.value = '서버 연결에 실패했습니다.'
    isSpinning.value = false
  }
}

async function resetPoints() {
  await fetch('/api/user/reset', { method: 'POST', headers: authHeaders.value })
  await fetchUser()
}

function closeResult() {
  showResult.value = false
}

onMounted(fetchUser)
</script>

<template>
  <div class="app">
    <!-- 헤더 -->
    <header class="header">
      <h1 class="title gui-title-1">🎡 포인트 룰렛</h1>
      <div class="points-badge">
        <span class="points-label gui-sub">보유 포인트</span>
        <span class="points-value gui-title-2">{{ points.toLocaleString() }}P</span>
      </div>
    </header>

    <!-- 테스트 토큰 입력 -->
    <div class="token-row">
      <input v-model="token" placeholder="인증 토큰" class="token-input gui-body" @change="fetchUser" />
      <button class="btn-reset" @click="resetPoints">🔄 10,000P 리셋</button>
    </div>

    <!-- 룰렛 -->
    <div class="wheel-wrapper">
      <!-- 포인터 -->
      <div class="pointer">▼</div>
      <div class="wheel-container" :style="wheelStyle">
        <svg :width="svgSize" :height="svgSize" :viewBox="`0 0 ${svgSize} ${svgSize}`">
          <g v-for="(s, i) in slicePaths" :key="i">
            <path :d="s.path" :fill="s.color" stroke="#FFFFFF" stroke-width="2.5" />
            <text
              :x="s.lx" :y="s.ly"
              text-anchor="middle" dominant-baseline="middle"
              fill="white" font-size="12" font-weight="700"
              font-family="'SUIT', sans-serif"
            >{{ s.label }}</text>
          </g>
          <!-- 중앙 원 -->
          <circle :cx="cx" :cy="cy" r="20" fill="#FFFFFF" stroke="#5F61FF" stroke-width="3"/>
          <circle :cx="cx" :cy="cy" r="8" fill="#5F61FF" />
        </svg>
      </div>
    </div>

    <!-- 스핀 버튼 -->
    <button
      class="btn-spin"
      :disabled="isSpinning || points < 10"
      @click="spin"
    >
      <span v-if="isSpinning">🌀 돌아가는 중...</span>
      <span v-else-if="points < 10">포인트 부족</span>
      <span v-else>🎰 룰렛 돌리기 (−10P)</span>
    </button>

    <!-- 에러 메시지 -->
    <p v-if="errorMsg" class="error-msg gui-body">{{ errorMsg }}</p>

    <!-- 당첨 내역 (Table GUI 가이드 적용) -->
    <div class="history" v-if="history.length">
      <h2 class="history-title gui-title-3">최근 당첨 내역</h2>
      <div class="table-wrapper">
        <table class="gui-table">
          <thead>
            <tr>
              <th class="col-reward">경품명</th>
              <th class="col-date">당첨 일시</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in history" :key="i">
              <td class="col-reward">
                <span class="reward-tag" :style="{ backgroundColor: item.color }"></span>
                <span class="reward-name">{{ item.name }}</span>
              </td>
              <td class="col-date gui-sub-2">{{ new Date(item.won_at).toLocaleString('ko-KR') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 참여 안내 및 유의사항 (Bullet GUI 가이드 적용) -->
    <div class="notice-section">
      <h3 class="notice-title gui-title-3">참여 안내 및 유의사항</h3>
      <ul class="gui-bullet-list">
        <li class="gui-body">1회 룰렛 참여 시 보유 포인트에서 <strong>10P가 즉시 차감</strong>됩니다.</li>
        <li class="gui-body">포인트가 부족할 경우 룰렛을 돌릴 수 없습니다. (상단의 리셋 버튼을 통해 포인트를 충전할 수 있습니다.)</li>
        <li class="gui-body">일부 고가 경품(치킨, 스타벅스 등)의 경우 <strong>일주일 당첨 제한 횟수</strong>가 적용됩니다.</li>
        <li class="gui-body">당첨된 모든 포인트는 보유 포인트에 즉시 합산되어 반영됩니다.</li>
      </ul>
    </div>

    <!-- 당첨 결과 모달 -->
    <Transition name="modal">
      <div v-if="showResult" class="modal-overlay" @click="closeResult">
        <div class="modal-card" @click.stop>
          <div class="modal-icon" :style="{ background: resultColor }">🎉</div>
          <h2 class="modal-title gui-title-1">당첨!</h2>
          <p class="modal-reward gui-title-2" :style="{ color: resultColor }">{{ resultText }}</p>
          <p class="modal-points gui-sub">잔여 포인트: {{ points.toLocaleString() }}P</p>
          <button class="btn-close" @click="closeResult">확인</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.app {
  --color-text-main: #444444;
  --color-text-highlight: #5F61FF;
  --color-text-alert: #FF2034;
  --color-text-muted: #666666;
  --color-border-outer: #DDDDDD;
  --color-border-inner: #EBEBEB;
  --color-table-text-1: #333333;
  --color-table-text-2: #666666;
  --color-table-bg: #F8F8F8;

  min-height: 100vh;
  background: #FFFFFF;
  color: var(--color-text-main);
  font-family: 'SUIT', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px 48px;
  gap: 24px;
}

/* Typography Styles */
.gui-title-1 {
  font-weight: 700;
  font-size: 22px;
  letter-spacing: 0;
  line-height: 32px;
  color: var(--color-text-main);
}
.gui-title-2 {
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.3px;
  line-height: 28px;
  color: var(--color-text-main);
}
.gui-title-3 {
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.3px;
  line-height: 24px;
  color: var(--color-text-main);
}
.gui-body {
  font-weight: 400;
  font-size: 14px;
  letter-spacing: 0;
  line-height: 24px;
  color: var(--color-text-main);
}
.gui-sub {
  font-weight: 500;
  font-size: 13px;
  letter-spacing: -0.3px;
  line-height: 20px;
  color: var(--color-text-muted);
}
.gui-sub-2 {
  font-weight: 400;
  font-size: 12px;
  letter-spacing: -0.3px;
  line-height: 18px;
  color: var(--color-text-muted);
}

/* 헤더 */
.header {
  width: 100%;
  max-width: 420px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.points-badge {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(95, 97, 255, 0.08);
  border: 1px solid rgba(95, 97, 255, 0.3);
  border-radius: 12px;
  padding: 6px 14px;
}
.points-value {
  color: var(--color-text-highlight) !important;
}

/* 토큰 입력 */
.token-row {
  width: 100%;
  max-width: 420px;
  display: flex;
  gap: 8px;
}
.token-input {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  color: var(--color-text-main);
  border-radius: 10px;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.2s;
}
.token-input:focus {
  border-color: var(--color-text-highlight);
}
.btn-reset {
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  color: var(--color-text-muted);
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-reset:hover {
  border-color: var(--color-text-highlight);
  color: var(--color-text-highlight);
}

/* 룰렛 */
.wheel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
}
.pointer {
  position: absolute;
  top: -14px;
  font-size: 26px;
  color: var(--color-text-highlight);
  z-index: 10;
  filter: drop-shadow(0 2px 6px rgba(95, 97, 255, 0.4));
}
.wheel-container {
  border-radius: 50%;
  background: #FFFFFF;
  padding: 4px;
  box-shadow:
    0 0 0 1px var(--color-border-outer),
    0 0 0 5px #FFFFFF,
    0 0 0 8px var(--color-text-highlight),
    0 8px 30px rgba(95, 97, 255, 0.15);
}

/* 스핀 버튼 */
.btn-spin {
  width: 100%;
  max-width: 420px;
  padding: 16px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  background: linear-gradient(135deg, var(--color-text-highlight), #474aff);
  color: white;
  box-shadow: 0 4px 16px rgba(95, 97, 255, 0.3);
  transition: all 0.2s;
  letter-spacing: -0.3px;
  font-weight: 700;
  font-size: 16px;
}
.btn-spin:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(95, 97, 255, 0.4);
}
.btn-spin:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-msg {
  color: var(--color-text-alert);
  margin-top: -8px;
}

/* 당첨 내역 - Table 스타일 */
.history {
  width: 100%;
  max-width: 420px;
}
.history-title {
  margin-bottom: 12px;
}
.table-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--color-border-outer);
}
.gui-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
.gui-table th, .gui-table td {
  padding: 10px 14px;
}
.gui-table th {
  background-color: var(--color-table-bg);
  color: var(--color-table-text-1);
  font-weight: 700;
  font-size: 13px;
  border-bottom: 1px solid var(--color-border-inner);
}
.gui-table td {
  color: var(--color-table-text-2);
  font-size: 13px;
  border-bottom: 1px solid var(--color-border-inner);
}
.gui-table tr:last-child td {
  border-bottom: none;
}
.col-reward {
  display: flex;
  align-items: center;
  gap: 8px;
}
.reward-tag {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.reward-name {
  font-weight: 600;
  color: var(--color-table-text-1);
}
.col-date {
  text-align: right;
}

/* 참여 안내 및 유의사항 - Bullet 스타일 */
.notice-section {
  width: 100%;
  max-width: 420px;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.notice-title {
  border-bottom: 1px solid var(--color-border-inner);
  padding-bottom: 8px;
}
.gui-bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.gui-bullet-list li {
  position: relative;
  padding-left: 16px;
  color: var(--color-text-muted);
}
.gui-bullet-list li::before {
  content: "";
  position: absolute;
  left: 2px;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-text-muted);
}
.gui-bullet-list strong {
  color: var(--color-text-main);
}

/* 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}
.modal-card {
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  border-radius: 24px;
  padding: 36px 32px;
  text-align: center;
  width: 88%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.modal-icon {
  width: 72px; height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: white;
}
.btn-close {
  margin-top: 8px;
  padding: 12px 40px;
  border: none;
  border-radius: 12px;
  background: var(--color-text-highlight);
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(95, 97, 255, 0.2);
  transition: all 0.2s;
}
.btn-close:hover {
  background: #474aff;
  box-shadow: 0 6px 16px rgba(95, 97, 255, 0.3);
}

/* 모달 트랜지션 */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9); }
</style>

