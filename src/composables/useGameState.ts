import { ref, computed, watch } from 'vue'

export type GameState = 'betting' | 'showing_ball' | 'shuffling' | 'picking' | 'result' | 'gameover'

// Local Storage Keys
const STORAGE_KEYS = {
  HIGH_SCORE: 'yabawi_high_score',
  POINTS: 'yabawi_points',
  ITEMS: 'yabawi_items'
}

export function useGameState() {
  // Persistence Loading
  const loadStored = (key: string, defaultValue: number): number => {
    const val = localStorage.getItem(key)
    return val !== null ? parseInt(val, 10) : defaultValue
  }

  // Reactive State
  const points = ref<number>(loadStored(STORAGE_KEYS.POINTS, 1000))
  const highScore = ref<number>(loadStored(STORAGE_KEYS.HIGH_SCORE, 1))
  const slowMotionItems = ref<number>(loadStored(STORAGE_KEYS.ITEMS, 2))
  
  const stage = ref<number>(1)
  const betAmount = ref<number>(100)
  const gameState = ref<GameState>('betting')
  
  const winningIndex = ref<number>(0)
  const selectedIndex = ref<number | null>(null)
  
  const isSlowMotionActive = ref<boolean>(false)
  const showAdModal = ref<boolean>(false)
  const showShopModal = ref<boolean>(false)

  // Watchers to persist state
  watch(points, (newVal) => localStorage.setItem(STORAGE_KEYS.POINTS, newVal.toString()))
  watch(highScore, (newVal) => localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, newVal.toString()))
  watch(slowMotionItems, (newVal) => localStorage.setItem(STORAGE_KEYS.ITEMS, newVal.toString()))

  // Computed Values
  const cupCount = computed(() => {
    if (stage.value <= 2) return 3
    if (stage.value <= 4) return 4
    if (stage.value <= 6) return 5
    return 6 // Max 6 cups
  })

  const baseShuffleSpeed = computed(() => {
    // Stage increases -> speed increases (interval decreases)
    // Stage 1: 600ms, Stage 10+: 250ms
    const speed = 650 - (stage.value * 30)
    return Math.max(220, speed)
  })

  const shuffleSpeed = computed(() => {
    // If slow motion is active, shuffle is 2.5x slower (higher interval)
    if (isSlowMotionActive.value) {
      return baseShuffleSpeed.value * 2.2
    }
    return baseShuffleSpeed.value
  })

  const shuffleCount = computed(() => {
    // Stage increases -> more shuffles
    return Math.min(18, 5 + stage.value)
  })

  // Methods
  const setBetAmount = (amount: number) => {
    if (gameState.value !== 'betting') return
    if (amount === -1) {
      betAmount.value = points.value // All-in
    } else {
      betAmount.value = Math.min(points.value, amount)
    }
  }

  const startGame = () => {
    if (gameState.value !== 'betting') return
    if (betAmount.value <= 0) {
      alert('나눌 씨앗 개수를 설정해주세요!')
      return
    }
    if (betAmount.value > points.value) {
      alert('보유한 씨앗이 부족합니다!')
      return
    }

    // Deduct points at start of round
    points.value -= betAmount.value
    
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
      // Correct! Get bet back * cup count (reward proportional to probability)
      const reward = betAmount.value * cupCount.value
      points.value += reward
      stage.value++
      if (stage.value > highScore.value) {
        highScore.value = stage.value
      }
    } else {
      // Incorrect! Points already deducted. Stage reset to 1 to make it challenging, or keep stage?
      // Typically, losing the bet keeps you at the stage but drains points.
      // If points reach 0, gameover.
    }
    
    gameState.value = 'result'
  }

  const nextRound = () => {
    if (gameState.value !== 'result') return
    
    // Reset temporary states
    isSlowMotionActive.value = false
    selectedIndex.value = null
    
    if (points.value <= 0) {
      gameState.value = 'gameover'
    } else {
      // Cap bet amount to available points
      if (betAmount.value > points.value) {
        betAmount.value = points.value
      }
      gameState.value = 'betting'
    }
  }

  const useSlowMotion = () => {
    if (gameState.value !== 'betting' && gameState.value !== 'showing_ball') return
    if (isSlowMotionActive.value) return
    if (slowMotionItems.value <= 0) {
      alert('슬로우 모션 ⏳ 아이템이 없습니다!')
      return
    }
    slowMotionItems.value--
    isSlowMotionActive.value = true
  }

  const buySlowMotion = () => {
    const cost = 300
    if (points.value < cost) {
      alert('씨앗이 부족합니다! (필요 씨앗: 300개 🌻)')
      return false
    }
    points.value -= cost
    slowMotionItems.value++
    return true
  }

  const watchAdReward = () => {
    // Mimics reading an ad
    points.value += 500
    if (gameState.value === 'gameover') {
      // Revive
      gameState.value = 'betting'
      betAmount.value = 100
      stage.value = Math.max(1, stage.value - 1) // Go down 1 stage as penalty but keep playing
    }
  }

  const resetGame = () => {
    points.value = 1000
    stage.value = 1
    betAmount.value = 100
    gameState.value = 'betting'
    selectedIndex.value = null
    isSlowMotionActive.value = false
  }

  return {
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
  }
}
