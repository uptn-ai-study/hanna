<template>
  <main class="game-container">
    <!-- 게임 설명(인트로) 화면 -->
    <IntroScreen
      v-if="currentView === 'intro'"
      :high-score="highScore"
      @start="currentView = 'game'"
      @view-ranking="currentView = 'ranking'"
    />

    <!-- 게임 화면 (전체 화면) -->
    <div v-else-if="currentView === 'game'" class="tab-content game-view">
      <button class="back-btn back-btn-floating" @click="leaveGame" aria-label="뒤로가기">⬅</button>

      <!-- 컵 영역 위에 떠 있는 HUD (시작 전에만 노출) -->
      <UIOverlay
        :high-score="highScore"
        :stage="stage"
        :game-state="gameState"
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
        @next-round="nextRound"
      />

      <!-- 화면 하단 시작 버튼 (시작 전에만 노출) -->
      <div class="game-start-cta" v-show="gameState === 'betting'">
        <button class="retro-btn gold start-game-btn" @click="startGame">
          시작!
        </button>
      </div>
    </div>

    <!-- 랭킹 화면 -->
    <div v-else-if="currentView === 'ranking'" class="tab-content ranking-view">
      <button class="back-btn back-btn-floating" @click="currentView = 'intro'" aria-label="뒤로가기">⬅</button>
      <header class="game-header">
        <div class="header-titles">
          <h1 class="main-title">🏆 명예의 전당</h1>
          <p class="subtitle">최고의 햄스터 훈련사들을 만나보세요!</p>
        </div>
      </header>

      <!-- 랭킹 보드 -->
      <RankingBoard :rankings="rankings" />
    </div>

    <!-- 닉네임 설정 모달 -->
    <div v-if="showNicknameModal" class="nickname-modal-overlay">
      <div class="nickname-container retro-box">
        <h2 class="nickname-title">🐹 닉네임을 정해주세요!</h2>
        <p class="nickname-desc">새로운 햄스터 친구, 반가워요!</p>
        <div class="nickname-input-group">
          <input 
            type="text" 
            v-model="tempNickname" 
            class="nickname-input" 
            maxlength="10"
            placeholder="닉네임 입력"
            @keyup.enter="confirmNickname"
          />
        </div>
        <div class="nickname-actions">
          <button class="retro-btn gold confirm-btn" @click="confirmNickname">
            ✨ 이 이름으로 시작하기
          </button>
        </div>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGameState } from './composables/useGameState'
import IntroScreen from './components/IntroScreen.vue'
import UIOverlay from './components/UIOverlay.vue'
import GameTable from './components/GameTable.vue'
import RankingBoard from './components/RankingBoard.vue'

const currentView = ref<'intro' | 'game' | 'ranking'>('intro')

const {
  playerName,
  highScore,
  rankings,
  stage,
  gameState,
  winningIndex,
  selectedIndex,
  cupCount,
  shuffleSpeed,
  shuffleCount,
  setPlayerName,
  startGame,
  startShuffling,
  finishShuffling,
  selectCup,
  nextRound,
  resetGame
} = useGameState()

const leaveGame = () => {
  resetGame()
  currentView.value = 'intro'
}

const showNicknameModal = ref(false)
const tempNickname = ref('')

const randomNicknames = [
  '날쌘다람쥐', '착한햄스터', '바쁜청설모', '용감한토끼', '배고픈불곰',
  '귀여운수달', '멋쟁이사자', '행복한쿼카', '잽싼고양이', '졸린강아지'
]

onMounted(() => {
  if (!playerName.value) {
    tempNickname.value = randomNicknames[Math.floor(Math.random() * randomNicknames.length)]
    showNicknameModal.value = true
  }
})

const confirmNickname = () => {
  if (tempNickname.value.trim().length > 0) {
    setPlayerName(tempNickname.value.trim())
    showNicknameModal.value = false
  }
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
  height: 100dvh;
  overflow: hidden;
  box-sizing: border-box;
  padding: 20px 15px;
}

.tab-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  overflow: hidden;
}

.game-header {
  margin-bottom: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 0 24px;
}

.game-view,
.ranking-view {
  position: relative;
}

.back-btn {
  flex-shrink: 0;
  background: #ffffff;
  border: 3px solid #000000;
  border-radius: 10px;
  box-shadow: 3px 3px 0 #000000;
  width: 40px;
  height: 40px;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.05s, box-shadow 0.05s;
}

.back-btn-floating {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 30;
}

.game-start-cta {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  width: 90%;
  max-width: 360px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.start-game-btn {
  width: 100%;
  font-size: 1.3rem;
  padding: 16px;
}

.back-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #000000;
}

.back-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 #000000;
}

.header-titles {
  text-align: center;
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

@keyframes gameover-bounce {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* 닉네임 설정 모달 */
.nickname-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(8px);
}

.nickname-container {
  width: 90%;
  max-width: 400px;
  background: #ffffff;
  text-align: center;
  padding: 30px 20px;
  animation: gameover-bounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.nickname-title {
  font-size: 1.6rem;
  color: #ff9f43;
  margin-bottom: 10px;
}

.nickname-desc {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 25px;
}

.nickname-input-group {
  margin-bottom: 25px;
}

.nickname-input {
  width: 80%;
  padding: 12px 15px;
  font-size: 1.2rem;
  text-align: center;
  border: 3px solid #f1c40f;
  border-radius: 12px;
  outline: none;
  font-family: inherit;
  color: var(--text-dark);
  font-weight: bold;
  transition: all 0.2s ease;
  background: #fff9db;
}

.nickname-input:focus {
  border-color: #f39c12;
  box-shadow: 0 0 0 4px rgba(241, 196, 15, 0.3);
}

.nickname-actions {
  display: flex;
  justify-content: center;
}

.confirm-btn {
  font-size: 1.15rem;
  padding: 12px 24px;
  width: 80%;
}

@media (max-width: 600px) {
  .game-container {
    padding: 10px 8px;
    gap: 8px;
  }
  .tab-content {
    gap: 8px;
  }
  .game-header {
    padding: 18px 0 15px;
  }
  .back-btn {
    width: 34px;
    height: 34px;
    font-size: 1rem;
  }
  .back-btn-floating {
    top: 8px;
    left: 8px;
  }
  .game-start-cta {
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
  }
  .start-game-btn {
    font-size: 1.1rem;
    padding: 14px;
  }
  .main-title {
    font-size: 1.6rem;
    letter-spacing: 1px;
  }
  .subtitle {
    font-size: 0.85rem;
  }
  .nickname-container {
    padding: 20px 15px;
  }
  .nickname-title {
    font-size: 1.3rem;
  }
  .nickname-desc {
    font-size: 0.9rem;
    margin-bottom: 15px;
  }
  .nickname-input {
    font-size: 1rem;
    padding: 10px;
  }
  .confirm-btn {
    font-size: 1rem;
    padding: 10px 16px;
  }
}
</style>
