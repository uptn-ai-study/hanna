# Compose Coffee Event Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 컴포즈 앱 화면 진입 시 모카 앱에서 분석된 커피 DNA 유형 결과를 그대로 보여주고, 자동 기입된 쿠폰 난수 번호를 활용해 "쿠폰 교환하기"를 완료할 수 있는 이벤트 상세 및 쿠폰 등록 통합 페이지를 구현합니다.

**Architecture:** 
1. `index.js` 내의 컴포즈 앱 모의 렌더링 함수(`renderComposeApp`)를 수정하여 선택된 "옵션 A(일체형 상세 카드)" 레이아웃을 동적으로 그리도록 합니다.
2. `index.css`에 컴포즈 테마의 결과 카드, 게이지 바, 특징 목록, 비활성화(교환 완료) 스타일을 추가합니다.
3. `state` 객체에 `isCouponRegistered` 상태 값을 연동하여 쿠폰 교환 후 완료 처리 상태를 반영 및 보존합니다.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript

## Global Constraints
- 기존의 모바일 시뮬레이터 기기 프레임 및 상태바, 리셋 로직 구조를 그대로 유지할 것.
- 컴포즈 커피 브랜드 시그니처 옐로우(`#FFE300`)와 블랙(`#1A1A1A`) 테마를 바탕으로 UI를 조화롭게 구성할 것.
- 모카 앱에서 사용된 4대 세그먼트별 그라데이션 및 카드 비주얼을 동일하게 활용하여 일관된 아이덴티티를 유지할 것.

---

### Task 1: CSS 스타일 정의 및 신규 스타일 추가

**Files:**
- Modify: `index.css`

**Interfaces:**
- Produces: 컴포즈 앱 내 커피 DNA 카드, 게이지 바, 쿠폰 입력 폼 및 교환 완료 버튼에 적용할 스타일 클래스 정의

- [ ] **Step 1: `index.css` 파일 하단에 컴포즈 제휴 이벤트 카드 관련 스타일 추가**

```css
/* ==========================================================================
   Compose App Event Page Styles (Option A)
   ========================================================================== */
.compose-event-banner {
  background: #FFE300;
  color: #1a1a1a;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.compose-event-banner .banner-tag {
  font-size: 11px;
  font-weight: 700;
  background: #1a1a1a;
  color: #FFE300;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 6px;
}
.compose-event-banner h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 700;
}
.compose-event-banner p {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.9;
}

/* 결과 카드 */
.compose-result-card {
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  color: #fff;
  text-align: center;
  position: relative;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  font-family: 'Noto Sans KR', sans-serif;
}
.compose-result-card .card-badge {
  font-size: 11px;
  background: rgba(255, 255, 255, 0.2);
  padding: 3px 10px;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 10px;
  font-weight: 500;
}
.compose-result-card .card-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}
.compose-result-card .card-subtitle {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  margin-bottom: 16px;
}
.compose-result-card .card-emoji-img {
  font-size: 54px;
  margin: 12px 0;
}
.compose-result-card .card-features {
  text-align: left;
  background: rgba(0, 0, 0, 0.25);
  padding: 12px 14px;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 11px;
  line-height: 1.5;
  list-style-type: none;
  padding-left: 14px;
}
.compose-result-card .card-features li {
  position: relative;
  margin-bottom: 6px;
}
.compose-result-card .card-features li::before {
  content: "•";
  position: absolute;
  left: -10px;
}
.compose-result-card .card-features li:last-child {
  margin-bottom: 0;
}

/* 능력치 게이지 바 */
.compose-stats-area {
  margin-top: 12px;
  margin-bottom: 12px;
}
.compose-stat-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 11px;
}
.compose-stat-label {
  width: 50px;
  text-align: left;
  opacity: 0.9;
}
.compose-stat-bar-container {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin-left: 8px;
}
.compose-stat-bar-fill {
  width: 0;
  height: 100%;
  background: #fff;
  border-radius: 3px;
  transition: width 1s cubic-bezier(0.1, 0.8, 0.2, 1);
}

/* 쿠폰 교환 폼 */
.compose-coupon-form {
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
}
.compose-coupon-form .form-label {
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
  display: block;
}
.compose-coupon-code-box {
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-weight: 700;
  font-size: 15px;
  text-align: center;
  color: #333;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}
.compose-coupon-code-box.registered {
  background: #e8f5e9;
  border-color: #a5d6a7;
  color: #2e7d32;
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 13px;
}
.compose-btn-cta {
  background: #1a1a1a;
  color: #FFE300;
  border: none;
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.compose-btn-cta:active {
  background: #333;
}
.compose-btn-cta.disabled {
  background: #e0e0e0;
  color: #9e9e9e;
  cursor: not-allowed;
}
```

- [ ] **Step 2: 수동 검증**

`index.css` 파일 하단에 위 스타일이 제대로 반영되었는지 확인합니다.

---

### Task 2: JS 상태 추가 및 스크롤 영역 지원

**Files:**
- Modify: `index.js:5-12`, `index.js:135-156`

**Interfaces:**
- Consumes: `state`
- Produces: `state.isCouponRegistered`, 스크롤 컨테이너 지원

- [ ] **Step 1: `state` 객체에 `isCouponRegistered` 기본값 `false` 추가**

`index.js`의 `state` 객체 선언부를 찾아서 `isCouponRegistered: false`를 추가합니다.

```javascript
let state = {
  currentStep: 1, // 1: 최초 진입, 2: 발급 완료, 3: 검증 완료, 4: 컴포즈 앱 전환
  isIssued: false,
  isVerified: false,
  referralCode: "",
  segment: null, // 발급 시 랜덤 결정됨 (Morning, Lunch, Afternoon, Evening)
  isCouponRegistered: false // 추가: 쿠폰 교환 여부
};
```

- [ ] **Step 2: `resetSimulator`에서 `isCouponRegistered` 상태값 초기화**

```javascript
function resetSimulator() {
  state.currentStep = 1;
  state.isIssued = false;
  state.isVerified = false;
  state.referralCode = "";
  state.segment = null;
  state.isCouponRegistered = false; // 추가: 초기화
  
  if (rollingInterval) {
    clearInterval(rollingInterval);
    rollingInterval = null;
  }
...
```

- [ ] **Step 3: Commit**

```bash
git add index.js
git commit -m "feat: add isCouponRegistered state to simulator"
```

---

### Task 3: 컴포즈 앱 렌더링 함수(`renderComposeApp`) 개편

**Files:**
- Modify: `index.js:183-311`

**Interfaces:**
- Consumes: `state.segment`, `state.referralCode`, `state.isCouponRegistered`
- Produces: 옵션 A 기반 컴포즈 앱 제휴 이벤트 UI 렌더링 및 모달 호출 로직

- [ ] **Step 1: `renderComposeApp` 함수 전체를 개편하여 옵션 A(일체형 상세 카드) 마크업 적용 및 리스너 바인딩**

```javascript
function renderComposeApp() {
  statusBar.classList.remove('dark-mode');
  homeIndicator.classList.remove('dark-mode');

  // 전달받은 세그먼트 데이터가 없으면 기본값으로 Lunch 설정
  const currentSeg = state.segment || "Lunch";
  const segData = coffeeSegments[currentSeg];

  screenContent.innerHTML = `
    <!-- 컴포즈 스플래시 화면 (쿠폰 등록 완료 후 재진입 시 미노출) -->
    ${!state.isCouponRegistered ? `
      <div class="compose-splash" id="composeSplash">
        <div class="compose-splash-logo">
          <span class="compose-splash-logo-symbol">☕</span>
          <span>COMPOSE COFFEE</span>
        </div>
        <div class="compose-splash-sub">C O U P O N</div>
      </div>
    ` : ''}

    <!-- 컴포즈 앱 내용 -->
    <div class="compose-app">
      <div class="compose-header">
        <svg class="compose-back-arrow" id="btnComposeBack" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="compose-header-title">제휴 이벤트 상세</span>
      </div>
      
      <!-- 스크롤 가능한 본문 영역 -->
      <div class="compose-body" style="overflow-y: auto; height: calc(100% - 44px); padding-bottom: 24px;">
        
        <!-- 이벤트 안내 배너 -->
        <div class="compose-event-banner">
          <span class="banner-tag">Moca x Compose</span>
          <h3>제휴 커피 혜택 교환</h3>
          <p>나의 커피 수혈 DNA를 확인하고 컴포즈 아메리카노 무료 쿠폰 혜택으로 즉시 교환하세요!</p>
        </div>

        <!-- 커피 DNA 결과 카드 (동적 그라데이션 및 정보 렌더링) -->
        <div class="compose-result-card" style="background: ${currentSeg === 'Morning' ? 'linear-gradient(135deg, #FF9966, #FF5E62)' :
                               currentSeg === 'Lunch' ? 'linear-gradient(135deg, #8D6E63, #4E342E)' :
                               currentSeg === 'Afternoon' ? 'linear-gradient(135deg, #7F00FF, #E100FF)' :
                               'linear-gradient(135deg, #111827, #ec4899)'}">
          <div class="card-badge">My Coffee DNA</div>
          <h4 class="card-title">${segData.title}</h4>
          <div class="card-subtitle">${segData.badge}</div>
          <div class="card-emoji-img">${segData.emoji}</div>

          <!-- 능력치 게이지 바 -->
          <div class="compose-stats-area">
            <div class="compose-stat-row">
              <span class="compose-stat-label">에너지력</span>
              <div class="compose-stat-bar-container">
                <div class="compose-stat-bar-fill" data-width="${segData.stats.energy}%"></div>
              </div>
            </div>
            <div class="compose-stat-row">
              <span class="compose-stat-label">모임력</span>
              <div class="compose-stat-bar-container">
                <div class="compose-stat-bar-fill" data-width="${segData.stats.social}%"></div>
              </div>
            </div>
            <div class="compose-stat-row">
              <span class="compose-stat-label">팩폭력</span>
              <div class="compose-stat-bar-container">
                <div class="compose-stat-bar-fill" data-width="${segData.stats.talk}%"></div>
              </div>
            </div>
            <div class="compose-stat-row">
              <span class="compose-stat-label">번개력</span>
              <div class="compose-stat-bar-container">
                <div class="compose-stat-bar-fill" data-width="${segData.stats.blitz}%"></div>
              </div>
            </div>
          </div>

          <!-- 특징 상세 -->
          <ul class="card-features">
            ${segData.features.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <!-- 쿠폰 등록 폼 -->
        <div class="compose-coupon-form">
          <label class="form-label">${state.isCouponRegistered ? '등록 완료 쿠폰' : '자동 완성된 쿠폰 코드'}</label>
          ${state.isCouponRegistered ? `
            <div class="compose-coupon-code-box registered">
              ✓ 무료 아메리카노 쿠폰 교환 완료
            </div>
            <button class="compose-btn-cta disabled" id="btnComposeRegister" disabled>쿠폰 교환 완료</button>
          ` : `
            <div class="compose-coupon-code-box">
              ${state.referralCode || 'COMP_TEMP_CODE'}
            </div>
            <button class="compose-btn-cta" id="btnComposeRegister">무료 커피 쿠폰 교환하기</button>
          `}
        </div>

      </div>
    </div>

    <!-- 쿠폰 등록 성공 모달 -->
    <div class="compose-modal-backdrop" id="composeModalBackdrop">
      <div class="compose-modal">
        <div class="compose-modal-icon">🎁</div>
        <h4 class="compose-modal-title">쿠폰 교환 완료</h4>
        <p class="compose-modal-text">컴포즈 아메리카노 1잔 무료 쿠폰(1,800원 상당)이 발급되었습니다.<br>앱의 [마이 쿠폰함]에서 확인하실 수 있습니다.</p>
        <button class="compose-modal-btn" id="btnComposeModalConfirm">확인</button>
      </div>
    </div>
  `;

  // 스플래시 화면 0.8초 후 페이드 아웃 연출
  const composeSplash = document.getElementById('composeSplash');
  if (composeSplash) {
    setTimeout(() => {
      composeSplash.classList.add('fade-out');
    }, 800);
  }

  // 게이지 바 애니메이션 트리거
  setTimeout(() => {
    const fills = document.querySelectorAll('.compose-stat-bar-fill');
    fills.forEach(f => {
      f.style.width = f.getAttribute('data-width');
    });
  }, 100);

  // DOM 요소 참조
  const btnComposeBack = document.getElementById('btnComposeBack');
  const btnComposeRegister = document.getElementById('btnComposeRegister');
  const btnComposeModalConfirm = document.getElementById('btnComposeModalConfirm');
  const composeModalBackdrop = document.getElementById('composeModalBackdrop');

  // 뒤로가기 버튼
  if (btnComposeBack) {
    btnComposeBack.addEventListener('click', () => {
      state.currentStep = 3;
      renderCurrentScreen();
    });
  }

  // 교환 버튼
  if (btnComposeRegister && !state.isCouponRegistered) {
    btnComposeRegister.addEventListener('click', () => {
      if (composeModalBackdrop) {
        composeModalBackdrop.classList.add('active');
      }
    });
  }

  // 모달 확인 버튼
  if (btnComposeModalConfirm) {
    btnComposeModalConfirm.addEventListener('click', () => {
      if (composeModalBackdrop) {
        composeModalBackdrop.classList.remove('active');
      }
      // 상태 변경 후 리렌더링하여 '교환 완료' 화면 적용
      state.isCouponRegistered = true;
      renderComposeApp();
    });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add index.js
git commit -m "feat: implement Compose App Option A event layout & register logic"
```

---

## Verification Plan

### Manual Verification
1. 브라우저에서 모의 시뮬레이터 페이지 진입.
2. `[분석 시작하기]` -> `[Confirm]` 클릭하여 분석 진행.
3. 무작위 커피 DNA 결과 수령 후, `[내 커피 DNA 인증하고 혜택 받기]` 클릭하여 검증 진행.
4. 검증 완료 후 `[커피 쿠폰 등록하러 가기 →]` 버튼을 눌러 컴포즈 앱 제휴 이벤트 상세 화면 진입.
5. 컴포즈 앱 내부에서 아래 요소들을 검증:
   - 상단 헤더 '제휴 이벤트 상세' 및 뒤로가기 버튼 정상 작동 여부.
   - 본인이 발급받은 커피 DNA 결과(그라데이션, 유형 타이틀, 능력치 애니메이션)가 동일하게 연동되는지 여부.
   - 쿠폰 코드가 자동으로 완성되어 폼에 기입되어 있는지 여부.
   - `[무료 커피 쿠폰 교환하기]` 클릭 시 '쿠폰 교환 완료' 모달이 팝업되는지 여부.
   - 모달의 `[확인]` 버튼 클릭 시, 컴포즈 이벤트 페이지가 '쿠폰 교환 완료 (등록됨)' 상태(버튼 및 폼 잠금)로 올바르게 업데이트되는지 여부.
6. 하단의 `[시뮬레이션 초기화 (Reset)]` 버튼 클릭 시 모든 상태(쿠폰 교환 상태 포함)가 원복되는지 여부.
