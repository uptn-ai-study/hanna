<template>
  <main class="game-container">
    <!-- 게임 헤더 -->
    <header class="game-header">
      <h1 class="main-title">🐹 귀여운 햄스터 찾기!</h1>
      <p class="subtitle">주황색 컵 밑에 숨어 있는 햄스터를 눈으로 쫓아가 볼까요?</p>
    </header>

    <!-- 게임 레이아웃 (HUD + 컨트롤러) -->
    <UIOverlay
      :points="points"
      :high-score="highScore"
      :slow-motion-items="slowMotionItems"
      :stage="stage"
      :bet-amount="betAmount"
      :game-state="gameState"
      :cup-count="cupCount"
      :is-slow-motion-active="isSlowMotionActive"
      @set-bet="setBetAmount"
      @start-game="startGame"
      @use-slowmo="useSlowMotion"
      @next-round="nextRound"
      @open-shop="showShopModal = true"
      @reset-game="resetGame"
    />

    <!-- 게임 테이블 (컵 배치 및 셔플링) -->
    <GameTable
      :cup-count="cupCount"
      :shuffle-speed="shuffleSpeed"
      :shuffle-count="shuffleCount"
      :game-state="gameState"
      :winning-index="winningIndex"
      :selected-index="selectedIndex"
      @start-shuffling="startShuffling"
      @finish-shuffling="finishShuffling"
      @select-cup="selectCup"
    />

    <!-- 아이템 상점 모달 -->
    <ShopModal
      v-if="showShopModal"
      :points="points"
      :slow-motion-items="slowMotionItems"
      @close="showShopModal = false"
      @buy-item="buySlowMotion"
      @trigger-ad="onShopTriggerAd"
    />

    <!-- 가상 광고 시뮬레이터 모달 -->
    <AdSimulator
      v-if="showAdModal"
      @close="showAdModal = false"
      @reward="watchAdReward"
    />

    <!-- 배고픔(게임오버) 모달 -->
    <div v-if="gameState === 'gameover'" class="gameover-modal-overlay">
      <div class="gameover-container retro-box">
        <h2 class="gameover-title">😭 배고픈 햄스터!</h2>
        <p class="gameover-desc">
          나눠줄 씨앗이 전부 떨어져서 햄스터들이 슬퍼하고 있어요...<br>
          <span class="final-score">최종 도달 스테이지: <strong class="highlight-gold">{{ stage }} 스테이지</strong></span>
        </p>
        <div class="gameover-actions">
          <button class="retro-btn gold ad-resurrect-btn" @click="showAdModal = true">
            📺 광고 보고 무료 씨앗 받기 (+500개)
          </button>
          <button class="retro-btn red reset-resurrect-btn" @click="resetGame">
            🔄 씨앗 새로 받기 (1,000개)
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useGameState } from './composables/useGameState'
import UIOverlay from './components/UIOverlay.vue'
import GameTable from './components/GameTable.vue'
import ShopModal from './components/ShopModal.vue'
import AdSimulator from './components/AdSimulator.vue'

const {
  points,
  highScore,
  slowMotionItems,
  stage,
  betAmount,
  gameState,
  winningIndex,
  selectedIndex,
  isSlowMotionActive,
  showAdModal,
  showShopModal,
  cupCount,
  shuffleSpeed,
  shuffleCount,
  setBetAmount,
  startGame,
  startShuffling,
  finishShuffling,
  selectCup,
  nextRound,
  useSlowMotion,
  buySlowMotion,
  watchAdReward,
  resetGame
} = useGameState()

// 상점에서 광고 호출 시 상점을 닫고 광고를 켬
function onShopTriggerAd() {
  showShopModal.value = false
  showAdModal.value = true
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.game-header {
  margin-bottom: 10px;
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

/* 게임오버 모달 */
.gameover-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 120;
  backdrop-filter: blur(5px);
}

.gameover-container {
  width: 90%;
  max-width: 440px;
  background: #ffffff;
  text-align: center;
  animation: gameover-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.gameover-title {
  font-size: 1.8rem;
  color: #ff7675;
  margin-bottom: 15px;
}

.gameover-desc {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-dark);
  margin-bottom: 25px;
}

.final-score {
  display: block;
  margin-top: 10px;
  font-size: 1.15rem;
  font-weight: bold;
}

.highlight-gold {
  color: #ffa502;
}

.gameover-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ad-resurrect-btn {
  font-size: 1.1rem;
  padding: 12px;
}

.reset-resurrect-btn {
  font-size: 0.95rem;
  padding: 8px;
}

@keyframes gameover-bounce {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
