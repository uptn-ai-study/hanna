<template>
  <div class="modal-overlay" v-if="show" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="title-3">유의사항</h3>
        <button class="modal-close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-body">
        <ul class="notice-list">
          <li>본 계산기는 입력된 값을 기준으로 단순 수학적 공식을 적용한 시뮬레이션 결과이며, 실제 거래 시 수수료나 슬리피지 등으로 인해 미세한 오차가 발생할 수 있습니다.</li>
          <li>실시간 시세는 CoinGecko 데모 API를 통해 제공되며, 거래소별 실제 거래 가격 및 통화별 실시간 환율과 다를 수 있습니다.</li>
          <li>CoinGecko API의 호출 제한 정책으로 인해 시세 정보 조회 기능이 원활하지 않을 수 있으며, 이 경우 수동 입력창을 활용해 주시기 바랍니다.</li>
          <li>본 서비스에서 제공하는 모든 정보는 투자 판단의 보조 자료일 뿐이며, 투자 결과에 대한 최종 책임은 투자자 본인에게 있습니다.</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn-flat btn-flat-primary" style="width: 100%; height: 56px; border-radius: 16px;" @click="$emit('close')">확인</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NoticeModal",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
});
</script>

<style scoped>
.modal-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.modal-content {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 360px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title-3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.modal-close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #9CA3AF;
  cursor: pointer;
}
.modal-body {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.5;
}
.notice-list {
  padding-left: 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
