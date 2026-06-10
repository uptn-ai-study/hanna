<template>
  <div class="shop-modal-overlay">
    <div class="shop-container retro-box">
      <!-- 상점 헤더 -->
      <div class="shop-header">
        <h2 class="shop-title">🐿️ 다람쥐의 씨앗 상점</h2>
        <button class="retro-btn close-btn red" @click="$emit('close')">X</button>
      </div>

      <!-- 현재 자산 정보 -->
      <div class="user-assets">
        <div class="asset-item">
          <span class="label">보유 씨앗:</span>
          <span class="value gold-text">🌻 {{ points.toLocaleString() }} 개</span>
        </div>
        <div class="asset-item">
          <span class="label">보유 아이템(⏳):</span>
          <span class="value">{{ slowMotionItems }}개</span>
        </div>
      </div>

      <!-- 상점 판매 아이템 목록 -->
      <div class="item-list">
        <!-- 아이템 1: 슬로우 모션 -->
        <div class="shop-item retro-box">
          <div class="item-visual">⏳</div>
          <div class="item-details">
            <h3 class="item-name">슬로우 모션</h3>
            <p class="item-desc">컵 섞기 속도를 아주 느리게 하여 햄스터가 숨은 곳을 찾기 편해져요!</p>
            <span class="item-price">비용: 🌻 300 개</span>
          </div>
          <button 
            class="retro-btn buy-btn gold" 
            :disabled="points < 300"
            @click="onBuyItem"
          >
            구매
          </button>
        </div>

        <!-- 아이템 2: 무료 포인트 (광고 시청) -->
        <div class="shop-item ad-charge-item retro-box">
          <div class="item-visual">📺</div>
          <div class="item-details">
            <h3 class="item-name">무료 씨앗 지원</h3>
            <p class="item-desc">5초간 다람쥐의 재미있는 유기농 가상 광고를 보고 씨앗을 채워보세요!</p>
            <span class="item-price">지급량: 🌻 +500 개</span>
          </div>
          <button 
            class="retro-btn charge-btn" 
            @click="onTriggerAd"
          >
            광고 시청
          </button>
        </div>
      </div>

      <div class="shop-footer">
        <p>※ 햄스터가 좋아하는 맛있는 씨앗이 매일 신선하게 입고됩니다!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  points: number;
  slowMotionItems: number;
}>()

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'buy-item'): void;
  (e: 'trigger-ad'): void;
}>()

function onBuyItem() {
  emit('buy-item')
}

function onTriggerAd() {
  emit('trigger-ad')
}
</script>

<style scoped>
.shop-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
  backdrop-filter: blur(4px);
}

.shop-container {
  width: 95%;
  max-width: 520px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: shop-enter 0.25s ease-out;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3.5px solid #000;
  padding-bottom: 12px;
}

.shop-title {
  font-size: 1.35rem;
  color: var(--text-dark);
}

.close-btn {
  padding: 4px 10px;
  font-size: 1rem;
  box-shadow: none;
}

.user-assets {
  background: #fffdf5;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-around;
  box-shadow: 3px 3px 0 #000;
}

.asset-item {
  display: flex;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: bold;
}

.asset-item .label {
  color: var(--text-muted);
}

.gold-text {
  color: #ffa502;
}

/* 아이템 목록 */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.shop-item {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 15px;
  background: #fffdf9;
  border-width: 3px;
  border-radius: 12px;
  box-shadow: 4px 4px 0 #000;
}

.item-visual {
  font-size: 2.2rem;
  min-width: 50px;
  text-align: center;
}

.item-details {
  flex-grow: 1;
  text-align: left;
}

.item-name {
  font-size: 1.15rem;
  color: var(--text-dark);
  margin-bottom: 4px;
}

.item-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.35;
  margin-bottom: 6px;
}

.item-price {
  font-size: 0.95rem;
  color: #ffa502;
  font-weight: bold;
}

.buy-btn, .charge-btn {
  min-width: 90px;
  font-size: 0.95rem;
  padding: 8px 12px;
}

.charge-btn {
  background: #e3f2fd;
}

.shop-footer {
  border-top: 2px dashed #000;
  padding-top: 10px;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

@keyframes shop-enter {
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
