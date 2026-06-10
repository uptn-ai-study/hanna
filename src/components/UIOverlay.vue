<template>
  <div class="ui-overlay-container">
    <!-- 상단 HUD 바 (스테이지, 최고기록, 씨앗 개수, 아이템) -->
    <div class="hud-bar retro-box">
      <div class="hud-item stage-info">
        <span class="hud-label">STAGE</span>
        <span class="hud-value highlight-stage">⭐ {{ stage }}</span>
      </div>
      
      <div class="hud-item score-info">
        <span class="hud-label">BEST STAGE</span>
        <span class="hud-value">{{ highScore }}</span>
      </div>
      
      <div class="hud-item points-info">
        <span class="hud-label">SEED</span>
        <span class="hud-value highlight-seed">🌻 {{ points.toLocaleString() }}</span>
      </div>

      <div class="hud-item item-info">
        <span class="hud-label">SLOW-MO</span>
        <div class="item-badge-container">
          <span class="item-icon">⏳</span>
          <span class="hud-value">{{ slowMotionItems }}</span>
        </div>
      </div>
    </div>

    <!-- 하단 컨트롤 패널 (베팅 설정 및 액션 실행) -->
    <div class="control-panel retro-box">
      <!-- 베팅 단계 조작 UI -->
      <div v-if="gameState === 'betting'" class="betting-controls">
        <div class="bet-input-section">
          <label class="bet-label">나눌 씨앗 개수 설정</label>
          <div class="bet-display">
            <span class="bet-value">🌻 {{ betAmount.toLocaleString() }} 개</span>
            <span class="bet-ratio">(성공하면 {{ cupCount }}배로 돌려받아요!)</span>
          </div>
          <div class="bet-buttons">
            <button class="retro-btn" @click="adjustBet(100)">+100</button>
            <button class="retro-btn" @click="adjustBet(500)">+500</button>
            <button class="retro-btn gold" @click="adjustBet(-1)">모두 걸기</button>
            <button class="retro-btn red" @click="resetBet">다시 설정</button>
          </div>
        </div>

        <div class="action-section">
          <!-- 슬로우 모션 사용 버튼 -->
          <button 
            class="retro-btn item-btn"
            :class="{ 'active': isSlowMotionActive }"
            :disabled="slowMotionItems <= 0 || isSlowMotionActive"
            @click="useSlowMotion"
          >
            ⏳ 슬로우 모션 {{ isSlowMotionActive ? '적용됨' : '사용' }}
          </button>

          <!-- 게임 시작 버튼 -->
          <button class="retro-btn gold start-btn" @click="startGame">
            준비 완료! 🐹
          </button>
        </div>
      </div>

      <!-- 게임 실행 상태 중의 UI -->
      <div v-else class="gameplay-actions">
        <div class="current-bet-info">
          <span>나눈 씨앗: <strong>🌻 {{ betAmount }} 개</strong></span>
          <span v-if="isSlowMotionActive" class="slowmo-tag">⚡ 햄스터가 느려졌어요!</span>
        </div>

        <div v-if="gameState === 'picking'" class="picking-tip">
          햄스터가 들어간 컵을 가볍게 콕 눌러보세요!
        </div>

        <!-- 결과 확인 단계에서의 다음 스테이지 진행 버튼 -->
        <div v-if="gameState === 'result'" class="result-actions">
          <button class="retro-btn gold next-btn" @click="nextRound">
            {{ isNextRoundGameOver ? '결과 확인...' : '다음 스테이지로 ➡️' }}
          </button>
        </div>
      </div>

      <!-- 하단 공통 유틸리티 버튼 -->
      <div class="utility-buttons">
        <button 
          class="retro-btn shop-trigger-btn"
          :disabled="gameState !== 'betting'"
          @click="$emit('open-shop')"
        >
          🛒 다람쥐의 씨앗 상점
        </button>
        <button 
          class="retro-btn reset-trigger-btn red"
          @click="onResetClick"
        >
          🔄 처음부터 다시
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GameState } from '../composables/useGameState'

const props = defineProps<{
  points: number;
  highScore: number;
  slowMotionItems: number;
  stage: number;
  betAmount: number;
  gameState: GameState;
  cupCount: number;
  isSlowMotionActive: boolean;
}>()

const emit = defineEmits<{
  (e: 'set-bet', amount: number): void;
  (e: 'start-game'): void;
  (e: 'use-slowmo'): void;
  (e: 'next-round'): void;
  (e: 'open-shop'): void;
  (e: 'reset-game'): void;
}>()

const isNextRoundGameOver = computed(() => {
  return props.points <= 0
})

function adjustBet(val: number) {
  if (val === -1) {
    emit('set-bet', -1)
  } else {
    emit('set-bet', props.betAmount + val)
  }
}

function resetBet() {
  emit('set-bet', 100)
}

function startGame() {
  emit('start-game')
}

function useSlowMotion() {
  emit('use-slowmo')
}

function nextRound() {
  emit('next-round')
}

function onResetClick() {
  if (confirm('모든 씨앗과 최고 기록이 초기화됩니다. 정말로 초기화할까요?')) {
    emit('reset-game')
  }
}
</script>

<style scoped>
.ui-overlay-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

/* HUD Bar */
.hud-bar {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 12px 20px;
  background: #ffffff;
  gap: 15px;
}

.hud-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}

.hud-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 2px;
  letter-spacing: 1px;
  font-weight: bold;
}

.hud-value {
  font-size: 1.4rem;
  font-weight: bold;
}

.highlight-stage {
  color: #ff9f43;
}

.highlight-seed {
  color: #ffa502;
}

.item-badge-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.item-icon {
  font-size: 1.2rem;
}

/* Control Panel */
.control-panel {
  padding: 20px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Betting Controls */
.betting-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bet-input-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bet-label {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-dark);
}

.bet-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.bet-value {
  font-size: 1.8rem;
  color: #ffa502;
  font-weight: bold;
}

.bet-ratio {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.bet-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 5px;
}

.bet-buttons button {
  min-width: 80px;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.item-btn {
  background: #e1f5fe;
}

.item-btn.active {
  background: #ffeaa7;
  animation: pulse-slowmo 1.5s infinite alternate;
}

.start-btn {
  min-width: 160px;
  font-size: 1.25rem;
}

/* Gameplay actions */
.gameplay-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}

.current-bet-info {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 15px;
}

.slowmo-tag {
  background: #fff9db;
  border: 2px dashed #ffa502;
  color: #d87d00;
  padding: 4px 8px;
  font-size: 0.85rem;
  border-radius: 6px;
}

.picking-tip {
  font-size: 1.05rem;
  color: #ffa502;
  font-weight: bold;
}

.result-actions {
  margin-top: 10px;
}

.next-btn {
  font-size: 1.2rem;
  min-width: 180px;
}

/* Utility buttons */
.utility-buttons {
  display: flex;
  justify-content: space-between;
  border-top: 2px dashed #eddcb9;
  padding-top: 15px;
}

.shop-trigger-btn {
  background: #fff2cc;
}

.reset-trigger-btn {
  font-size: 0.9rem;
  padding: 6px 12px;
}

@keyframes pulse-slowmo {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}
</style>
