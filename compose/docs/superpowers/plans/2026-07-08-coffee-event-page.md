# 통합 커피 크레덴셜 이벤트 페이지 구현 계획 (Coffee Event Page Redesign Implementation Plan)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 3단계 스텝 카드를 모바일 화면에 최적화된 단일 통합 동적 카드(Unified Dynamic Card) 레이아웃으로 변경하고, 랜덤 세그먼트 발급과 세그먼트별 그라데이션 및 바코드 쿠폰 티켓 비주얼을 적용합니다.

**Architecture:** 
1. HTML에서 복잡한 3단계 스텝 영역을 단일 카드 영역으로 교체하여 마운트합니다.
2. CSS를 수정하여 롤링 멘트 텍스트 슬라이드 애니메이션, 4가지 수혈 세그먼트(Morning, Lunch, Afternoon, Evening)별 럭셔리 네온 그라데이션 크레덴셜 디자인 및 점선/원형 컷아웃이 가미된 영수증 쿠폰 티켓 스타일을 추가합니다.
3. JavaScript를 개편하여 OCB 결제 이력 분석 시 랜덤하게 4개 세그먼트 중 하나를 매칭하고, 단계별로 단일 카드 내부 뷰를 동적으로 변경하며 스캔 애니메이션과 컴포즈 앱 이동 링크를 노출합니다.

**Tech Stack:** Vanilla HTML, Vanilla CSS, Vanilla Javascript

## Global Constraints
*   **Aesthetics:** MZ세대 타겟에 맞춘 매력적이고 세련된 비주얼 (그라데이션, 미세 인터랙션 포함) 적용
*   **Language:** 한글 카피라이팅 및 사용자 가이드 준수
*   **Responsive:** iPhone 15 Pro 디바이스 목업 크기(393px 너비) 내에서 모든 UI가 잘리지 않고 정상 동작하도록 설계

---

### Task 1: HTML 마크업 및 구조 변경

**Files:**
- Modify: `index.html` ([index.html](file:///Users/1004823/Desktop/compose/index.html#L202-L265))

**Interfaces:**
- Produces: `#mocaUnifiedCard`, `#mocaRollingTicker`, `#heroCredContainer`, `#mocaCardRender`, `#mocaRewardArea`, `#btnMocaCTA`, `#mocaLinkArea` 컨테이너 및 엘리먼트 제공.

- [ ] **Step 1: index.html 수정**
  기존 `.moca-steps-area` 및 스텝 1, 2, 3 카드 전체 영역을 지우고 통합 동적 카드 영역인 `.moca-unified-card`를 주입합니다.

  *수정 내용 (index.html 약 203~265라인)*:
  ```html
  <!-- 3단계 통합형 카드 레이아웃 -->
  <div class="moca-unified-card" id="mocaUnifiedCard">
    
    <!-- 롤링 멘트 배너 (초기 진입 시 노출) -->
    <div class="moca-rolling-ticker" id="mocaRollingTicker">
      <div class="ticker-content" id="tickerContent">
        <!-- JS에 의해 롤링 멘트가 렌더링되고 순환 전환됨 -->
      </div>
    </div>

    <!-- 통합 히어로 영역 (크레덴셜 카드 디스플레이) -->
    <div class="hero-credential-container" id="heroCredContainer">
      <!-- 레이저 스캔용 라인 -->
      <div class="laser-line" id="laserLine"></div>
      
      <!-- 크레덴셜 카드 렌더링 영역 -->
      <div id="mocaCardRender">
        <!-- JS 상태에 따라 미발급 / 발급완료(세그먼트별 디자인) / 인증완료 형태로 렌더링 -->
      </div>
    </div>

    <!-- 동적 쿠폰/리워드 영역 (인증 완료 시 슬라이드 노출) -->
    <div class="moca-reward-area" id="mocaRewardArea">
      <!-- JS에 의해 바코드 티켓 쿠폰이 동적으로 렌더링됨 -->
    </div>

    <!-- 통합 CTA 버튼 -->
    <button class="moca-btn moca-btn-primary" id="btnMocaCTA">내 커피 수혈 타임 알아보기</button>

    <!-- 앱 이동용 2차 CTA 버튼/링크 영역 (인증 완료 시 노출) -->
    <div class="moca-link-button-area" id="mocaLinkArea">
      <!-- JS에 의해 쿠폰 등록하러 가기 버튼 렌더링 -->
    </div>

  </div>
  ```

- [ ] **Step 2: HTML 파일 검증**
  에러 없이 HTML 태그 매칭이 정상적이고 누락된 부분이 없는지 확인합니다.

- [ ] **Step 3: 커밋 진행**
  ```bash
  git add index.html
  git commit -m "style: modify index.html to apply unified dynamic card layout"
  ```

---

### Task 2: CSS 스타일 정의 및 개편

**Files:**
- Modify: `index.css` ([index.css](file:///Users/1004823/Desktop/compose/index.css#L392-L550))

**Interfaces:**
- Consumes: `#mocaUnifiedCard` 등 Task 1에서 생성한 HTML 엘리먼트
- Produces: 롤링 애니메이션, 4개 세그먼트별(Morning, Lunch, Afternoon, Evening) 그라데이션 배경, 바코드 쿠폰 티켓 스타일, 레이저 스캔 애니메이션 스타일 제공.

- [ ] **Step 1: index.css 수정**
  기존 스텝 카드와 관련된 스타일(`.moca-steps-area`, `.step-card` 등)을 삭제하거나 오버라이딩하고, 통합 카드 및 비주얼 효과 스타일을 파일 끝에 추가합니다.

  *추가할 CSS 스타일 내용*:
  ```css
  /* 통합형 이벤트 카드 스타일 */
  .moca-unified-card {
    padding: 0 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: -12px;
  }

  /* 롤링 멘트 틱커 스타일 */
  .moca-rolling-ticker {
    background: rgba(18, 11, 10, 0.04);
    border: 1px dashed rgba(141, 110, 99, 0.2);
    border-radius: 8px;
    padding: 10px 12px;
    overflow: hidden;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ticker-content {
    font-size: 12px;
    font-weight: 500;
    color: var(--moca-text-primary);
    text-align: center;
    width: 100%;
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  /* 히어로 크레덴셜 카드 컨테이너 */
  .hero-credential-container {
    width: 100%;
    position: relative;
    border-radius: 16px;
    overflow: hidden;
  }

  /* 미발급 카드(잠금) 스타일 */
  .cred-locked-card {
    height: 150px;
    background: linear-gradient(135deg, #181514 0%, #0c0a09 100%);
    border: 1.5px dashed rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.4);
    animation: credPulse 2s infinite ease-in-out;
  }

  @keyframes credPulse {
    0% { border-color: rgba(255, 255, 255, 0.15); box-shadow: inset 0 0 10px rgba(255,255,255,0.01); }
    50% { border-color: var(--moca-light-brown); box-shadow: inset 0 0 20px rgba(212,163,115,0.15); }
    100% { border-color: rgba(255, 255, 255, 0.15); box-shadow: inset 0 0 10px rgba(255,255,255,0.01); }
  }

  .cred-locked-icon {
    font-size: 28px;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
  }

  .cred-locked-text {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  /* 대형 발급완료 크레덴셜 카드 공통 스타일 */
  .moca-cred-large {
    height: 180px;
    border-radius: 16px;
    padding: 20px;
    color: #FFFFFF;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 크레덴셜 유형별 그라데이션 및 효과 */
  .moca-cred-large.card-morning {
    background: linear-gradient(135deg, #FF7E5F 0%, #FEB47B 100%);
    box-shadow: 0 12px 28px rgba(255, 126, 95, 0.3);
  }
  .moca-cred-large.card-lunch {
    background: linear-gradient(135deg, #6d4c41 0%, #3e2723 100%);
    box-shadow: 0 12px 28px rgba(109, 76, 65, 0.3);
  }
  .moca-cred-large.card-afternoon {
    background: linear-gradient(135deg, #7F00FF 0%, #E100FF 100%);
    box-shadow: 0 12px 28px rgba(127, 0, 255, 0.3);
  }
  .moca-cred-large.card-evening {
    background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
    box-shadow: 0 12px 28px rgba(32, 58, 67, 0.35);
  }

  /* 크레덴셜 배지 스타일 */
  .cred-large-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .cred-large-logo {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1.5px;
    opacity: 0.85;
  }
  .cred-large-verified-badge {
    background: #4caf50;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    animation: badgePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes badgePop {
    0% { transform: scale(0.5); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .cred-large-body {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cred-large-title {
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 20px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .cred-large-meta {
    font-size: 10px;
    opacity: 0.75;
    text-transform: uppercase;
    font-weight: 600;
  }

  .cred-large-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 10px;
  }
  .cred-large-desc {
    font-size: 11px;
    opacity: 0.9;
  }
  .cred-large-emoji {
    font-size: 28px;
  }

  /* 티켓 리워드(쿠폰) 디자인 */
  .moca-reward-area {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s ease-out;
  }
  .moca-reward-area.active {
    max-height: 300px;
    margin-top: 8px;
  }

  .moca-coupon-ticket {
    background: #FFFFFF;
    border-radius: 12px;
    color: #120b0a;
    padding: 16px;
    position: relative;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border: 1px solid #EFEBE9;
  }

  /* 티켓 좌우 동그란 반원 홈 디자인 */
  .moca-coupon-ticket::before, .moca-coupon-ticket::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    background: var(--moca-bg);
    border-radius: 50%;
    border: 1.5px solid #EFEBE9;
    z-index: 2;
  }
  .moca-coupon-ticket::before { left: -8px; border-left: none; }
  .moca-coupon-ticket::after { right: -8px; border-right: none; }

  .ticket-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px dashed #E0DCDA;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }
  .ticket-brand {
    font-size: 11px;
    font-weight: 700;
    color: #8D6E63;
    letter-spacing: 0.5px;
  }
  .ticket-title {
    font-size: 14px;
    font-weight: 700;
    color: #120b0a;
    margin-top: 2px;
  }
  .ticket-points-badge {
    background: rgba(212, 163, 115, 0.15);
    color: #8D6E63;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .ticket-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
  .ticket-barcode {
    width: 80%;
    height: 38px;
    background: repeating-linear-gradient(
      90deg,
      #120b0a,
      #120b0a 2px,
      transparent 2px,
      transparent 6px,
      #120b0a 6px,
      #120b0a 7px,
      transparent 7px,
      transparent 10px
    );
    opacity: 0.85;
  }
  .ticket-code {
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.5px;
    color: #5D4037;
  }

  /* 2차 링크 스타일 */
  .moca-link-button-area {
    display: flex;
    justify-content: center;
    margin-top: -4px;
  }
  .moca-link-btn {
    background: none;
    border: none;
    color: #8D6E63;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    text-decoration: underline;
    transition: color 0.2s ease;
  }
  .moca-link-btn:hover {
    color: #5D4037;
  }
  ```

- [ ] **Step 2: CSS 파일 검증**
  구문 분석이 정상적이고, 기존 CSS의 기기(아이폰 15) 관련 중요 레이아웃을 깨지 않는지 확인합니다.

- [ ] **Step 3: 커밋 진행**
  ```bash
  git add index.css
  git commit -m "style: add custom unified card, rolling ticker, and coupon styles to CSS"
  ```

---

### Task 3: JavaScript 비즈니스 및 이벤트 흐름 로직 변경

**Files:**
- Modify: `index.js` ([index.js](file:///Users/1004823/Desktop/compose/index.js))

**Interfaces:**
- Consumes: HTML 엘리먼트 및 CSS 클래스 구조
- Produces: `renderMocaEventPage()`, `handleStep1()`, `handleStep2()`, `handleStep3()` 함수 개편, 타이머를 이용한 롤링 배너 구동, 랜덤 세그먼트 결정 기능 제공.

- [ ] **Step 1: index.js 초기 상태 및 롤링 배너 로직 수정**
  `state.segment` 초기값을 `"Lunch"`가 아닌 `null`로 바꾸고, 롤링 멘트 텍스트 리스트 및 주기적 변경 타이머를 선언합니다.

  *수정 내용 (index.js 상단)*:
  ```javascript
  // 시뮬레이터 상태 변수
  let state = {
    currentStep: 1, // 1: 최초 진입, 2: 발급 완료, 3: 검증 완료, 4: 컴포즈 앱 전환
    isIssued: false,
    isVerified: false,
    referralCode: "",
    segment: null // 발급 시 랜덤 결정됨 (Morning, Lunch, Afternoon, Evening)
  };

  // 롤링 타이머 참조용 변수
  let rollingInterval = null;

  // 세그먼트 데이터 사전 정보 정의
  const coffeeSegments = {
    "Morning": {
      badge: "출근길 눈번쩍 생명수 수혈러",
      desc: "오전 8시 | 출근길 눈번쩍 생명수 수혈 타임",
      emoji: "🌅",
      codePrefix: "COMP_MORNING_",
      cardClass: "card-morning"
    },
    "Lunch": {
      badge: "식후 아메리카노 필수러",
      desc: "오후 1시 | 식후 졸음방지 아메리카노 필수 타임",
      emoji: "☕️",
      codePrefix: "COMP_LUNCH_",
      cardClass: "card-lunch"
    },
    "Afternoon": {
      badge: "나른함 타파 샷추가러",
      desc: "오후 3시 30분 | 나른함 타파를 위한 샷 추가 타임",
      emoji: "⚡️",
      codePrefix: "COMP_AFTERNOON_",
      cardClass: "card-afternoon"
    },
    "Evening": {
      badge: "퇴근길 힐링 충전러",
      desc: "오후 6시 30분 | 퇴근길 하루를 보상하는 힐링 충전 타임",
      emoji: "🌙",
      codePrefix: "COMP_EVENING_",
      cardClass: "card-evening"
    }
  };
  ```

- [ ] **Step 2: 롤링 텍스트 배너 애니메이션 로직 구현**
  틱커 작동 함수 `startRollingTicker()`를 추가하여 2.5초마다 페이드 전환 연출을 적용합니다.

  *구현 코드*:
  ```javascript
  function startRollingTicker() {
    if (rollingInterval) clearInterval(rollingInterval);
    const keys = Object.keys(coffeeSegments);
    let index = 0;
    
    const tickerContent = document.getElementById('tickerContent');
    const updateTicker = () => {
      if (!tickerContent) return;
      const key = keys[index];
      const item = coffeeSegments[key];
      
      tickerContent.style.opacity = 0;
      tickerContent.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        tickerContent.innerHTML = `${item.emoji} ${item.desc}`;
        tickerContent.style.opacity = 1;
        tickerContent.style.transform = 'translateY(0)';
      }, 300);
      
      index = (index + 1) % keys.length;
    };
    
    updateTicker();
    rollingInterval = setInterval(updateTicker, 2500);
  }
  ```

- [ ] **Step 3: renderMocaEventPage() 핵심 함수 전면 개편**
  통합형 카드 레이아웃의 다양한 상태를 그리는 로직으로 교체합니다.

  *수정 내용 (renderMocaEventPage)*:
  ```javascript
  function renderMocaEventPage() {
    // 상태 바 및 홈 인디케이터 테마 설정
    statusBar.classList.remove('dark-mode');
    homeIndicator.classList.remove('dark-mode');

    screenContent.innerHTML = `
      <!-- 모카 상단 헤더 -->
      <div class="moca-header">
        <svg class="moca-back-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="moca-header-title">이벤트</span>
      </div>

      <!-- 스크롤 가능 이벤트 영역 -->
      <div class="moca-scroll-container">
        <!-- 메인 마케팅 배너 -->
        <div class="moca-banner">
          <span class="moca-badge">Moca Network</span>
          <h1 class="moca-banner-title">나의 커피 수혈 유형 알아보고<br>컴포즈 커피 쿠폰 + OK 캐쉬백 3,000P 받자!</h1>
          <p class="moca-banner-desc">내가 주로 커피를 구매하는 시간대를 확인하고 나의 커피 수혈 유형을 분석해 보세요. 인증 완료 시 OK 캐쉬백 3,000P 즉시 적립과 함께 컴포즈 커피 쿠폰(아메리카노 1잔 무료) 혜택을 드립니다.</p>
          <div class="moca-banner-date">이벤트 기간: 2026. 09. 01 ~ 2026. 09. 30</div>
        </div>

        <!-- 통합형 카드 컨테이너 -->
        <div class="moca-unified-card" id="mocaUnifiedCard">
          
          <!-- 롤링 멘트 텍스트 (미발급일 때만 표시) -->
          ${!state.isIssued ? `
            <div class="moca-rolling-ticker" id="mocaRollingTicker">
              <div class="ticker-content" id="tickerContent"></div>
            </div>
          ` : ''}

          <!-- 히어로 크레덴셜 카드 컨테이너 -->
          <div class="hero-credential-container" id="heroCredContainer">
            <div class="laser-line" id="laserLine"></div>
            <div id="mocaCardRender"></div>
          </div>

          <!-- 리워드 쿠폰 영역 -->
          <div class="moca-reward-area" id="mocaRewardArea"></div>

          <!-- 통합 CTA 버튼 -->
          <button class="moca-btn moca-btn-primary" id="btnMocaCTA"></button>

          <!-- 2차 쿠폰 앱 등록 링크 영역 -->
          <div class="moca-link-button-area" id="mocaLinkArea"></div>
        </div>

        <!-- 이벤트 유의사항 -->
        <div class="moca-precautions">
          <h4 class="moca-precautions-title">이벤트 유의사항</h4>
          <ul class="moca-precautions-list">
            <li>본 이벤트는 최근 3개월 이내 OK캐쉬백 제휴 커피 브랜드 이용 고객을 대상으로 진행됩니다.</li>
            <li>인증 즉시 OK캐쉬백 3,000P가 지급되며 컴포즈 쿠폰 등록용 코드가 발행됩니다.</li>
            <li>발급된 컴포즈 쿠폰(1,800원 상당)은 컴포즈 앱 내에서 1회 등록 및 이용이 가능합니다.</li>
          </ul>
        </div>
      </div>
    `;

    // 롤링 틱커 활성화
    if (!state.isIssued) {
      startRollingTicker();
    } else {
      if (rollingInterval) {
        clearInterval(rollingInterval);
        rollingInterval = null;
      }
    }

    // 각 영역 동적 렌더링 호출
    renderCardContent();
    renderRewardContent();
    renderCTAButton();

    // CTA 버튼 이벤트 연결
    const btnMocaCTA = document.getElementById('btnMocaCTA');
    if (btnMocaCTA) {
      btnMocaCTA.addEventListener('click', () => {
        if (state.currentStep === 1) {
          handleStep1(); // 발급 (Air SDK 바텀시트)
        } else if (state.currentStep === 2) {
          handleStep2(); // 인증 (스캔 애니메이션)
        }
      });
    }
  }
  ```

- [ ] **Step 4: 카드, 리워드 및 CTA 갱신 헬퍼 함수 구현**
  세부 요소들을 실시간 상태에 맞게 주입하고 제어하는 함수들을 구현합니다.

  *구현 코드*:
  ```javascript
  // 1. 크레덴셜 카드 렌더링
  function renderCardContent() {
    const cardRender = document.getElementById('mocaCardRender');
    if (!cardRender) return;

    if (!state.isIssued) {
      // 미발급 잠금 상태
      cardRender.innerHTML = `
        <div class="cred-locked-card">
          <div class="cred-locked-icon">🔒</div>
          <div class="cred-locked-text">나의 커피 결제 이력을 분석해 주세요.</div>
        </div>
      `;
    } else {
      // 발급 완료 상태 (세그먼트 매칭됨)
      const segData = coffeeSegments[state.segment];
      cardRender.innerHTML = `
        <div class="moca-cred-large ${segData.cardClass}">
          <div class="cred-large-header">
            <span class="cred-large-logo">MOCA CHAIN</span>
            ${state.isVerified ? `
              <span class="cred-large-verified-badge">
                ✓ 인증완료
              </span>
            ` : ''}
          </div>
          <div class="cred-large-body">
            <span class="cred-large-meta">Coffee Time Credential</span>
            <h2 class="cred-large-title">${segData.badge}</h2>
          </div>
          <div class="cred-large-footer">
            <span class="cred-large-desc">Moca ID: OKCashbag-User Verified</span>
            <span class="cred-large-emoji">${segData.emoji}</span>
          </div>
        </div>
      `;
    }
  }

  // 2. 리워드 쿠폰 카드 렌더링
  function renderRewardContent() {
    const rewardArea = document.getElementById('mocaRewardArea');
    if (!rewardArea) return;

    if (state.isVerified && state.segment) {
      const segData = coffeeSegments[state.segment];
      rewardArea.innerHTML = `
        <div class="moca-coupon-ticket">
          <div class="ticket-top">
            <div>
              <div class="ticket-brand">COMPOSE COFFEE</div>
              <div class="ticket-title">아메리카노 1잔 무료 쿠폰</div>
            </div>
            <span class="ticket-points-badge">3,000P 지급됨</span>
          </div>
          <div class="ticket-bottom">
            <div class="ticket-barcode"></div>
            <div class="ticket-code">${state.referralCode}</div>
          </div>
        </div>
      `;
      rewardArea.classList.add('active');
    } else {
      rewardArea.innerHTML = '';
      rewardArea.classList.remove('active');
    }
  }

  // 3. CTA 버튼 텍스트 및 상태 갱신
  function renderCTAButton() {
    const btnMocaCTA = document.getElementById('btnMocaCTA');
    const linkArea = document.getElementById('mocaLinkArea');
    if (!btnMocaCTA || !linkArea) return;

    if (state.currentStep === 1) {
      btnMocaCTA.textContent = "내 커피 수혈 타임 알아보기";
      btnMocaCTA.disabled = false;
      btnMocaCTA.classList.remove('disabled');
      linkArea.innerHTML = '';
    } else if (state.currentStep === 2) {
      btnMocaCTA.textContent = "내 커피 수혈 타임 인증하기";
      btnMocaCTA.disabled = false;
      btnMocaCTA.classList.remove('disabled');
      linkArea.innerHTML = '';
    } else if (state.currentStep === 3) {
      btnMocaCTA.textContent = "인증 완료 (3,000P 적립됨)";
      btnMocaCTA.disabled = true;
      btnMocaCTA.classList.add('disabled');
      
      // 커피 쿠폰 등록하러 가기 2차 링크 활성화
      linkArea.innerHTML = `
        <button class="moca-link-btn" id="btnGoToCompose">
          커피 쿠폰 등록하러 가기 &rarr;
        </button>
      `;
      
      const btnGoToCompose = document.getElementById('btnGoToCompose');
      if (btnGoToCompose) {
        btnGoToCompose.addEventListener('click', handleStep3);
      }
    }
  }
  ```

- [ ] **Step 5: Air SDK Confirm 완료 시 무작위 세그먼트 부여 기능 탑재**
  `btnAirConfirm` 리스너 핸들러 내부에서 완료되는 시점에 무작위 세그먼트를 추출해 상태에 대입합니다.

  *수정 내용 (btnAirConfirm 리스너 종료부분 - 약 355라인)*:
  ```javascript
          // 상태 업데이트 및 화면 갱신 (무작위 세그먼트 부여)
          const segments = ["Morning", "Lunch", "Afternoon", "Evening"];
          state.segment = segments[Math.floor(Math.random() * segments.length)];
          state.isIssued = true;
          state.currentStep = 2;
          
          closeAirBottomSheet();
          renderCurrentScreen();
  ```

- [ ] **Step 6: handleStep2() 크레덴셜 검증 로직 개편**
  레이저 스캔 애니메이션 구동 후 3,000P 지급 토스트와 난수 형태의 컴포즈 쿠폰 코드 발급 로직을 개편합니다.

  *수정 내용 (handleStep2)*:
  ```javascript
  function handleStep2() {
    console.log("Step 2 실행 - 크레덴셜 검증");
    
    // 버튼 비활성화 처리 (로딩 상태 모사)
    const btnMocaCTA = document.getElementById('btnMocaCTA');
    if (btnMocaCTA) {
      btnMocaCTA.textContent = "크레덴셜 검증 중...";
      btnMocaCTA.disabled = true;
    }

    const laserLine = document.getElementById('laserLine');
    if (laserLine) {
      laserLine.style.display = 'block';
      laserLine.classList.add('scanning');
    }
    
    // 1.5초 스캔 애니메이션 후 처리 완료
    setTimeout(() => {
      if (laserLine) {
        laserLine.classList.remove('scanning');
        laserLine.style.display = 'none';
      }
      
      // 세그먼트에 따른 쿠폰 난수 생성
      const segData = coffeeSegments[state.segment];
      const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // 상태 업데이트
      state.isVerified = true;
      state.referralCode = `${segData.codePrefix}${randomStr}`;
      state.currentStep = 3;
      
      renderCurrentScreen();
      
      // OCB 지급 알림 토스트 실행
      showToast("🪙 OK캐쉬백 3,000P 즉시 지급 완료!");
    }, 1500);
  }
  ```

- [ ] **Step 7: resetSimulator 및 getSegmentText 헬퍼 함수 동기화**
  `resetSimulator()`에서 `state.segment = null;`로 세팅하도록 연동하고, 컴포즈 커피 앱 랜딩 입력창 헬퍼인 `getSegmentText`를 신규 틱커/세그먼트 데이터와 동기화합니다.

  *수정 내용 (getSegmentText)*:
  ```javascript
  function getSegmentText(segment) {
    if (!segment || !coffeeSegments[segment]) return "";
    return coffeeSegments[segment].badge;
  }
  ```

- [ ] **Step 8: JS 파일 검증 및 커밋**
  ```bash
  git add index.js
  git commit -m "feat: implement random segment assignment, ticker timer, and dynamic event rendering in index.js"
  ```

---

### Task 4: 수동 브라우저 테스트 및 최종 검증

**Files:**
- Test: 브라우저 연동 검증 (`index.html`)

- [ ] **Step 1: 로컬 웹서버 실행 및 테스트**
  서버 실행: `python3 -m http.server 8000` 후 `http://localhost:8000` 주소에 접속하여 브라우저 동작 검증
- [ ] **Step 2: 초기 상태 검증**
  - 타이틀, 서브타이틀이 있고 그 밑에 아침, 점심, 오후, 저녁 롤링 멘트가 2.5초 주기로 정상적으로 교체 전환되는지 검증.
  - 히어로 카드 영역이 자물쇠 표시와 깜빡이는 펄스 애니메이션으로 미발급 상태를 나타내는지 확인.
- [ ] **Step 3: 발급 프로세스 검증**
  - "내 커피 수혈 타임 알아보기" CTA 버튼 클릭 시 Air SDK 바텀시트 등장하는지 확인.
  - "Confirm" 클릭 시 OCB 결제 내역 분석 중 애니메이션 동작 후 닫히는지 확인.
  - 무작위로 4가지 중 하나의 세그먼트가 지정되며, 틱커 멘트가 사라지고 이에 매칭된 세그먼트용 대형 크레덴셜 카드(그라데이션 및 이모지)가 큼직하게 노출되는지 확인.
- [ ] **Step 4: 검증 및 리워드 수령 검증**
  - CTA 버튼명이 "내 커피 수혈 타임 인증하기"로 변경되었는지 확인.
  - 인증하기 버튼을 누르면 크레덴셜 카드 위에 레이저 스캔라인 애니메이션이 돌고, 1.5초 후 완료 처리되는지 확인.
  - "인증완료 Verified" 배지가 우측 상단에 표시되고, 쿠폰 티켓 비주얼이 슬라이드 다운되어 바코드 및 코드가 나타나는지 확인.
  - 3,000P 지급 토스트 알림 메시지가 상단에 깜빡이며 동작하는지 확인.
- [ ] **Step 5: 컴포즈 앱 전환 검증**
  - CTA 버튼 밑에 "커피 쿠폰 등록하러 가기 →" 텍스트 링크 버튼이 노출되는지 확인.
  - 링크 클릭 시 컴포즈 앱 시뮬레이터로 매끄럽게 전환되는지 확인.
  - 쿠폰 등록 번호 필드에 발급된 레퍼럴 코드가 정확히 자동 입력(Auto-fill)되는지 검증.
  - 등록 클릭 시 모달 팝업 등장 및 복귀 동작 확인.
