import { ref, computed } from 'vue'

export type GameState = 'betting' | 'showing_ball' | 'shuffling' | 'picking' | 'result'

export interface RankingRecord {
  id: string;
  stage: number;
}

export function useGameState() {
  // 로컬 스토리지 키
  const STORAGE_KEYS = {
    PLAYER_NAME: 'yabawi_player_name',
    HIGH_SCORE: 'yabawi_high_score'
  }

  // 로컬 스토리지 복원 및 반응형 상태 정의
  const playerName = ref<string>(localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || '')
  const highScore = ref<number>(
    parseInt(localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '1', 10)
  )
  const rankings = ref<RankingRecord[]>([
    { id: '다람쥐대장', stage: 25 },
    { id: '도토리도둑', stage: 18 },
    { id: '햄스터박사', stage: 14 },
    { id: '씨앗수집가', stage: 10 },
    { id: '빠른쳇바퀴', stage: 7 }
  ])
  
  const stage = ref<number>(1)
  const betAmount = ref<number>(100) // unused, structure kept
  const gameState = ref<GameState>('betting')
  
  const winningIndex = ref<number>(0)
  const selectedIndex = ref<number | null>(null)

  // 랭킹 조회 API 호출
  const fetchRankings = async () => {
    try {
      const response = await fetch('/api/rankings')
      if (response.ok) {
        const data = await response.json()
        rankings.value = data
      }
    } catch (error) {
      console.error('Failed to fetch rankings:', error)
    }
  }

  // 랭킹 등록 API 호출
  const submitScore = async (name: string, score: number) => {
    if (!name) return
    try {
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: name, stage: score })
      })
      if (response.ok) {
        await fetchRankings()
      }
    } catch (error) {
      console.error('Failed to submit score:', error)
    }
  }

  // 초기 로딩 시 랭킹 조회
  fetchRankings()

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
    return Math.min(18, 5 + stage.value)
  })

  // Methods
  const setBetAmount = (amount: number) => {
    if (gameState.value !== 'betting') return
    betAmount.value = amount
  }

  const startGame = () => {
    if (gameState.value !== 'betting') return
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
        localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, stage.value.toString())
      }
    } else {
      // 틀렸을 때 -> 로컬 즉시 업데이트 & 서버 비동기 등록
      const scoreName = playerName.value || '나의햄스터'
      
      // 로컬 화면에 우선 반영 (낙관적 락/피드백)
      const existingIdx = rankings.value.findIndex(r => r.id === scoreName)
      if (existingIdx !== -1) {
        if (stage.value > rankings.value[existingIdx].stage) {
          rankings.value[existingIdx].stage = stage.value
        }
      } else {
        rankings.value.push({ id: scoreName, stage: stage.value })
      }
      rankings.value.sort((a, b) => b.stage - a.stage)
      if (rankings.value.length > 10) {
        rankings.value = rankings.value.slice(0, 10)
      }

      // 서버 전송
      submitScore(scoreName, stage.value)
    }
    
    gameState.value = 'result'
  }

  const nextRound = () => {
    if (gameState.value !== 'result') return

    // 틀렸을 때 -> 바로 시작 화면으로 리셋
    if (selectedIndex.value !== winningIndex.value) {
      resetGame()
    } else {
      // 맞췄을 때 -> 다음 라운드 진행
      selectedIndex.value = null
      gameState.value = 'betting'
    }
  }

  const resetGame = () => {
    stage.value = 1
    gameState.value = 'betting'
    selectedIndex.value = null
  }

  const setPlayerName = (name: string) => {
    playerName.value = name
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, name)
  }

  return {
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
  }
}
