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

    <!-- Step 2: 목표 평단가 설정 -->
    <div v-show="currentStep === 2" class="step-content">
      <div class="step-card-title">
        <h3 class="title-2">목표 평단가를 설정하세요</h3>
        <p class="body-2 step-desc">목표를 얼마나 현실적으로 잡으셨나요? 🎯</p>
      </div>



      <div class="card card-margin">
        <div class="form-group">
          <label class="form-label">목표 평단가</label>
          <div class="input-container-large">
            <input
              type="text"
              inputmode="numeric"
              class="input-field-large"
              :value="formatWithCommas(targetPrice)"
              @input="handleTargetPriceInput"
              @keydown="handleKeydown"
              min="0"
            />
            <button
              v-if="targetPrice !== '' && targetPrice !== 0"
              type="button"
              class="input-clear-btn"
              @click="targetPrice = ''"
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
          <label class="form-label">예상 추가 매수가</label>
          <div class="input-container-large">
            <input
              type="text"
              inputmode="numeric"
              class="input-field-large"
              :value="formatWithCommas(buyPrice)"
              @input="handleBuyPriceInput"
              @keydown="handleKeydown"
              min="0"
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
          <span class="input-error-text" v-if="buyPriceError">{{ buyPriceError }}</span>
        </div>
      </div>
    </div>

    <!-- Step 3: 결과 화면 -->
    <div v-show="currentStep === 3" class="step-content">

      <!-- 결과 타이틀 영역 -->
      <div class="result-title-area">
        <h3 class="title-2">필요 추가 매수</h3>
        <p class="body-2 result-wit-sub">
          {{ witMessage ? witMessage.text : '숫자를 입력하면 미래가 보입니다 (재정적 조언 아님) 🔮' }}
        </p>
      </div>

      <!-- 역산 결과 카드 -->
      <div class="card-selected card-margin">

        <div class="result-summary">
          <div class="summary-item">
            <span class="body-2">추가 매수량</span>
            <span class="title-2 color-primary">
              {{ (calculationResult.isValid && calculationResult.buyQty > 0) ? formatQty(calculationResult.buyQty) + ' AVAX' : '-' }}
            </span>
          </div>
          <div class="summary-line"></div>
          <div class="summary-item">
            <span class="body-2">필요 투자금액</span>
            <span class="title-2 color-text-1">
              {{ (calculationResult.isValid && calculationResult.totalAmount > 0) ? formatValue(calculationResult.totalAmount) + ' 원' : '-' }}
            </span>
          </div>
        </div>

        <div class="spec-list">
          <div class="spec-item">
            <span class="spec-label font-medium">추가 매수 필요량</span>
            <span class="spec-value color-primary">
              {{ (calculationResult.isValid && calculationResult.buyQty > 0) ? formatQty(calculationResult.buyQty) + ' AVAX' : '-' }}
            </span>
          </div>
          <div class="spec-item">
            <span class="spec-label font-medium">추가 필요 투자액</span>
            <span class="spec-value color-primary">
              {{ (calculationResult.isValid && calculationResult.totalAmount > 0) ? formatValue(calculationResult.totalAmount) + '원' : '-' }}
            </span>
          </div>
          <div class="spec-item">
            <span class="spec-label font-medium">최종 목표 합계 수량</span>
            <span class="spec-value">
              {{ (calculationResult.isValid && calculationResult.buyQty > 0) ? formatQty(cleanCurrentQty + calculationResult.buyQty) + ' AVAX' : '-' }}
            </span>
          </div>
          <div class="spec-item">
            <span class="spec-label font-medium">최종 평단가 (목표치)</span>
            <span class="spec-value">{{ cleanTargetPrice > 0 ? formatValue(cleanTargetPrice) + '원' : '-' }}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label font-medium">총 최종 투자액</span>
            <span class="spec-value">
              {{ (calculationResult.isValid && calculationResult.totalAmount > 0) ? formatValue((cleanCurrentPrice * cleanCurrentQty) + calculationResult.totalAmount) + '원' : '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 조건 불충분 에러 -->
      <div class="card-error-container card-margin" v-if="hasInputs && !calculationResult.isValid">
        <div class="error-header">
          <span class="badge badge-error">계산 불가</span>
        </div>
        <p class="error-message">{{ calculationResult.message }}</p>
        <div class="tip-box">
          <span class="tip-title">💡 물타기 / 불타기 원리:</span>
          <p class="caption">
            • 평단가를 낮추려면(물타기) 추가 매수할 단가가 목표 평단가보다 <strong>낮아야</strong> 합니다.<br>
            • 평단가를 높이려면(불타기) 추가 매수할 단가가 목표 평단가보다 <strong>높아야</strong> 합니다.
          </p>
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
import { calculateTargetBuy } from '../utils/calculator';
import { formatWithCommas, handleNumberInput, handleKeydown, cleanNumber } from '../utils/inputHelper';

export default defineComponent({
  name: 'TargetCalculator',
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
    const targetPrice = ref<number | ''>('');
    const buyPrice = ref<number | ''>('');

    const cleanCurrentQty = computed(() => cleanNumber(currentQty.value));
    const cleanCurrentPrice = computed(() => cleanNumber(currentPrice.value));
    const cleanTargetPrice = computed(() => cleanNumber(targetPrice.value));
    const cleanBuyPrice = computed(() => cleanNumber(buyPrice.value));

    const hasInputs = computed(() => {
      return (
        cleanCurrentQty.value > 0 &&
        cleanCurrentPrice.value > 0 &&
        cleanTargetPrice.value > 0 &&
        cleanBuyPrice.value > 0
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
          cleanNumber(targetPrice.value) <= 0 ||
          cleanNumber(buyPrice.value) <= 0 ||
          buyPriceError.value !== ''
        );
      }
      return false;
    });

    const buyPriceError = computed(() => {
      const curPrice = cleanCurrentPrice.value;
      const tarPrice = cleanTargetPrice.value;
      const bPrice = cleanBuyPrice.value;

      if (curPrice <= 0 || tarPrice <= 0 || bPrice <= 0) return '';

      if (tarPrice < curPrice) {
        if (bPrice >= tarPrice) {
          return '목표가보다 낮은 가격을 입력해야 합니다.';
        }
      } else if (tarPrice > curPrice) {
        if (bPrice <= tarPrice) {
          return '목표가보다 높은 가격을 입력해야 합니다.';
        }
      }
      return '';
    });

    const calculationResult = computed(() => {
      return calculateTargetBuy(
        cleanCurrentPrice.value,
        cleanCurrentQty.value,
        cleanTargetPrice.value,
        cleanBuyPrice.value
      );
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
      if (!calculationResult.value.isValid) return null;
      const needed = calculationResult.value.buyQty;
      const ratio = cleanCurrentQty.value > 0 ? needed / cleanCurrentQty.value : 0;
      const totalInvest = calculationResult.value.totalAmount;
      if (totalInvest > 10000000) return { text: '추가 투자금이 천만원이 넘네요. 집 파셨나요? 🏠', type: 'fire' };
      if (ratio > 5) return { text: '거의 새로 사는 수준이네요. 용감 있습니다 🫡', type: 'legendary' };
      if (ratio > 2) return { text: '진지하게 투자하시는군요. 응원합니다 💪', type: 'good' };
      if (ratio > 0) return { text: '오, 통제된 볼륬으로 가시는군요! 👍', type: 'okay' };
      return { text: '계산 완료! 지금 바로 매수하실 건가요? 🤔', type: 'okay' };
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
      targetPrice.value = '';
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

    const handleTargetPriceInput = (e: Event) => {
      handleNumberInput(e, (val) => {
        targetPrice.value = val;
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
      targetPrice,
      buyPrice,
      cleanCurrentQty,
      cleanCurrentPrice,
      cleanTargetPrice,
      cleanBuyPrice,
      hasInputs,
      calculationResult,
      stepCircleClass,
      stepLabelClass,
      formatValue,
      formatQty,
      resetAll,
      witMessage,
      showToast,
      toastMessage,
      isNextDisabled,
      buyPriceError,
      formatWithCommas,
      handleKeydown,
      handleCurrentQtyInput,
      handleCurrentPriceInput,
      handleTargetPriceInput,
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
.color-text-1  { color: var(--text-1); }

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
  background: rgba(17, 24, 39, 0.02);
  padding: 6px 8px;
  border-radius: 6px;
  border-bottom: none !important;
}

.total-highlight-item.highlight-blue {
  background: rgba(99, 102, 241, 0.03);
}

.font-bold { font-weight: 700; }

/* Card error styling */
.card-error-container {
  background: #FEE2E2;
  border: 1px solid var(--error);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.06);
}

.error-header {
  margin-bottom: 12px;
}

.error-message {
  font-size: 14px;
  color: var(--error);
  line-height: 1.5;
  margin-bottom: 16px;
  font-weight: 700;
}

.tip-box {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px;
}

.tip-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-1);
  display: block;
  margin-bottom: 6px;
}

.tip-box p {
  color: var(--text-2);
}

/* 위트 배너 */
.wit-banner {
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  text-align: center;
}
.wit-banner.legendary {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border: 1px solid #fbbf24;
}
.wit-banner.good {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #065f46;
  border: 1px solid #34d399;
}
.wit-banner.okay {
  background: var(--primary-light);
  color: var(--primary);
  border: 1px solid rgba(99,102,241,0.2);
}
.wit-banner.meh {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}
.wit-banner.fire {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #991b1b;
  border: 1px solid #f87171;
}
.wit-banner.empty {
  background: #f9fafb;
  color: #9ca3af;
  border: 1px dashed #d1d5db;
}
.wit-text {
  display: block;
}

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

/* 결과 타이틀 영역 */
.result-title-area {
  padding-bottom: 20px;
}
.result-wit-sub {
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.5;
}
</style>
