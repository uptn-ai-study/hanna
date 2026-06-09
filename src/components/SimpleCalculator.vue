<template>
  <div class="calculator-container">


    <!-- Step 1: 보유 코인 -->
    <div v-show="currentStep === 1" class="step-content">
      <div class="step-card-title">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
        <h3 class="title-2" style="margin-bottom: 0;">보유 코인 정보를 입력하세요</h3>
        <button type="button" @click="$emit('show-notice')" style="background:none; border:none; padding:0; cursor:pointer; display:flex; align-items:center;">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="10" fill="#E5E7EB"/>
            <path d="M10 6V7M10 9V14" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
        <p class="body-2 step-desc">현재 얼마나 물려계신가요? 솔직하게 😅</p>
      </div>

      <div class="card card-margin">
        <div class="form-group">
          <label class="form-label">보유 수량</label>
          <div class="input-container-large">
            <input
              type="text"
              inputmode="decimal"
              class="input-field-large"
              :value="formatWithCommas(currentQty)"
              @input="handleCurrentQtyInput"
              @keydown="handleKeydown"
            />
            <button
              v-if="currentQty !== '' && currentQty !== 0"
              type="button"
              class="input-clear-btn"
              @click="currentQty = ''"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#E5E7EB"/>
                <path d="M13 7L7 13M7 7L13 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <span v-else class="input-suffix-large">AVAX</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">보유 평단가</label>
          <div class="input-container-large">
            <input
              type="text"
              inputmode="numeric"
              class="input-field-large"
              :value="formatWithCommas(currentPrice)"
              @input="handleCurrentPriceInput"
              @keydown="handleKeydown"
            />
            <button
              v-if="currentPrice !== '' && currentPrice !== 0"
              type="button"
              class="input-clear-btn"
              @click="currentPrice = ''"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#E5E7EB"/>
                <path d="M13 7L7 13M7 7L13 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <span v-else class="input-suffix-large">원</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: 추가 매수 계획 -->
    <div v-show="currentStep === 2" class="step-content">
      <div class="step-card-title">
        <h3 class="title-2">추가 매수 계획을 입력하세요</h3>
        <p class="body-2 step-desc">얼마나 더 투입하실 건가요? 냉정하게 🧊</p>
      </div>



      <div class="card card-margin">
        <div class="form-group">
          <label class="form-label">추가 매수가</label>
          <div class="input-container-large">
            <input
              type="text"
              inputmode="numeric"
              class="input-field-large"
              :value="formatWithCommas(buyPrice)"
              @input="handleBuyPriceInput"
              @keydown="handleKeydown"
            />
            <button
              v-if="buyPrice !== '' && buyPrice !== 0"
              type="button"
              class="input-clear-btn"
              @click="buyPrice = ''"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#E5E7EB"/>
                <path d="M13 7L7 13M7 7L13 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <span v-else class="input-suffix-large">원</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">추가 매수량</label>
          <div class="input-container-large">
            <input
              type="text"
              inputmode="decimal"
              class="input-field-large"
              :value="formatWithCommas(buyQty)"
              @input="handleBuyQtyInput"
              @keydown="handleKeydown"
            />
            <button
              v-if="buyQty !== '' && buyQty !== 0"
              type="button"
              class="input-clear-btn"
              @click="buyQty = ''"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#E5E7EB"/>
                <path d="M13 7L7 13M7 7L13 13" stroke="white" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <span v-else class="input-suffix-large">AVAX</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: 결과 화면 -->
    <div v-show="currentStep === 3" class="step-content">

      <!-- 타이틀 영역 -->
      <div class="result-title-area">
        <h3 class="title-2">시뮬레이션 결과</h3>
        <p class="body-2 result-wit-sub">
          {{ witMessage ? witMessage.text : '숫자를 입력하면 미래가 보입니다 (재정적 조언 아님) 🔮' }}
        </p>
      </div>

      <!-- 결과 카드 -->
      <div class="card-selected card-margin">
        <div class="result-summary">
          <div class="summary-item">
            <span class="body-2">최종 평단가</span>
            <span class="title-2 color-text-1">
              {{ result.finalPrice > 0 ? formatValue(result.finalPrice) + ' 원' : '-' }}
            </span>
          </div>
          <div class="summary-line"></div>
          <div class="summary-item">
            <span class="body-2">기존 평단 대비</span>
            <span class="title-2" :class="priceChangeTextClass">
              {{ (cleanCurrentPrice > 0 && result.finalPrice > 0 && priceChangePercent !== 0) ? (priceChangePercent > 0 ? '+' : '') + priceChangePercent.toFixed(2) + '%' : '-' }}
            </span>
          </div>
        </div>

        <div class="spec-list">
          <div class="spec-item">
            <span class="spec-label font-medium">최종 수량 합계</span>
            <span class="spec-value">
              {{ result.totalQty > 0 ? formatQty(result.totalQty) + ' AVAX' : '-' }}
            </span>
          </div>
          <div class="spec-item">
            <span class="spec-label font-medium">총 누적 투자액</span>
            <span class="spec-value">
              {{ result.totalAmount > 0 ? formatValue(result.totalAmount) + ' 원' : '-' }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- 토스트 -->
    <transition name="toast-fade">
      <div v-if="showToast" class="wit-toast">{{ toastMessage }}</div>
    </transition>

    <!-- Step Navigation -->
    <div class="sticky-bottom-bar">
      <button
        v-if="currentStep > 1"
        type="button"
        class="btn-flat btn-flat-secondary"
        @click="currentStep--"
      >이전</button>
      <button
        v-if="currentStep < 3"
        type="button"
        class="btn-flat btn-flat-primary"
        :disabled="isNextDisabled"
        @click="currentStep++"
      >다음</button>
      <button
        v-if="currentStep === 3"
        type="button"
        class="btn-flat btn-flat-primary"
        @click="resetAll"
      >다시 계산</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onUnmounted } from 'vue';
import { calculateAverageDown } from '../utils/calculator';
import { formatWithCommas, handleNumberInput, handleKeydown, cleanNumber } from '../utils/inputHelper';

export default defineComponent({
  name: 'SimpleCalculator',
  props: {
    avaxPrice: {
      type: Number,
      default: 0,
    },
    sharedQty: {
      type: [Number, String],
      default: '',
    },
  },
  emits: ['update:sharedQty', 'show-notice'],
  setup(props, { emit }) {
    const currentStep = ref(1);

    const currentQty = computed({
      get: () => props.sharedQty,
      set: (val) => emit('update:sharedQty', val)
    });

    const currentPrice = ref<number | ''>('');
    const buyQty = ref<number | ''>('');
    const buyPrice = ref<number | ''>('');

    const cleanCurrentQty = computed(() => cleanNumber(currentQty.value));
    const cleanCurrentPrice = computed(() => cleanNumber(currentPrice.value));
    const cleanBuyQty = computed(() => cleanNumber(buyQty.value));
    const cleanBuyPrice = computed(() => cleanNumber(buyPrice.value));

    const result = computed(() => {
      return calculateAverageDown(
        cleanCurrentPrice.value,
        cleanCurrentQty.value,
        cleanBuyPrice.value,
        cleanBuyQty.value
      );
    });

    const isNextDisabled = computed(() => {
      if (currentStep.value === 1) {
        return (
          cleanNumber(currentQty.value) <= 0 ||
          cleanNumber(currentPrice.value) <= 0
        );
      }
      if (currentStep.value === 2) {
        return (
          cleanNumber(buyQty.value) <= 0 ||
          cleanNumber(buyPrice.value) <= 0
        );
      }
      return false;
    });

    const priceChangePercent = computed(() => {
      const orig = cleanCurrentPrice.value;
      const final = result.value.finalPrice;
      if (orig <= 0 || final <= 0) return 0;
      return ((final - orig) / orig) * 100;
    });

    const priceChangeBadgeClass = computed(() => {
      if (priceChangePercent.value < 0) return 'badge-success';
      if (priceChangePercent.value > 0) return 'badge-error';
      return 'badge-count';
    });

    const priceChangeTextClass = computed(() => {
      if (priceChangePercent.value < 0) return 'color-red';   // 마이너스면 빨간색
      if (priceChangePercent.value > 0) return 'color-blue';  // 플러스면 파란색
      return '';
    });

    const profitAmount = computed(() => {
      const totalCost = result.value.totalAmount;
      const currentValue = result.value.totalQty * props.avaxPrice;
      return currentValue - totalCost;
    });

    const profitPercent = computed(() => {
      const totalCost = result.value.totalAmount;
      if (totalCost <= 0) return 0;
      return (profitAmount.value / totalCost) * 100;
    });

    const profitTextClass = computed(() => {
      if (profitAmount.value > 0) return 'color-success';
      if (profitAmount.value < 0) return 'color-error';
      return '';
    });

    const profitBadgeClass = computed(() => {
      if (profitAmount.value > 0) return 'badge-success';
      if (profitAmount.value < 0) return 'badge-error';
      return 'badge-count';
    });

    const stepCircleClass = (step: number) => {
      if (currentStep.value > step) return 'done';
      if (currentStep.value === step) return 'active';
      return 'pending';
    };

    const stepLabelClass = (step: number) => {
      if (currentStep.value > step) return 'done';
      if (currentStep.value === step) return 'active';
      return '';
    };

    const formatValue = (val: number) => {
      if (!val) return '0';
      return Math.round(val).toLocaleString();
    };

    const formatQty = (val: number) => {
      if (!val) return '0';
      return val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 });
    };

    // 위트 멘트
    const witMessage = computed(() => {
      if (result.value.finalPrice <= 0) return null;
      const pct = priceChangePercent.value;
      if (pct < -30) return { text: '이 정도면 거의 신의 한 수... 아니면 공황 🫡', type: 'legendary' };
      if (pct < -15) return { text: '오, 진지하게 물타셨군요. 응원합니다 💧', type: 'good' };
      if (pct < -5)  return { text: '나쁘지 않은데요? 조금 더 살까요? 🤔', type: 'okay' };
      if (pct < 0)   return { text: '이게... 의미가 있나요? (진심으로) 🧐', type: 'meh' };
      if (pct > 0)   return { text: '이건 물타기가 아니라 불타기인데요 🔥', type: 'fire' };
      return null;
    });

    // 토스트
    const showToast = ref(false);
    const toastMessage = ref('');
    let toastTimer: ReturnType<typeof setTimeout> | null = null;

    const triggerToast = (msg: string) => {
      if (toastTimer) clearTimeout(toastTimer);
      toastMessage.value = msg;
      showToast.value = true;
      toastTimer = setTimeout(() => { showToast.value = false; }, 2800);
    };

    onUnmounted(() => { if (toastTimer) clearTimeout(toastTimer); });

    const resetAll = () => {
      currentStep.value = 1;
      currentPrice.value = '';
      buyQty.value = '';
      buyPrice.value = '';
      emit('update:sharedQty', '');
      triggerToast('다시 도전! 멘탈 관리도 투자의 일부입니다 💪');
    };

    const handleCurrentQtyInput = (e: Event) => {
      handleNumberInput(e, (val) => {
        currentQty.value = val;
      });
    };

    const handleCurrentPriceInput = (e: Event) => {
      handleNumberInput(e, (val) => {
        currentPrice.value = val;
      });
    };

    const handleBuyQtyInput = (e: Event) => {
      handleNumberInput(e, (val) => {
        buyQty.value = val;
      });
    };

    const handleBuyPriceInput = (e: Event) => {
      handleNumberInput(e, (val) => {
        buyPrice.value = val;
      });
    };

    return {
      currentStep,
      currentQty,
      currentPrice,
      buyQty,
      buyPrice,
      cleanCurrentQty,
      cleanCurrentPrice,
      cleanBuyQty,
      cleanBuyPrice,
      result,
      priceChangePercent,
      priceChangeBadgeClass,
      priceChangeTextClass,
      profitAmount,
      profitPercent,
      profitTextClass,
      profitBadgeClass,
      stepCircleClass,
      stepLabelClass,
      formatValue,
      formatQty,
      resetAll,
      witMessage,
      showToast,
      toastMessage,
      isNextDisabled,
      formatWithCommas,
      handleKeydown,
      handleCurrentQtyInput,
      handleCurrentPriceInput,
      handleBuyQtyInput,
      handleBuyPriceInput,
    };
  },
});
</script>

<style scoped>
.calculator-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.step-content {
  padding: 20px 32px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.step-card-title {
  margin-bottom: 16px;
}

.step-desc {
  margin-top: 4px;
  color: var(--text-3);
}

.card-margin {
  margin-bottom: 16px;
}

.card-header {
  margin-bottom: 16px;
  padding-bottom: 8px;
}

.color-primary { color: var(--primary); }
.color-success { color: var(--success); }
.color-error   { color: var(--error); }
.color-blue    { color: #3B82F6 !important; }
.color-red     { color: #EF4444 !important; }

.form-group {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
}

/* Mini Summary (Step 2 상단 요약) */
.mini-summary {
  display: flex;
  align-items: center;
  gap: 24px;
  background: var(--primary-light);
  border-radius: 10px;
  padding: 10px 14px;
}

.mini-summary-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.mini-summary-value {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary);
}

.result-summary {
  background: var(--muted-bg);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-line {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec-item-divider {
  height: 1px;
  background: var(--border);
  margin: 4px 0;
}

.spec-item-divider.double-line {
  border-bottom: 1px double var(--border);
  height: 2px;
}

.total-highlight-item {
  background: rgba(99, 102, 241, 0.03);
  padding: 6px 8px;
  border-radius: 6px;
  border-bottom: none !important;
}

.font-bold { font-weight: 700; }

/* 결과 타이틀 영역 */
.result-title-area {
  padding-bottom: 20px;
}
.result-title-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-3);
  margin-bottom: 4px;
}
.result-wit-sub {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.5;
}

/* 결과 행 카드 */
.result-row-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.result-row-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.result-row-card.highlighted {
  background: var(--muted-bg);
  border: 1px solid var(--muted-bg);
}
.result-row-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-3);
}
.result-row-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-1);
}
.result-row-value.large {
  font-size: 22px;
}
.badge-lg {
  font-size: 14px !important;
  padding: 4px 12px !important;
}

/* 위트 배너 (이제 사용 안 하지만 토스트 transition에 쓰임) */
.wit-banner {
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
}
.wit-banner.legendary { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; border: 1px solid #fbbf24; }
.wit-banner.good { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; border: 1px solid #34d399; }
.wit-banner.okay { background: var(--primary-light); color: var(--primary); border: 1px solid rgba(99,102,241,0.2); }
.wit-banner.meh { background: #f3f4f6; color: #6b7280; border: 1px solid #e5e7eb; }
.wit-banner.fire { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; border: 1px solid #f87171; }
.wit-banner.empty { background: #f9fafb; color: #9ca3af; border: 1px dashed #d1d5db; }
.wit-text { display: block; }

/* 토스트 */
.wit-toast {
  position: fixed;
  bottom: 88px;
  left: 50%;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 99px;
  white-space: nowrap;
  z-index: 9999;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
