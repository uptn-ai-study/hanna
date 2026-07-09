<template>
  <div class="game-table-container retro-box">
    <!-- 따뜻한 햇살 조명 효과 -->
    <div class="sunlight"></div>
    
    <!-- 테이블 탑 (파스텔 샌드/그린 러그 테마) -->
    <div class="table-top">
      <div class="mat-overlay"></div>
      
      <!-- 컵 배치 영역 -->
      <transition-group 
        name="cup-list" 
        tag="div" 
        class="cups-container"
        :class="`cups-${cupCount}`"
      >
        <div 
          v-for="(cup, index) in cups" 
          :key="cup.id" 
          class="cup-slot"
          :class="{ 
            'swapping-up': swapIndices.up === index,
            'swapping-down': swapIndices.down === index,
            'clickable': gameState === 'picking'
          }"
          @click="onCupClick(index)"
        >
          <!-- 귀여운 햄스터 캐릭터 (컵 뒤 바닥에 위치) -->
          <div 
            v-if="cup.hasBall" 
            class="ball-character" 
            :class="{ 
              'visible': isBallVisible,
              'found': gameState === 'result' && selectedIndex === index && winningIndex === index,
              'missed': gameState === 'result' && selectedIndex !== index && winningIndex === index
            }"
          >
            <!-- 햄스터 캐릭터 SVG (이미지와 싱크로율 매칭) -->
            <svg viewBox="0 0 80 80" class="hamster-svg">
              <!-- 몸체 -->
              <path d="M 25 70 Q 20 25 45 25 Q 70 25 65 70 Z" fill="#ffcc66" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
              <!-- 삐죽 튀어나온 주둥이 (왼쪽으로 뾰족) -->
              <path d="M 25 50 Q 15 50 20 54 Q 25 58 28 54 Z" fill="#ffcc66" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
              <!-- 주둥이 끝 검은 코 -->
              <circle cx="18" cy="52" r="3.5" fill="#000000" />
              <!-- 눈 2개 -->
              <circle cx="38" cy="42" r="3.5" fill="#000000" />
              <circle cx="56" cy="42" r="3.5" fill="#000000" />
              <!-- 분홍 볼터치 -->
              <ellipse cx="62" cy="50" rx="5" ry="3.5" fill="#ff9999" />
            </svg>
            <!-- 햄스터 바닥 그림자 -->
            <div class="hamster-shadow"></div>
          </div>
          
          <!-- 컵 바디 (클릭 시 들리는 모션) -->
          <div 
            class="cup-wrapper" 
            :class="{ 
              'lifted': isCupLifted(index),
              'wrong': gameState === 'result' && selectedIndex === index && winningIndex !== index,
              'correct': gameState === 'result' && selectedIndex === index && winningIndex === index
            }"
          >
            <!-- 사용자가 제공한 이미지 스타일의 오렌지 플라스틱 컵 SVG -->
            <svg viewBox="0 0 100 120" class="cup-svg">
              <!-- 컵 본체 (주황색 사다리꼴) -->
              <path d="M 18 12 L 82 12 Q 95 105 92 105 L 8 105 Q 5 105 18 12 Z" fill="#ff6b4a" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
              <!-- 컵 윗면 뚜껑 부분 타원 -->
              <ellipse cx="50" cy="12" rx="32" ry="7" fill="#ff8164" stroke="#000000" stroke-width="4.5" />
              <!-- 컵 밑면 흰색 띠 -->
              <path d="M 7 105 Q 50 115 93 105 L 91 113 Q 50 123 9 113 Z" fill="#ffffff" stroke="#000000" stroke-width="4.5" stroke-linejoin="round" />
            </svg>
            
            <!-- 컵 그림자 -->
            <div class="cup-shadow" :class="{ 'faded': isCupLifted(index) }"></div>
          </div>

          <!-- 컵 선택 지시 화살표 (선택 단계일 때) -->
          <div class="select-arrow" v-if="gameState === 'picking'">?</div>
        </div>
      </transition-group>
    </div>

    <!-- 진행 상황 안내 배너 (귀여운 카툰 톤) -->
    <div class="status-banner" v-if="gameState !== 'betting'">
      <div class="status-card retro-box">
        <p class="status-text">{{ statusMessage }}</p>
      </div>
      <div class="action-container" :class="{ 'hidden-action': !hasActions }">
        <button v-if="gameState === 'result' && selectedIndex === winningIndex" class="retro-btn gold action-btn next-btn" @click="$emit('next-round')">다음 스테이지로 ➡️</button>
        <button v-else-if="gameState === 'result' && selectedIndex !== winningIndex" class="retro-btn action-btn next-btn" style="background: #ff7675;" @click="$emit('next-round')">다시 도전하기!</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { GameState } from '../composables/useGameState'

interface CupItem {
  id: number;
  number: number;
  hasBall: boolean;
}

const props = defineProps<{
  cupCount: number;
  shuffleSpeed: number;
  shuffleCount: number;
  gameState: GameState;
  winningIndex: number;
  selectedIndex: number | null;
}>()

const emit = defineEmits<{
  (e: 'start-shuffling'): void;
  (e: 'finish-shuffling', finalWinningIndex: number): void;
  (e: 'select-cup', index: number): void;
  (e: 'next-round'): void;
}>()

const hasActions = computed(() => {
  return props.gameState === 'result'
})

// 컵 리스트 상태
const cups = ref<CupItem[]>([])

// 스왑 중인 인덱스 추적 (3D 입체 교차 애니메이션용)
const swapIndices = ref<{ up: number | null; down: number | null }>({
  up: null,
  down: null
})

// 햄스터 노출 여부
const isBallVisible = ref(false)

// 셔플 진행 중 상태 플래그
const isShufflingInProgress = ref(false)

// 셔플 트랜지션 속도 바인딩용
const transitionSpeedMs = computed(() => `${props.shuffleSpeed}ms`)

// 안내 메시지
const statusMessage = computed(() => {
  switch (props.gameState) {
    case 'showing_ball':
      return '햄스터가 숨어있는 컵을 잘 지켜보세요! 👀'
    case 'shuffling':
      return '컵이 섞이고 있어요! 어딨을까요? 👀'
    case 'picking':
      return '햄스터가 숨은 주황색 컵을 골라보세요!'
    case 'result':
      if (props.selectedIndex === props.winningIndex) {
        return '우와, 찾았습니다! 햄스터가 기뻐해요! 🎉'
      } else {
        return '앗, 빈 컵이네요! 다른 컵에 있어요 😢'
      }
    default:
      return ''
  }
})

// 컵 개수가 바뀌거나 라운드가 새로 시작되면 컵 재배치
watch(
  () => props.gameState,
  (newState) => {
    if (newState === 'betting') {
      initializeCups()
    } else if (newState === 'showing_ball') {
      initializeCupsWithBall()
      isBallVisible.value = true
      setTimeout(() => {
        isBallVisible.value = false
        setTimeout(() => {
          emit('start-shuffling')
        }, 400)
      }, 1800)
    } else if (newState === 'shuffling') {
      runShuffleProcess()
    }
  },
  { immediate: true }
)

// 컵 초기화 (베팅 대기 상태)
function initializeCups() {
  cups.value = Array.from({ length: props.cupCount }, (_, idx) => ({
    id: idx + 1,
    number: idx + 1,
    hasBall: false
  }))
  isBallVisible.value = false
  swapIndices.value = { up: null, down: null }
}

// 컵 초기화 및 구슬 배치
function initializeCupsWithBall() {
  cups.value = Array.from({ length: props.cupCount }, (_, idx) => ({
    id: idx + 1,
    number: idx + 1,
    hasBall: idx === props.winningIndex
  }))
}

// 컵이 위로 들려야 하는 상태인지 판별
function isCupLifted(index: number): boolean {
  if (props.gameState === 'showing_ball') {
    return cups.value[index]?.hasBall || false
  }
  if (props.gameState === 'result') {
    return index === props.winningIndex || index === props.selectedIndex
  }
  return false
}

// 셔플 프로세스 실행
async function runShuffleProcess() {
  if (isShufflingInProgress.value) return
  isShufflingInProgress.value = true
  isBallVisible.value = false

  let count = 0
  const totalSteps = props.shuffleCount

  const performSwap = () => {
    if (count >= totalSteps) {
      isShufflingInProgress.value = false
      swapIndices.value = { up: null, down: null }
      
      const finalWinningIdx = cups.value.findIndex(cup => cup.hasBall)
      emit('finish-shuffling', finalWinningIdx)
      return
    }

    let idxA = Math.floor(Math.random() * props.cupCount)
    let idxB = Math.floor(Math.random() * props.cupCount)
    while (idxA === idxB) {
      idxB = Math.floor(Math.random() * props.cupCount)
    }

    swapIndices.value = {
      up: idxA,
      down: idxB
    }

    const temp = cups.value[idxA]
    cups.value[idxA] = cups.value[idxB]
    cups.value[idxB] = temp

    count++
    
    setTimeout(() => {
      swapIndices.value = { up: null, down: null }
      performSwap()
    }, props.shuffleSpeed)
  }

  setTimeout(performSwap, 300)
}

function onCupClick(index: number) {
  if (props.gameState !== 'picking') return
  emit('select-cup', index)
}
</script>

<style scoped>
.game-table-container {
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 800px;
  flex-grow: 1;
  min-height: 0;
  background: #fdfaf2;
  border-radius: 20px;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 부드러운 햇살 효과 */
.sunlight {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 204, 0, 0.08) 0%, rgba(255, 204, 0, 0) 70%);
  pointer-events: none;
  z-index: 1;
}

/* 테이블 탑 (샌드 브라운 계열) */
.table-top {
  position: relative;
  flex-grow: 1;
  background: var(--table-bg);
  border-bottom: 20px solid #d2b48c;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.mat-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  /* 살짝 부드러운 도트 매트 스타일 */
  background-image: radial-gradient(rgba(0,0,0,0.03) 15%, transparent 15%);
  background-size: 16px 16px;
  pointer-events: none;
}

/* 컵 컨테이너 */
.cups-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 90%;
  max-width: 700px;
  position: relative;
  z-index: 2;
  height: 180px;
}

/* 컵 개수별 반응형 여백 및 크기 조절 (좁은 화면에서 컵이 겹치지 않도록) */
.cups-3 .cup-slot { width: 25%; }
.cups-4 .cup-slot { width: 20%; }
.cups-5 .cup-slot { width: 16%; }
.cups-6 .cup-slot { width: 13%; }

.cups-3 .cup-wrapper { width: 72px; height: 100px; }
.cups-4 .cup-wrapper { width: 64px; height: 89px; }
.cups-5 .cup-wrapper { width: 56px; height: 78px; }
.cups-6 .cup-wrapper { width: 50px; height: 70px; }

/* 개별 컵 슬롯 */
.cup-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  cursor: default;
  transition: all 0.2s ease;
}

.cup-slot.clickable {
  cursor: pointer;
}

.cup-slot.clickable:hover .cup-wrapper {
  transform: translateY(-5px);
}

/* 컵 래퍼 (들림 모션용) */
.cup-wrapper {
  position: relative;
  width: 72px;
  height: 100px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 5;
}

.cup-wrapper.lifted {
  /* 컵 자체 높이 기준 비율이라 크기가 달라져도 항상 자연스럽게 들림 */
  transform: translateY(-85%);
}

.cup-wrapper.wrong {
  animation: shake 0.5s ease;
}

.cup-wrapper.correct {
  animation: bounce 0.6s ease;
}

.cup-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0px 3px 0px rgba(0, 0, 0, 0.15));
}


/* 컵 그림자 */
.cup-shadow {
  position: absolute;
  bottom: -6px;
  left: 10%;
  width: 80%;
  height: 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  z-index: -1;
  transition: transform 0.4s, opacity 0.4s;
  pointer-events: none;
}

.cup-shadow.faded {
  transform: scale(0.6) translateY(20px);
  opacity: 0.1;
}

/* 귀여운 햄스터 캐릭터 */
.ball-character {
  position: absolute;
  bottom: 0px;
  width: 60px;
  height: 60px;
  z-index: 3;
  opacity: 0;
  transform: translateY(20px) scale(0.5);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.ball-character.visible {
  opacity: 1;
  transform: translateY(0px) scale(1);
}

/* 컵 개수가 많아질수록 햄스터도 살짝 작게 */
.cups-5 .ball-character { width: 50px; height: 50px; }
.cups-6 .ball-character { width: 42px; height: 42px; }

.hamster-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 0 rgba(0,0,0,0.1));
}

.hamster-shadow {
  position: absolute;
  bottom: -4px;
  left: 15%;
  width: 70%;
  height: 8px;
  background: rgba(0,0,0,0.2);
  border-radius: 50%;
  z-index: -1;
}

.ball-character.found {
  opacity: 1;
  animation: shine-success-bounce 1.5s infinite alternate;
}

.ball-character.missed {
  opacity: 0.9;
  transform: translateY(0px) scale(1);
}

/* 컵 선택 물음표 지시표 */
.select-arrow {
  position: absolute;
  top: -110px;
  font-size: 5rem;
  color: #ffcc00;
  text-shadow: 2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000;
  animation: bounce-arrow 0.6s infinite alternate;
  pointer-events: none;
  font-weight: bold;
}

/* 셔플 트랜지션 (v-move) */
.cup-list-move {
  transition: transform v-bind(transitionSpeedMs) cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 입체 스왑을 위한 추가 굴곡 애니메이션 */
.swapping-up {
  z-index: 10 !important;
}
.swapping-up .cup-wrapper {
  animation: swap-up-curve v-bind(transitionSpeedMs) ease-in-out;
}

.swapping-down {
  z-index: 4 !important;
}
.swapping-down .cup-wrapper {
  animation: swap-down-curve v-bind(transitionSpeedMs) ease-in-out;
}

/* 상태 배너 (귀여운 카툰 톤) */
.status-banner {
  padding: 12px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  z-index: 3;
}

.status-card {
  background: #ffffff;
  padding: 14px 20px;
  height: 92px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  overflow: hidden;
}

.status-text {
  font-size: 17.6px;
  color: var(--text-dark);
  font-weight: bold;
  letter-spacing: 1px;
}

@media (max-width: 600px) {
  .game-table-container {
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
  .cups-container {
    height: 190px;
  }
  .cup-wrapper {
    width: 78px;
    height: 108px;
  }
  .cups-3 .cup-wrapper { width: 78px; height: 108px; }
  .cups-4 .cup-wrapper { width: 64px; height: 89px; }
  .cups-5 .cup-wrapper { width: 52px; height: 72px; }
  .cups-6 .cup-wrapper { width: 44px; height: 61px; }
  .ball-character {
    width: 62px;
    height: 62px;
  }
  .cups-4 .ball-character { width: 52px; height: 52px; }
  .cups-5 .ball-character { width: 42px; height: 42px; }
  .cups-6 .ball-character { width: 36px; height: 36px; }
  .select-arrow {
    top: -100px;
    font-size: 4.4rem;
  }
  .status-banner {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }
  .status-card {
    padding: 12px 14px;
  }
}

.action-container {
  margin-top: 15px;
  min-height: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.2s ease, transform 0.2s ease, min-height 0.2s ease, margin-top 0.2s ease;
}

.action-container.hidden-action {
  margin-top: 0;
  min-height: 0;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.9);
}

.action-btn {
  font-size: 1.25rem;
  min-width: 160px;
}

.next-btn {
  background: #2ed573;
}

/* 키프레임 애니메이션 */
@keyframes swap-up-curve {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-40px) scale(1.15); }
}

@keyframes swap-down-curve {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(25px) scale(0.85); }
}

@keyframes bounce-arrow {
  from { transform: translateY(0); }
  to { transform: translateY(-8px); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(-90px); }
  50% { transform: translateY(-115px); }
}

@keyframes shine-success-bounce {
  0% { transform: translateY(0px) scale(1); }
  100% { transform: translateY(-10px) scale(1.1); }
}
</style>
