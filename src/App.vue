<template>
  <div class="phone-container">
    <!-- 모달형 헤더 (좌측 뒤로가기, 우측 닫기 버튼) -->
    <header class="app-header-modal">
      <button type="button" class="header-back-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button type="button" class="header-close-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </header>

    <!-- 탭 네비게이션 (헤더 바로 아래 밀착 배치 - 이미지 4 룩앤필) -->
    <div class="tab-bar">
      <button 
        type="button" 
        class="tab-item" 
        :class="{ active: activeTab === 'simple' }" 
        @click="activeTab = 'simple'"
      >
        단순 물타기
      </button>
      <button 
        type="button" 
        class="tab-item" 
        :class="{ active: activeTab === 'target' }" 
        @click="activeTab = 'target'"
      >
        목표 평단가 역산
      </button>
    </div>



    <!-- 계산기 콘텐츠 영역 -->
    <main class="app-content">
      <keep-alive>
        <component 
          :is="activeComponent" 
          :avax-price="currentPrice" 
          v-model:sharedQty="sharedQty"
          @show-notice="isNoticeModalOpen = true"
        />
      </keep-alive>
    </main>

    <!-- 유의사항 푸터 -->
    <NoticeModal :show="isNoticeModalOpen" @close="isNoticeModalOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { coinGeckoService, type AvaxPriceInfo } from './services/CoinGeckoService';
import SimpleCalculator from './components/SimpleCalculator.vue';
import TargetCalculator from './components/TargetCalculator.vue';
import NoticeModal from './components/NoticeModal.vue';

const activeTab = ref<'simple' | 'target'>('simple');
const priceInfo = ref<AvaxPriceInfo | null>(null);
const loading = ref<boolean>(false);
const fetchError = ref<boolean>(false);
const isNoticeModalOpen = ref<boolean>(false);

// 전역 공유 상태: 보유 수량 (GNB 대시보드와 하단 입력값 동적 양방향 싱크)
const sharedQty = ref<number | ''>('');

const activeComponent = computed(() => {
  return activeTab.value === 'simple' ? SimpleCalculator : TargetCalculator;
});

const currentPrice = computed(() => {
  if (!priceInfo.value) return 0;
  return priceInfo.value.krw;
});

// Fetch AVAX price from API
const fetchPrice = async () => {
  loading.value = true;
  fetchError.value = false;
  try {
    const data = await coinGeckoService.getAvaxPrice();
    priceInfo.value = data;
  } catch (error) {
    console.error(error);
    fetchError.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchPrice();
});
</script>

<style scoped>
.app-header {
  border-bottom: none;
}

.avax-logo {
  color: #E84142; /* Avalanche Red Point Logo */
}


.app-content {
  flex: 1;
  background: var(--card-bg);
}
</style>
