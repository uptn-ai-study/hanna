<template>
  <div class="ui-overlay-container">
    <!-- 상단 HUD 바 (스테이지, 최고기록, UP 개수, 아이템) -->
    <div class="hud-bar retro-box">
      <div class="hud-item stage-info">
        <span class="hud-label">STAGE</span>
        <span class="hud-value highlight-stage">⭐ {{ stage }}</span>
      </div>
      
      <div class="hud-item score-info">
        <span class="hud-label">BEST STAGE</span>
        <span class="hud-value">{{ highScore }}</span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { GameState } from '../composables/useGameState'

const props = defineProps<{
  highScore: number;
  stage: number;
  betAmount: number;
  gameState: GameState;
  cupCount: number;
}>()

const emit = defineEmits<{
  (e: 'set-bet', amount: number): void;
  (e: 'start-game'): void;
  (e: 'next-round'): void;
  (e: 'reset-game'): void;
}>()
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
