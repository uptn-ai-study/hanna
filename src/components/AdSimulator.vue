<template>
  <div class="ad-modal-overlay">
    <div class="ad-container retro-box">
      <div class="ad-header">
        <span class="ad-tag">🐿️ 유기농 UP 후원 광고</span>
        <div class="countdown-badge" v-if="timeLeft > 0">
          ⏳ {{ timeLeft }}초 후 건너뛰기 가능
        </div>
        <button 
          v-else 
          class="retro-btn skip-btn gold" 
          @click="closeAd"
        >
          광고 건너뛰기 ➡️
        </button>
      </div>

      <!-- 광고 바디 (다람쥐/햄스터 테마 카툰 광고) -->
      <div class="ad-body">
        <div class="ad-content" :class="`ad-theme-${currentAdIndex}`">
          <div class="ad-icon">{{ currentAd.icon }}</div>
          <h2 class="ad-title">{{ currentAd.title }}</h2>
          <p class="ad-desc">{{ currentAd.desc }}</p>
          <div class="ad-action-btn">{{ currentAd.actionText }}</div>
        </div>
      </div>

      <div class="ad-footer">
        <p>시청 완료 시 <strong>⬆️ UP 500개</strong> 및 <strong>하트 💖</strong>가 충전됩니다!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'reward'): void;
}>()

const timeLeft = ref(5)
const currentAdIndex = ref(0)
let timer: number | null = null

// 다람쥐와 햄스터 세계관의 B급 광고 목록
const ads = [
  {
    title: '야생 왕도토리 급처분! 🐿️',
    desc: '옆 동네 다람쥐 창고에서 몰래 수확한 최고급 밤도토리! 단돈 UP 50개 파격 한정 할인!',
    actionText: '다람쥐 우체국 택배 즉시 발송',
    icon: '🌰'
  },
  {
    title: '볼이 빵빵! 프리미엄 UP 믹스 ⬆️',
    desc: '볼에 10개 이상 넣어도 끄떡없는 고소함! 유기농 무농약 햇해바라기씨 대량 입고 완료!',
    actionText: '무료 샘플 신청하기',
    icon: '🌾'
  },
  {
    title: '소리 없는 프리미엄 쳇바퀴 🎡',
    desc: '새벽 3시에 시속 40km로 광속 질주를 해도 집사가 꿀잠 잘 수 있는 특허 필터 탑재!',
    actionText: '오늘 주문 시 야광 쳇바퀴 무료 증정',
    icon: '⚙️'
  },
  {
    title: '시력 급상승! 당근 야채 즙 🥕',
    desc: '구슬이 든 컵이 너무 빨리 섞여 안 보이시나요? 하루 한 포 당근 즙으로 동체시력 5.0 달성!',
    actionText: '건강즙 10포 패키지 사러 가기',
    icon: '🥤'
  }
]

const currentAd = computed(() => ads[currentAdIndex.value])

onMounted(() => {
  currentAdIndex.value = Math.floor(Math.random() * ads.length)
  
  timer = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      if (timer) clearInterval(timer)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

function closeAd() {
  if (timeLeft.value <= 0) {
    emit('reward')
    emit('close')
  }
}
</script>

<style scoped>
.ad-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(4px);
}

.ad-container {
  width: 90%;
  max-width: 480px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: modal-enter 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.ad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3.5px solid #000;
  padding-bottom: 10px;
}

.ad-tag {
  font-size: 0.85rem;
  color: var(--text-dark);
  font-weight: bold;
}

.countdown-badge {
  font-size: 0.9rem;
  color: #ff7675;
  font-weight: bold;
}

.skip-btn {
  padding: 4px 12px;
  font-size: 0.9rem;
  box-shadow: none;
}

/* 광고 내용 영역 */
.ad-body {
  background: #fdfcf7;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 25px;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.05);
}

.ad-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.ad-icon {
  font-size: 3rem;
  animation: bounce-icon 0.8s infinite alternate;
}

.ad-title {
  font-size: 1.35rem;
  color: var(--text-dark);
  font-weight: bold;
}

.ad-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.45;
}

.ad-action-btn {
  background: #ffeaa7;
  color: var(--text-dark);
  border: 3px solid #000;
  border-radius: 10px;
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: bold;
  margin-top: 10px;
  box-shadow: 2px 2px 0 #000;
  animation: heartbeat 1.2s infinite;
}

.ad-footer {
  border-top: 2px dashed #000;
  padding-top: 10px;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
}

.ad-footer strong {
  color: #ffa502;
}

.ad-theme-0 .ad-title { color: #d35400; }
.ad-theme-1 .ad-title { color: #ffa502; }
.ad-theme-2 .ad-title { color: #2980b9; }
.ad-theme-3 .ad-title { color: #27ae60; }

@keyframes modal-enter {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes bounce-icon {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
</style>
