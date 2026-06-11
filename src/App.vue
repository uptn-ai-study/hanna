<template>
  <main class="game-container">
    <!-- 게임 헤더 -->
    <header class="game-header">
      <h1 class="main-title">🐹 귀여운 햄스터 찾기!</h1>
      <p class="subtitle">주황색 컵 밑에 숨어 있는 햄스터를 눈으로 쫓아가 볼까요?</p>
    </header>

    <!-- 게임 레이아웃 (HUD + 컨트롤러) -->
    <UIOverlay
      :high-score="highScore"
      :stage="stage"
      :bet-amount="betAmount"
      :game-state="gameState"
      :cup-count="cupCount"
      @set-bet="setBetAmount"
      @start-game="startGame"
      @next-round="nextRound"
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
      @start-game="startGame"
      @next-round="nextRound"
    />

    <!-- 하단 랭킹 보드 -->
    <RankingBoard :rankings="rankings" />



    <!-- 배고픔(게임오버) 모달 -->
    <div v-if="gameState === 'gameover'" class="gameover-modal-overlay">
      <div class="gameover-container retro-box">
        <h2 class="gameover-title">😭 아쉽게도 틀렸어요!</h2>
        <p class="gameover-desc">
          햄스터는 다른 컵에 숨어 있었네요...<br>
          <span class="final-score">최종 도달 스테이지: <strong class="highlight-gold">{{ stage }} 스테이지</strong></span>
        </p>
        <div class="gameover-actions">
          <button class="retro-btn gold next-btn" @click="resetGame">
            🔄 다시 도전하기
          </button>
        </div>
      </div>
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
import UIOverlay from './components/UIOverlay.vue'
import GameTable from './components/GameTable.vue'
import RankingBoard from './components/RankingBoard.vue'

const {
  playerName,
  highScore,
  rankings,
  stage,
  betAmount,
  gameState,
  winningIndex,
  selectedIndex,
  cupCount,
  shuffleSpeed,
  shuffleCount,
  setBetAmount,
  setPlayerName,
  startGame,
  startShuffling,
  finishShuffling,
  selectCup,
  nextRound,
  resetGame
} = useGameState()

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
</style>
