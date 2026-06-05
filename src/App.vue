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
const alarmOn = ref(false)

// 룰렛 칸 (서버 rewards 순서와 동일하게 하드코딩)
const SLOTS = [
  { label: '꽝',       color: '#FFFFFF' },
  { label: '추파춥스',  color: '#5F61FF' },
  { label: '마이쭈',    color: '#FFFFFF' },
  { label: '베라',     color: '#5F61FF' },
  { label: '스벅',     color: '#FFFFFF' },
  { label: '치킨',     color: '#5F61FF' },
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
    const labelPos = polarToXY(midDeg, r * 0.68)
    
    // 배경색이 화이트(#FFFFFF)이면 텍스트를 Accent(#5F61FF)로, 그 외는 화이트(#FFFFFF)로 설정
    const textColor = slot.color === '#FFFFFF' ? '#5F61FF' : '#FFFFFF'
    
    // 라벨 회전 각도 (글자 바닥이 중심 START를 향하도록 회전)
    const angle = midDeg
    
    return { path, color: slot.color, textColor, label: slot.label, lx: labelPos.x, ly: labelPos.y, angle }
  })
)

// 휠 회전 각도 및 회전 모션 상태
const isStopping = ref(false)
const wheelRotation = ref(0)

const wheelStyle = computed(() => {
  if (isSpinning.value && !isStopping.value) {
    // START 상태: JS RAF(requestAnimationFrame)로 회전하므로 transition 제거
    return {
      transform: `rotate(${wheelRotation.value}deg)`,
      transition: 'none',
    }
  } else if (isStopping.value) {
    // STOP 클릭 후: 감속(3초) transition 적용
    return {
      transform: `rotate(${wheelRotation.value}deg)`,
      transition: 'transform 3s cubic-bezier(0.23, 1, 0.32, 1)',
    }
  } else {
    // 대기 상태
    return {
      transform: `rotate(${wheelRotation.value}deg)`,
      transition: 'none',
    }
  }
})

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

// ── 룰렛 물리 시뮬레이션 및 API 연동 ────────────────────────────────────
const apiPromise = ref<Promise<any> | null>(null)
let rafId = 0
let currentSpeed = 0
const MAX_SPEED = 15 // 프레임당 회전 각도 (60fps 기준 초당 900도 = 2.5바퀴)

function spinLoop() {
  if (isStopping.value) return // 감속 모드가 되면 RAF 루프를 중지하고 CSS Transition에 위임
  
  if (currentSpeed < MAX_SPEED) {
    currentSpeed += 0.5 // 서서히 가속
  }
  
  wheelRotation.value = (wheelRotation.value + currentSpeed) % 360
  rafId = requestAnimationFrame(spinLoop)
}

function handleCenterBtnClick() {
  if (!isSpinning.value) {
    startSpin()
  } else {
    stopSpin()
  }
}

function startSpin() {
  if (isSpinning.value) return
  errorMsg.value = ''
  showResult.value = false
  isSpinning.value = true
  isStopping.value = false
  currentSpeed = 0

  // 1. API 호출을 미리 실행하여 프라미스를 보관합니다.
  apiPromise.value = fetch('/api/roulette', {
    method: 'POST',
    headers: authHeaders.value,
  }).then(async (res) => {
    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error ?? '오류가 발생했습니다.')
    }
    return data
  })

  // 2. 가속 및 등속 회전 루프 가동
  rafId = requestAnimationFrame(spinLoop)
}

async function stopSpin() {
  if (isStopping.value || !isSpinning.value) return
  isStopping.value = true
  cancelAnimationFrame(rafId)

  try {
    // API 결과를 가져옵니다 (이미 완료되었거나 완료되는 즉시 해결됨)
    const data = await apiPromise.value

    // 당첨 칸이 위쪽 포인터(0도)에 오도록 각도 계산
    const targetSlotCenter = data.rewardIndex * DEG_PER_SLOT + DEG_PER_SLOT / 2
    const targetWheelAngle = (360 - targetSlotCenter) % 360
    
    // 현재 휠의 각도 0~360 정규화
    const currentAngle = wheelRotation.value % 360

    // 현재 각도에서 목표 각도까지 도달하는 최단 시계방향 오프셋
    const delta = (targetWheelAngle - currentAngle + 360) % 360

    // 최소 2바퀴 추가 회전하며 목표 각도로 감속 정지
    const extraSpins = 2 * 360
    const finalRotation = wheelRotation.value + delta + extraSpins

    // transition에 의해 최종 정지 위치로 애니메이션 적용
    wheelRotation.value = finalRotation

    setTimeout(() => {
      isSpinning.value = false
      isStopping.value = false
      resultText.value = data.reward.name
      resultColor.value = data.reward.color
      showResult.value = true
      points.value = data.newPoints
      fetchUser()
    }, 3200) // 3초 트랜지션 + 0.2초 마진
  } catch (err: any) {
    errorMsg.value = err.message ?? '서버 연결에 실패했습니다.'
    isSpinning.value = false
    isStopping.value = false
  }
}

function closeResult() {
  showResult.value = false
}

onMounted(fetchUser)
</script>

<template>
  <div class="app">
    <!-- 모바일 컨테이너 프레임 -->
    <div class="phone-container">
      <!-- 배경 3D 구체 데코레이션 -->
      <div class="bg-deco bg-deco-1"></div>
      <div class="bg-deco bg-deco-2"></div>
      <div class="bg-deco bg-deco-3"></div>

      <!-- 상단 타이틀 바 (백버튼 + 햄버거 메뉴) -->
      <header class="header">
        <button class="btn-back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19L8 12L15 5" stroke="#222222" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="btn-menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="#222222" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </header>

      <!-- 본문 영역 -->
      <div class="content-body">
        <!-- 히어로 타이틀 (사용자 디자인 복제) -->
        <div class="hero-section">
          <p class="hero-subtitle editor-sub-1">운명은 돌리는 자의 것</p>
          <h2 class="hero-title editor-title-1 color-accent">오늘의 행운 룰렛</h2>
        </div>

        <!-- 룰렛 SVG 휠 -->
        <div class="wheel-wrapper">
          <!-- 말풍선 형태의 고품질 핀 포인터 -->
          <div class="pointer-pin">
            <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
              <path d="M16 42C16 42 32 27.2625 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 27.2625 16 42 16 42Z" fill="#FFFFFF" />
              <circle cx="16" cy="16" r="5" fill="#5F61FF" />
            </svg>
          </div>
          
          <div class="wheel-container" :style="wheelStyle">
            <svg :width="svgSize" :height="svgSize" :viewBox="`0 0 ${svgSize} ${svgSize}`">
              <g v-for="(s, i) in slicePaths" :key="i">
                <path :d="s.path" :fill="s.color" stroke="#FFFFFF" stroke-width="3" />
                <text
                  :x="s.lx" :y="s.ly"
                  text-anchor="middle" dominant-baseline="middle"
                  :fill="s.textColor" font-size="19" font-weight="800"
                  font-family="'SUIT', sans-serif"
                  :transform="`rotate(${s.angle}, ${s.lx}, ${s.ly})`"
                >{{ s.label }}</text>
              </g>
            </svg>
          </div>

          <!-- 중앙 고정 START/STOP 버튼 -->
          <div
            class="center-start-btn"
            :class="{ pulse: !isSpinning, spinning: isSpinning && !isStopping }"
            @click="handleCenterBtnClick"
          >
            <div class="center-start-btn-circle">
              <span class="btn-text">{{ isSpinning && !isStopping ? 'STOP' : 'GO' }}</span>
            </div>
          </div>
        </div>

          <!-- 참여 방법 카드 섹션 -->
          <div class="instruction-card">
            <h3 class="instruction-title editor-title-3">참여 방법</h3>
            <p class="instruction-subtitle editor-sub-2">아래를 참고하여 미션을 완료하세요!</p>
            
            <div class="step-list">
              <div class="step-item">
                <div class="step-badge-wrapper">
                  <div class="step-badge">1</div>
                  <div class="step-line"></div>
                </div>
                <div class="step-content editor-title-4">
                  룰렛 판을 클릭해 룰렛을 돌리고
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-badge-wrapper">
                  <div class="step-badge">2</div>
                  <div class="step-line"></div>
                </div>
                <div class="step-content editor-title-4">
                  팝업에서 최종 결과 확인하기
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-badge-wrapper">
                  <div class="step-badge">3</div>
                </div>
                <div class="step-content editor-title-4">
                  <span class="font-bold">당첨 상품은 기프티콘으로 즉시 지급돼요!</span>
                </div>
              </div>
            </div>
            
            <div class="instruction-notice editor-sub-2">
              ✓ 서비스 이용 시 모바일 데이터 사용으로 별도의 통신 데이터 요금이 과금될 수 있으니 주의하시기 바랍니다.
            </div>
          </div>

          <!-- 알림 토글 카드 섹션 (사용자 디자인 복제) -->
          <div class="alarm-toggle-card">
          <div class="alarm-text-group">
            <p class="alarm-title editor-title-4">
              알람 ON하고 <span class="color-accent font-bold">매일 알림 받으세요!</span>
            </p>
            <p class="alarm-desc editor-sub-2">매일 오전 10:00~11:00 알림</p>
          </div>
          <!-- Premium Custom Switch -->
          <label class="toggle-switch-wrapper">
            <input type="checkbox" v-model="alarmOn" />
            <span class="toggle-switch-slider"></span>
          </label>
        </div>



        <!-- 에러 메시지 -->
        <p v-if="errorMsg" class="error-msg editor-title-4">{{ errorMsg }}</p>


      </div>

      <!-- 하단 유의사항 푸터 영역 (UPTNStation 래플 유의사항 완벽 이식) -->
      <footer class="notice-footer">
        <h3 class="notice-footer-title">유의사항</h3>
        <div class="notice-footer-content">
          <p>응모에 사용된 재화(포인트)는 응모 취소 또는 환불이 불가능합니다.</p>
          <p>회원탈퇴 또는 이용제한 중인 경우, 추첨 대상에서 제외됩니다.</p>
          <p>현물 경품 지급은 업튼 스테이션 내 혜택 NFT 또는 기프티콘을 통해 발송될 예정입니다.</p>
          <p>본 이벤트로 5만원 이상의 상품에 당첨되는 경우 제세공과금 처리를 위한 정보를 수집하며, 기간 내 미제공 시 지급대상에서 제외됩니다.</p>
          <p>공정한 방법을 이용하지 않거나 이벤트의 원활한 운영에 방해가 되는 행위를 하는 참여자는 지급 대상 제외 및 이용제한 조치를 받을 수 있습니다.</p>
        </div>
      </footer>
    </div>

    <!-- 당첨 결과 모달 -->
    <Transition name="modal">
      <div v-if="showResult" class="modal-overlay" @click="closeResult">
        <div class="modal-card" @click.stop>
          <div class="modal-icon" :style="{ background: resultColor }">🎉</div>
          <h2 class="modal-title editor-title-1">당첨!</h2>
          <p class="modal-reward editor-title-2" :style="{ color: resultColor }">{{ resultText }}</p>
          <p class="modal-points editor-sub-1">잔여 포인트: {{ points.toLocaleString() }}P</p>
          <button class="btn-action" @click="closeResult">확인</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; margin: 0; padding: 0; }

.app {
  --color-text-main: #222222;
  --color-text-highlight: #5F61FF;
  --color-text-alert: #FF2034;
  --color-text-muted: #666666;
  --color-border-outer: #EBEBEB;
  --color-border-inner: #F5F6F8;
  --color-table-bg: #F8F9FA;

  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

/* 모바일 폰 컨테이너 */
.phone-container {
  max-width: 420px;
  width: 100%;
  background: #FFFFFF;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border-left: 1px solid #EBEBEB;
  border-right: 1px solid #EBEBEB;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

@media (min-width: 421px) {
  .phone-container {
    margin: 32px auto;
    min-height: calc(100vh - 64px);
    border-radius: 16px;
    border: 1px solid #EBEBEB;
    overflow: hidden;
  }
}

/* 3D 구체 데코레이션 */
.bg-deco {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.bg-deco-1 {
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(95, 97, 255, 0.07) 0%, rgba(255, 255, 255, 0) 70%);
  filter: blur(12px);
  top: 10%; left: -60px;
}
.bg-deco-2 {
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(95, 97, 255, 0.07) 0%, rgba(255, 255, 255, 0) 70%);
  filter: blur(16px);
  bottom: 20%; right: -80px;
}
.bg-deco-3 {
  width: 120px; height: 120px;
  background: radial-gradient(circle, rgba(95, 97, 255, 0.04) 0%, rgba(255, 255, 255, 0) 70%);
  filter: blur(8px);
  top: 45%; left: 25%;
}

/* 본문 스크롤 영역 */
.content-body {
  padding: 16px 20px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  z-index: 1;
}

/* Typography Styles (SUIT Spec) */
.editor-title-1 {
  font-family: 'SUIT', sans-serif;
  font-weight: 700;
  font-size: 22px;
  line-height: 32px;
  letter-spacing: 0;
  color: var(--color-text-main);
}
.editor-title-2 {
  font-family: 'SUIT', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 28px;
  letter-spacing: -0.3px;
  color: var(--color-text-main);
}
.editor-title-3 {
  font-family: 'SUIT', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.3px;
  color: var(--color-text-main);
}
.editor-title-4 {
  font-family: 'SUIT', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0;
  color: var(--color-text-main);
}
.editor-sub-1 {
  font-family: 'SUIT', sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  letter-spacing: -0.3px;
  color: var(--color-text-muted);
}
.editor-sub-2 {
  font-family: 'SUIT', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: -0.3px;
  color: var(--color-text-muted);
}

/* Colors */
.color-primary { color: var(--color-text-main); }
.color-accent  { color: var(--color-text-highlight); }
.color-muted   { color: var(--color-text-muted); }
.color-alert   { color: var(--color-text-alert); }

/* 상단 타이틀바 */
.header {
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #F5F6F8;
  padding: 0 16px;
  background: #FFFFFF;
  z-index: 1;
}
.btn-back, .btn-menu {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

/* 히어로 타이틀 */
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 12px;
  gap: 6px;
}
.hero-subtitle {
  color: var(--color-text-muted);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.3px;
}
.hero-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}

.badge-capsule {
  background: var(--color-text-highlight);
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 999px;
  letter-spacing: -0.3px;
  font-family: 'SUIT', sans-serif;
}

/* 토큰 및 리셋 섹션 */
.token-section {
  width: 100%;
}
.token-row {
  display: flex;
  gap: 8px;
}
.token-input {
  flex: 1;
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  color: var(--color-text-main);
  border-radius: 12px;
  padding: 10px 14px;
  outline: none;
  font-size: 13px;
  transition: border-color 0.2s;
}
.token-input:focus {
  border-color: var(--color-text-highlight);
}
.btn-reset {
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  color: var(--color-text-muted);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.btn-reset:hover {
  border-color: var(--color-text-highlight);
  color: var(--color-text-highlight);
}

/* 룰렛 휠 */
.wheel-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px 0;
}
.pointer-pin {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}
.pointer-pin svg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
}
.wheel-container {
  border-radius: 50%;
  background: #FFFFFF;
  padding: 6px;
  box-shadow:
    0 0 0 1px var(--color-border-outer),
    0 0 0 6px #FFFFFF,
    0 0 0 9px var(--color-text-highlight),
    0 10px 36px rgba(95, 97, 255, 0.12);
}

/* 대기 상태의 Pulse 애니메이션 */
@keyframes button-pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 4px 12px rgba(95, 97, 255, 0.15);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.05);
    box-shadow: 0 6px 20px rgba(95, 97, 255, 0.3);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 4px 12px rgba(95, 97, 255, 0.15);
  }
}

/* 회전 중의 Glow 효과 */
@keyframes button-glow {
  0% {
    box-shadow: 0 0 12px rgba(95, 97, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 28px rgba(95, 97, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 12px rgba(95, 97, 255, 0.4);
  }
}

/* 중앙 START/STOP 버튼 고정 스타일 */
.center-start-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 96px;
  height: 96px;
  cursor: pointer;
  z-index: 20;
  border-radius: 50%;
}
.center-start-btn-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #FFFFFF;
  border: 1.5px solid #F5F6F8;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(95, 97, 255, 0.15);
  transition: all 0.2s ease;
}

/* 대기 중 Pulse 적용 */
.center-start-btn.pulse {
  animation: button-pulse 2s infinite ease-in-out;
}

/* 돌고 있을 때 Glow 적용 */
.center-start-btn.spinning .center-start-btn-circle {
  animation: button-glow 1s infinite ease-in-out;
}

.center-start-btn:hover .center-start-btn-circle {
  background: #F9FAFF;
  transform: scale(1.02);
}
.center-start-btn:active .center-start-btn-circle {
  transform: scale(0.96);
}
.btn-text {
  color: #5F61FF;
  font-size: 21px;
  font-weight: 900;
  font-family: 'SUIT', sans-serif;
  letter-spacing: -0.5px;
}

/* 알림 토글 카드 */
.alarm-toggle-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  border-radius: 16px;
  padding: 16px 20px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}
.alarm-text-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.alarm-title {
  font-weight: 700;
  color: var(--color-text-main);
  letter-spacing: -0.3px;
}
.font-bold {
  font-weight: 700;
}
.alarm-desc {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Premium Switch */
.toggle-switch-wrapper {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
}
.toggle-switch-wrapper input {
  opacity: 0;
  width: 0;
  height: 0;
}
.toggle-switch-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #E2E8F0;
  transition: .3s;
  border-radius: 34px;
}
.toggle-switch-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
input:checked + .toggle-switch-slider {
  background-color: var(--color-text-highlight);
}
input:checked + .toggle-switch-slider:before {
  transform: translateX(22px);
}

/* 보유 포인트 바 */
.points-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  border-radius: 12px;
  padding: 12px 18px;
  width: 100%;
}
.points-val {
  color: var(--color-text-highlight);
  font-weight: 700;
}

/* Buttons & Action */
.btn-action {
  width: 100%;
  background: var(--color-text-highlight);
  color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'SUIT', sans-serif;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(95, 97, 255, 0.2);
}
.btn-action:hover:not(:disabled) {
  background: #474aff;
  box-shadow: 0 6px 16px rgba(95, 97, 255, 0.3);
}
.btn-action:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.error-msg {
  color: var(--color-text-alert);
  text-align: center;
  margin-top: -8px;
}

/* 최근 당첨 내역 */
.history {
  width: 100%;
  margin-top: 8px;
}
.history-month-header {
  font-size: 20px;
  font-weight: 800;
  color: var(--color-text-main);
  margin-bottom: 12px;
  padding-left: 4px;
  letter-spacing: -0.5px;
}
.table-wrapper {
  width: 100%;
  border: 1px solid var(--color-border-outer);
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
}
.editor-table {
  width: 100%;
  border-collapse: collapse;
}
.editor-table th {
  background: var(--color-table-bg);
  border-bottom: 1px solid var(--color-border-outer);
  color: var(--color-text-muted);
  font-size: 12px;
  font-weight: 700;
  padding: 10px 14px;
  text-align: left;
  font-family: 'SUIT', sans-serif;
}
.editor-table td {
  border-bottom: 1px solid var(--color-border-inner);
  color: var(--color-text-muted);
  font-size: 13px;
  padding: 12px 14px;
  font-family: 'SUIT', sans-serif;
}
.editor-table tr:last-child td {
  border-bottom: none;
}
.col-reward {
  display: flex;
  align-items: center;
  gap: 8px;
}
.reward-tag {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.reward-name {
  font-weight: 600;
  color: var(--color-text-main);
}
.col-date {
  text-align: right;
}

/* 유의사항 푸터 영역 */
.notice-footer {
  background: #F4F5F7;
  padding: 24px 20px 48px;
  border-top: 1px solid var(--color-border-outer);
  width: 100%;
  margin-top: auto;
  font-family: 'SUIT', sans-serif;
  z-index: 1;
}
.notice-footer-title {
  font-size: 14px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
}
.notice-footer-content p {
  font-size: 12px;
  color: #666666;
  line-height: 20px;
  margin-bottom: 8px;
  position: relative;
  word-break: keep-all;
}
.notice-footer-content p:last-child {
  margin-bottom: 0;
}

/* 결과 모달 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
.modal-card .btn-action {
  margin-top: 8px;
}

/* 참여 방법 카드 */
.instruction-card {
  background: #FFFFFF;
  border: 1px solid var(--color-border-outer);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.instruction-title {
  color: var(--color-text-main);
  font-weight: 700;
}
.instruction-subtitle {
  color: var(--color-text-muted);
  margin-top: -8px;
  margin-bottom: 4px;
}
.step-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.step-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.step-badge-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  height: 100%;
}
.step-badge {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ECECFF;
  color: var(--color-text-highlight);
  font-size: 12px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'SUIT', sans-serif;
}
.step-line {
  width: 1.5px;
  flex-grow: 1;
  background: #ECECFF;
  min-height: 28px;
  margin: 4px 0;
}
.step-content {
  color: var(--color-text-main);
  padding-top: 1px;
  line-height: 20px;
  font-size: 13.5px;
}
.instruction-notice {
  color: var(--color-text-muted);
  font-size: 11.5px;
  line-height: 16px;
  margin-top: 8px;
  border-top: 1px solid var(--color-border-inner);
  padding-top: 12px;
  word-break: keep-all;
}

/* 모달 트랜지션 */
.modal-enter-active, .modal-leave-active { transition: all 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9); }
</style>

