<template>
  <div class="intro-screen">
    <div class="intro-scroll">
      <header class="game-header">
        <h1 class="main-title">🐹 귀여운 햄스터 찾기!</h1>
        <p class="subtitle">주황색 컵 속 햄스터를 눈으로 쫓아볼까요?</p>
      </header>

      <div class="intro-illustration retro-box">
        <div class="illustration-sunlight"></div>
        <transition-group name="mini-cup" tag="div" class="mini-cups-row">
          <div
            v-for="(cup, index) in miniCups"
            :key="cup.id"
            class="mini-cup-slot"
            :class="{ 'mini-swap-up': miniSwap.up === index, 'mini-swap-down': miniSwap.down === index }"
          >
            <!-- 컵 속 햄스터 -->
            <div class="mini-hamster" :class="{ visible: cup.hasBall && miniRevealed }">
              <svg viewBox="0 0 80 80" class="mini-hamster-svg">
                <path d="M 25 70 Q 20 25 45 25 Q 70 25 65 70 Z" fill="#ffcc66" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
                <path d="M 25 50 Q 15 50 20 54 Q 25 58 28 54 Z" fill="#ffcc66" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
                <circle cx="18" cy="52" r="3.5" fill="#000000" />
                <circle cx="38" cy="42" r="3.5" fill="#000000" />
                <circle cx="56" cy="42" r="3.5" fill="#000000" />
                <ellipse cx="62" cy="50" rx="5" ry="3.5" fill="#ff9999" />
              </svg>
            </div>
            <!-- 컵 -->
            <div class="mini-cup-wrapper" :class="{ lifted: cup.hasBall && miniRevealed }">
              <svg viewBox="0 0 100 120" class="mini-cup-svg">
                <path d="M 18 12 L 82 12 Q 95 105 92 105 L 8 105 Q 5 105 18 12 Z" fill="#ff6b4a" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
                <ellipse cx="50" cy="12" rx="32" ry="7" fill="#ff8164" stroke="#000000" stroke-width="4.5" />
                <path d="M 7 105 Q 50 115 93 105 L 91 113 Q 50 123 9 113 Z" fill="#ffffff" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </transition-group>
      </div>

      <div class="intro-stat retro-box">
        <div class="stat-info">
          <span class="stat-label">내 최고 기록</span>
          <span class="stat-value">⭐ {{ highScore }} 스테이지</span>
        </div>
        <button class="retro-btn ranking-link-btn" @click="$emit('view-ranking')">
          🏆 랭킹보기
        </button>
      </div>

      <div class="intro-howto retro-box">
        <h2 class="howto-title">게임방법</h2>
        <ul class="howto-list">
          <li>컵 속에 숨은 햄스터의 위치를 잘 기억하세요!</li>
          <li>컵들이 빠르게 섞이니 눈을 떼지 마세요.</li>
          <li>정답 컵을 고르면 다음 스테이지로 이동해요.</li>
          <li>틀리면 게임 종료! 최고 스테이지에 도전해보세요.</li>
        </ul>
      </div>
    </div>

    <div class="intro-cta">
      <button class="retro-btn gold start-cta-btn" @click="$emit('start')">
        시작하기
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  highScore: number
}>()

defineEmits<{
  (e: 'start'): void
  (e: 'view-ranking'): void
}>()

interface MiniCup {
  id: number;
  hasBall: boolean;
}

const MINI_CUP_COUNT = 3

// 미리보기용 미니 컵 셔플 시뮬레이션 (연출 전용, 게임 로직과 무관)
const miniCups = ref<MiniCup[]>(
  Array.from({ length: MINI_CUP_COUNT }, (_, idx) => ({ id: idx, hasBall: false }))
)
const miniRevealed = ref(false)
const miniSwap = ref<{ up: number | null; down: number | null }>({ up: null, down: null })

let miniTimer: ReturnType<typeof setTimeout> | null = null

function pickRandomIndex(): number {
  return Math.floor(Math.random() * MINI_CUP_COUNT)
}

function shuffleMiniCups(step: number, totalSteps: number, onDone: () => void) {
  if (step >= totalSteps) {
    miniTimer = setTimeout(onDone, 250)
    return
  }

  let idxA = pickRandomIndex()
  let idxB = pickRandomIndex()
  while (idxA === idxB) {
    idxB = pickRandomIndex()
  }

  miniSwap.value = { up: idxA, down: idxB }
  const temp = miniCups.value[idxA]
  miniCups.value[idxA] = miniCups.value[idxB]
  miniCups.value[idxB] = temp

  miniTimer = setTimeout(() => {
    miniSwap.value = { up: null, down: null }
    shuffleMiniCups(step + 1, totalSteps, onDone)
  }, 380)
}

function runMiniCycle() {
  // 1. 정답 컵을 잠깐 보여준다
  const winningIdx = pickRandomIndex()
  miniCups.value = miniCups.value.map((cup, idx) => ({ ...cup, hasBall: idx === winningIdx }))
  miniRevealed.value = true

  miniTimer = setTimeout(() => {
    // 2. 컵을 덮는다
    miniRevealed.value = false

    miniTimer = setTimeout(() => {
      // 3. 컵을 섞는다
      shuffleMiniCups(0, 6, () => {
        // 4. 섞인 후 정답 위치를 다시 보여준다
        miniRevealed.value = true
        miniTimer = setTimeout(runMiniCycle, 1400)
      })
    }, 400)
  }, 1100)
}

onMounted(() => {
  runMiniCycle()
})

onUnmounted(() => {
  if (miniTimer) clearTimeout(miniTimer)
})
</script>

<style scoped>
.intro-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.intro-scroll {
  width: 100%;
  max-width: 800px;
  flex-grow: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
}

.game-header {
  margin-bottom: 0;
  padding: 30px 0 24px;
}

.main-title {
  font-size: 2.2rem;
  color: #ff9f43;
  text-shadow: 2px 2px 0 #000;
  margin-bottom: 5px;
  letter-spacing: 1.5px;
}

.subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  font-weight: bold;
}

.intro-illustration {
  position: relative;
  width: 100%;
  flex-grow: 1;
  min-height: 150px;
  max-height: 420px;
  background: #fdfaf2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 12px 8px;
  overflow: hidden;
}

.intro-stat,
.intro-howto {
  flex-shrink: 0;
}

.illustration-sunlight {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(255, 204, 0, 0.12) 0%, rgba(255, 204, 0, 0) 70%);
  pointer-events: none;
}

/* 미니 컵 셔플 시뮬레이션 (박스 안에서 중앙 정렬, 박스가 좁아지면 유동적으로 축소) */
.mini-cups-row {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  max-width: 320px;
  height: min(200px, 100%);
}

.mini-cup-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
  height: 100%;
}

.mini-cup-wrapper {
  position: relative;
  width: auto;
  height: min(110px, 60%);
  aspect-ratio: 62 / 86;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 5;
}

.mini-cup-wrapper.lifted {
  /* 컵 자체 높이 비율이라 박스가 줄어도 자연스럽게 들림 */
  transform: translateY(-74%);
}

.mini-cup-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0px 3px 0px rgba(0, 0, 0, 0.15));
}

.mini-hamster {
  position: absolute;
  bottom: 0;
  width: auto;
  height: min(60px, 35%);
  aspect-ratio: 1 / 1;
  z-index: 3;
  opacity: 0;
  transform: translateY(16px) scale(0.5);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.mini-hamster.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.mini-hamster-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 3px 0 rgba(0, 0, 0, 0.1));
}

/* 셔플 시 위치 이동 애니메이션 */
.mini-cup-move {
  transition: transform 0.38s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.mini-swap-up {
  z-index: 10 !important;
}
.mini-swap-up .mini-cup-wrapper {
  animation: mini-swap-up-curve 0.38s ease-in-out;
}

.mini-swap-down {
  z-index: 4 !important;
}
.mini-swap-down .mini-cup-wrapper {
  animation: mini-swap-down-curve 0.38s ease-in-out;
}

@keyframes mini-swap-up-curve {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.12); }
}

@keyframes mini-swap-down-curve {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(18px) scale(0.88); }
}

.intro-stat {
  width: 100%;
  background: #ffffff;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: bold;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--text-dark);
}

.ranking-link-btn {
  background: #fff3e0;
  font-size: 0.95rem;
  padding: 10px 16px;
  white-space: nowrap;
}

.intro-howto {
  width: 100%;
  background: #ffffff;
  padding: 18px;
  text-align: left;
}

.howto-title {
  font-size: 1.1rem;
  color: var(--text-dark);
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.howto-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.howto-list li {
  font-size: 0.95rem;
  color: var(--text-dark);
  line-height: 1.5;
  padding-left: 22px;
  position: relative;
}

.howto-list li::before {
  content: '🐹';
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.9rem;
}

.intro-cta {
  width: 100%;
  max-width: 800px;
  flex-shrink: 0;
  padding: 12px 0 calc(4px + env(safe-area-inset-bottom));
}

.start-cta-btn {
  width: 100%;
  font-size: 1.3rem;
  padding: 16px;
}

@media (max-width: 600px) {
  .intro-scroll {
    gap: 10px;
  }
  .game-header {
    padding: 18px 0 15px;
  }
  .main-title {
    font-size: 1.6rem;
    letter-spacing: 1px;
  }
  .subtitle {
    font-size: 0.85rem;
  }
  .intro-illustration {
    min-height: 90px;
    max-height: 320px;
    padding: 14px 8px 6px;
  }
  .mini-cups-row {
    max-width: 240px;
    height: min(150px, 100%);
  }
  .mini-cup-wrapper {
    height: min(84px, 60%);
  }
  .mini-hamster {
    height: min(46px, 32%);
  }
  .intro-stat {
    padding: 12px 14px;
  }
  .stat-value {
    font-size: 1.1rem;
  }
  .ranking-link-btn {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
  .intro-howto {
    padding: 14px;
  }
  .howto-list li {
    font-size: 0.85rem;
  }
  .start-cta-btn {
    font-size: 1.1rem;
    padding: 14px;
  }
}
</style>
