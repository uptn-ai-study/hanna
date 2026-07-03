<template>
  <div class="ui-overlay-container" v-show="gameState === 'betting'">
    <!-- 컵 영역 위에 떠 있는 스테이지 정보 -->
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

defineProps<{
  highScore: number;
  stage: number;
  gameState: GameState;
}>()
</script>

<style scoped>
.ui-overlay-container {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 90%;
  max-width: 360px;
}

/* HUD Bar */
.hud-bar {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 12px 20px;
  background: #ffffff;
  gap: 15px;
  width: 100%;
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
  font-size: 2.8rem;
  font-weight: bold;
}

.highlight-stage {
  color: #ff9f43;
}

@media (max-width: 600px) {
  .ui-overlay-container {
    top: 10px;
    gap: 8px;
  }
  .hud-bar {
    padding: 6px 10px;
    gap: 8px;
  }
  .hud-item {
    min-width: 60px;
  }
  .hud-label {
    font-size: 0.7rem;
    letter-spacing: 0.5px;
  }
  .hud-value {
    font-size: 2.2rem;
  }
}
</style>
