import { ref, computed, watch } from 'vue'

export type GameState = 'betting' | 'showing_ball' | 'shuffling' | 'picking' | 'result' | 'gameover'

export interface RankingRecord {
  id: string;
  stage: number;
}

// Local Storage Keys
const STORAGE_KEYS = {
  HIGH_SCORE: 'yabawi_high_score',
  RANKING: 'yabawi_ranking'
}

export function useGameState() {
  // Persistence Loading
  const loadStored = (key: string, defaultValue: number): number => {
    const val = localStorage.getItem(key)
    return val !== null ? parseInt(val, 10) : defaultValue
  }

  const loadRanking = (): RankingRecord[] => {
    const val = localStorage.getItem(STORAGE_KEYS.RANKING)
    if (val) {
      return JSON.parse(val)
    }
    return [
      { id: '다람쥐대장', stage: 25 },
      { id: '도토리도둑', stage: 18 },
      { id: '햄스터박사', stage: 14 },
      { id: '씨앗수집가', stage: 10 },
      { id: '빠른쳇바퀴', stage: 7 }
    ]
  }

  // Reactive State
  const highScore = ref<number>(loadStored(STORAGE_KEYS.HIGH_SCORE, 1))
  const rankings = ref<RankingRecord[]>(loadRanking())
  const stage = ref<number>(1)
  const betAmount = ref<number>(100) // unused, can be removed but keeping structure
  const gameState = ref<GameState>('betting')
  
  const winningIndex = ref<number>(0)
  const selectedIndex = ref<number | null>(null)

  // Watchers to persist state
  watch(highScore, (newVal) => localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, newVal.toString()))
  watch(rankings, (newVal) => localStorage.setItem(STORAGE_KEYS.RANKING, JSON.stringify(newVal)), { deep: true })

  // Computed Values
  const cupCount = computed(() => {
    if (stage.value <= 2) return 3
    if (stage.value <= 4) return 4
    if (stage.value <= 6) return 5
    return 6 // Max 6 cups
  })

  const shuffleSpeed = computed(() => {
    return Math.max(120, 300 - (stage.value * 12))
  })

  const shuffleCount = computed(() => {
    // Stage increases -> more shuffles
    return Math.min(18, 5 + stage.value)
  })

  // Methods
  const setBetAmount = (amount: number) => {
    if (gameState.value !== 'betting') return
    betAmount.value = amount
  }

  const startGame = () => {
    if (gameState.value !== 'betting') return
    
    // Choose winning cup randomly
    winningIndex.value = Math.floor(Math.random() * cupCount.value)
    selectedIndex.value = null
    
    gameState.value = 'showing_ball'
  }

  const startShuffling = () => {
    if (gameState.value !== 'showing_ball') return
    gameState.value = 'shuffling'
  }

  const finishShuffling = (finalWinningIndex: number) => {
    if (gameState.value !== 'shuffling') return
    winningIndex.value = finalWinningIndex
    gameState.value = 'picking'
  }

  const selectCup = (index: number) => {
    if (gameState.value !== 'picking') return
    selectedIndex.value = index
    
    const isCorrect = index === winningIndex.value
    
    if (isCorrect) {
      // 맞췄을 때
      stage.value++
      if (stage.value > highScore.value) {
        highScore.value = stage.value
      }
    } else {
      // 틀렸을 때 -> 게임 오버
      rankings.value.push({ id: '나의햄스터', stage: stage.value })
      rankings.value.sort((a, b) => b.stage - a.stage)
      if (rankings.value.length > 10) {
        rankings.value = rankings.value.slice(0, 10)
      }
      gameState.value = 'gameover'
    }
    
    gameState.value = 'result'
  }

  const nextRound = () => {
    if (gameState.value !== 'result') return
    
    // Reset temporary states
    selectedIndex.value = null
    gameState.value = 'betting'
  }

  const resetGame = () => {
    stage.value = 1
    gameState.value = 'betting'
    selectedIndex.value = null
  }

  return {
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
    startGame,
    startShuffling,
    finishShuffling,
    selectCup,
    nextRound,
    resetGame
  }
}
