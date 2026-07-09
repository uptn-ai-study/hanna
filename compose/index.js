// ==========================================================================
// Coffee Credential Simulator - Main JavaScript
// ==========================================================================

// 시뮬레이터 상태 변수
let state = {
  currentStep: 1, // 1: 최초 진입, 2: 발급 완료, 3: 검증 완료, 4: 컴포즈 앱 전환
  isIssued: false,
  isVerified: false,
  referralCode: "",
  segment: null, // 발급 시 랜덤 결정됨 (Morning, Lunch, Afternoon, Evening)
  isCouponRegistered: false // 추가: 쿠폰 교환 여부
};

// DOM 요소 참조
const screenContent = document.getElementById('screenContent');
const btnReset = document.getElementById('btnReset');
const statusBar = document.querySelector('.status-bar');
const homeIndicator = document.querySelector('.home-indicator');

// Air SDK DOM 요소 참조
const airBackdrop = document.getElementById('airBackdrop');
const airBottomSheet = document.getElementById('airBottomSheet');
const btnAirClose = document.getElementById('btnAirClose');
const btnAirConfirm = document.getElementById('btnAirConfirm');
const airLoadingArea = document.getElementById('airLoadingArea');
const airLoadingText = document.getElementById('airLoadingText');
const airProgressFill = document.getElementById('airProgressFill');

// 롤링 타이머 참조용 변수
let rollingInterval = null;

// 세그먼트 데이터 사전 정보 정의
const coffeeSegments = {
  "Morning": {
    title: "생명수 수혈 DNA",
    badge: "아침 06-10시 눈번쩍 생명수 수혈러",
    emoji: "🌅",
    image: "images/coffee_morning_espresso.png",
    titleColor: "#5C4033",
    barClass: "bar-purple",
    codePrefix: "COMP_MORNING_",
    stats: { energy: 95, social: 45, talk: 75, blitz: 40 },
    features: [
      "아침에 커피를 마시지 않으면 현생 시동이 아예 안 걸림",
      "극강의 효율성을 추구하며 아침 수혈을 마쳐야 비로소 일잘러 모드 온",
      "말 걸기 전 눈치껏 샷 추가 커피를 사다 주는 동료를 제일 아낌",
      "오전의 나른함이나 멍 때리는 분위기를 견디기 힘들어함"
    ]
  },
  "Lunch": {
    title: "생존 커피 수혈 DNA",
    badge: "점심 10-14시 식후 생존 커피 수혈러",
    emoji: "🥤",
    image: "images/coffee_lunch_americano.png",
    titleColor: "#8B0000",
    barClass: "bar-pink",
    codePrefix: "COMP_LUNCH_",
    stats: { energy: 60, social: 90, talk: 55, blitz: 85 },
    features: [
      "점심 식사 직후 차가운 아이스 아메리카노 수혈은 생존 필수 의식",
      "사람들과 밥 먹고 다 같이 테이크아웃 카페로 달려갈 때 가장 활력 넘침",
      "의견을 숨김없이 솔직하게 표현하며 모임 분위기를 주도하는 편",
      "점심 메뉴 정하기부터 커피 내기 가위바위보까지 열정적으로 주도함"
    ]
  },
  "Afternoon": {
    title: "피로 타파 충전 DNA",
    badge: "오후 14-17시 나른함 타파 샷추가러",
    emoji: "⚡️",
    image: "images/coffee_afternoon_latte.png",
    titleColor: "#D2691E",
    barClass: "bar-yellow",
    codePrefix: "COMP_AFTERNOON_",
    stats: { energy: 85, social: 65, talk: 80, blitz: 50 },
    features: [
      "하루 중 당분과 피로가 최고조에 달해 샷추가 수혈이 없으면 기절 일보직전",
      "끊임없이 들어오는 업무와 단톡방 알림 속에서도 결단력 있게 해결",
      "시간 낭비와 영혼 없는 빈말을 싫어하고 스피디한 결론을 원함",
      "일할 때는 누구보다 확실하지만, 쉴 때는 누구의 간섭도 원치 않음"
    ]
  },
  "Evening": {
    title: "하루 보상 힐링 DNA",
    badge: "저녁 17-22시 퇴근길 하루 보상 힐링러",
    emoji: "🌙",
    image: "images/coffee_evening_cappuccino.png",
    titleColor: "#8D6E63",
    barClass: "bar-blue",
    codePrefix: "COMP_EVENING_",
    stats: { energy: 40, social: 80, talk: 30, blitz: 95 },
    features: [
      "고단한 하루 일과를 마치고 따뜻한 커피 거품을 덮으며 평화를 찾는 유형",
      "남의 이야기를 정말 경청해주고 공감을 잘해주는 따뜻한 프로 고민상담러",
      "상대방의 기분을 세심하게 배려하느라 간혹 거절을 힘들어하는 편",
      "퇴근 후 번개 모임보다는 약속된 소규모 만남이나 혼자만의 아늑한 힐링을 선호"
    ]
  }
};

// 세그먼트에 따른 유형 텍스트 반환 헬퍼 함수
function getSegmentText(segment) {
  if (!segment || !coffeeSegments[segment]) return "";
  return coffeeSegments[segment].title;
}

// 롤링 멘트 틱커 작동 함수
function startRollingTicker() {
  if (rollingInterval) clearInterval(rollingInterval);
  const keys = Object.keys(coffeeSegments);
  let index = 0;

  const updateTicker = () => {
    const tickerContent = document.getElementById('tickerContent');
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

  // 첫 실행
  setTimeout(updateTicker, 50);
  rollingInterval = setInterval(updateTicker, 2500);
}

// 시뮬레이터 상태 초기화
function resetSimulator() {
  state.currentStep = 1;
  state.isIssued = false;
  state.isVerified = false;
  state.referralCode = "";
  state.segment = null;
  state.isCouponRegistered = false;

  if (rollingInterval) {
    clearInterval(rollingInterval);
    rollingInterval = null;
  }

  // 테마 초기화 (라이트 모드)
  statusBar.classList.remove('dark-mode');
  homeIndicator.classList.remove('dark-mode');

  // Air SDK 모달 초기화
  closeAirBottomSheet();

  renderCurrentScreen();
}

// Air SDK 모달 닫기
function closeAirBottomSheet() {
  airBackdrop.classList.remove('active');
  airBottomSheet.classList.remove('active');
  statusBar.classList.remove('dark-mode');
  homeIndicator.classList.remove('dark-mode');

  // 상태 복원
  airLoadingArea.style.display = 'none';
  const dataCard = document.querySelector('.air-data-card');
  if (dataCard) dataCard.style.display = 'block';
  if (btnAirConfirm) btnAirConfirm.style.display = 'block';
  airProgressFill.style.width = '0%';
}

// 화면 렌더링 함수
function renderCurrentScreen() {
  if (state.currentStep <= 3) {
    renderMocaEventPage();
  } else {
    renderComposeApp();
  }
}

// 컴포즈 커피 앱 모의 화면 렌더링
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

// 모카 네트워크 이벤트 화면 렌더링
function renderMocaEventPage() {
  // 상태 바 및 홈 인디케이터 테마 설정 (라이트 모드)
  statusBar.classList.remove('dark-mode');
  homeIndicator.classList.remove('dark-mode');

  if (!state.isIssued) {
    // 1. 첫 화면 렌더링
    screenContent.innerHTML = `
      <div class="coffee-start-container">
        <div class="coffee-title-area">
          <span class="coffee-start-badge">모카 x 컴포즈 커피 특집</span>
          <h1 class="coffee-start-title">‘커피 충전 집착 타임’ 분석!</h1>
          <p class="coffee-start-subtitle">
            하루 중 내가 커피를 가장 간절하게 찾는 순간은 언제일까요?<br>
            분석만 해도 OK 캐쉬백 3,000P와 컴포즈 쿠폰 혜택이 100% 쏟아져요!
          </p>
        </div>
        
        <div class="coffee-character-area">
          <img src="images/coffee_main_barista.png" class="coffee-character-img" alt="바리스타">
          <div class="coffee-tooltip">지금까지 191,763명이 참여!</div>
        </div>

        <button class="coffee-btn-start" id="btnStartTest">분석 시작하기</button>
      </div>
    `;

    const btnStartTest = document.getElementById('btnStartTest');
    if (btnStartTest) {
      btnStartTest.addEventListener('click', handleStep1);
    }
  } else {
    // 2. 결과 화면 렌더링 (Step 2 & 3)
    const segData = coffeeSegments[state.segment];
    screenContent.innerHTML = `
      <div class="moca-header">
        <svg class="moca-back-arrow" id="btnBackToStart" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="moca-header-title">결과 확인</span>
      </div>

      <div class="moca-scroll-container">
        <div class="coffee-result-container">
          
          <!-- 결과 카드 영역 -->
          <div class="coffee-result-card">
            ${state.isVerified ? `
              <div class="result-verified-badge">✓ 인증완료</div>
            ` : ''}
            
            <div class="result-header">
              <h2 class="result-type-title" style="color: ${segData.titleColor};">${segData.title}</h2>
              <div class="result-type-subtitle">${segData.badge}</div>
            </div>

            <img src="${segData.image}" class="result-character-img" alt="${segData.title}">

            <!-- 능력치 게이지 바 -->
            <div class="result-stats-area">
              <div class="stat-row">
                <span class="stat-label">에너지력</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill ${segData.barClass}" data-width="${segData.stats.energy}%"></div>
                </div>
              </div>
              <div class="stat-row">
                <span class="stat-label">모임력</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill ${segData.barClass}" data-width="${segData.stats.social}%"></div>
                </div>
              </div>
              <div class="stat-row">
                <span class="stat-label">팩폭력</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill ${segData.barClass}" data-width="${segData.stats.talk}%"></div>
                </div>
              </div>
              <div class="stat-row">
                <span class="stat-label">번개력</span>
                <div class="stat-bar-container">
                  <div class="stat-bar-fill ${segData.barClass}" data-width="${segData.stats.blitz}%"></div>
                </div>
              </div>
            </div>

            <!-- 특징 상세 -->
            <ul class="result-desc-list">
              ${segData.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>

          <!-- 레이저 스캔라인 -->
          <div class="hero-credential-container" style="position:relative; height:0; overflow:visible;">
            <div class="laser-line" id="laserLine" style="top: -240px; height: 3px; position: absolute; width: 100%;"></div>
          </div>

          <!-- 쿠폰 발급/영수증 영역 -->
          <div class="moca-reward-area" id="mocaRewardArea"></div>

          <!-- 하단 CTA 버튼 -->
          <button class="moca-btn moca-btn-primary" id="btnMocaCTA" style="margin-top: 8px;"></button>

          <!-- 2차 컴포즈앱 등록 링크 영역 -->
          <div class="moca-link-button-area" id="mocaLinkArea"></div>
        </div>
      </div>
    `;

    // 게이지 바 애니메이션 트리거
    setTimeout(() => {
      const fills = document.querySelectorAll('.stat-bar-fill');
      fills.forEach(f => {
        f.style.width = f.getAttribute('data-width');
      });
    }, 100);

    // 뒤로가기 버튼 리스너
    const btnBackToStart = document.getElementById('btnBackToStart');
    if (btnBackToStart) {
      btnBackToStart.addEventListener('click', () => {
        resetSimulator();
      });
    }

    // 리워드 및 CTA 렌더링 호출
    renderRewardContent();
    renderCTAButton();
  }
}

// 1. 크레덴셜 카드 렌더링 함수 (통합형으로 대체하여 공백 처리)
function renderCardContent() { }

// 2. 리워드 쿠폰 카드 렌더링 함수
function renderRewardContent() {
  const rewardArea = document.getElementById('mocaRewardArea');
  if (!rewardArea) return;

  if (state.isVerified && state.segment) {
    const segData = coffeeSegments[state.segment];
    rewardArea.innerHTML = `
      <div class="moca-coupon-ticket" style="margin-top: 8px;">
        <div class="ticket-top">
          <div>
            <div class="ticket-brand">COMPOSE COFFEE</div>
            <div class="ticket-title">아메리카노 1잔 무료 쿠폰</div>
          </div>
          <span class="ticket-points-badge">3,000P 적립 완료</span>
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

// 3. CTA 버튼 텍스트 및 상태 갱신 함수
function renderCTAButton() {
  const btnMocaCTA = document.getElementById('btnMocaCTA');
  const linkArea = document.getElementById('mocaLinkArea');
  if (!btnMocaCTA || !linkArea) return;

  if (state.currentStep === 2) {
    btnMocaCTA.textContent = "내 커피 DNA 인증하고 혜택 받기";
    btnMocaCTA.disabled = false;
    btnMocaCTA.classList.remove('disabled');
    btnMocaCTA.style.opacity = '1';
    linkArea.innerHTML = '';

    btnMocaCTA.onclick = () => {
      handleStep2();
    };
  } else if (state.currentStep === 3) {
    btnMocaCTA.textContent = "인증 완료 (3,000P 즉시 지급됨)";
    btnMocaCTA.disabled = true;
    btnMocaCTA.classList.add('disabled');
    btnMocaCTA.style.opacity = '0.6';

    linkArea.innerHTML = `
      <button class="moca-link-btn" id="btnGoToCompose" style="margin-top: 12px;">
        커피 쿠폰 등록하러 가기 &rarr;
      </button>
    `;

    const btnGoToCompose = document.getElementById('btnGoToCompose');
    if (btnGoToCompose) {
      btnGoToCompose.addEventListener('click', handleStep3);
    }
  }
}

// 각 스텝 핸들러
function handleStep1() {
  console.log("Step 1 실행 - Air SDK 호출");

  // Air SDK 바텀시트 활성화
  airBackdrop.classList.add('active');
  airBottomSheet.classList.add('active');

  // 상태 바 및 홈 인디케이터 테마 설정 (다크 모드)
  statusBar.classList.add('dark-mode');
  homeIndicator.classList.add('dark-mode');
}

// Air SDK 바텀시트 내부 이벤트 바인딩
if (btnAirClose) {
  btnAirClose.addEventListener('click', closeAirBottomSheet);
}
if (airBackdrop) {
  airBackdrop.addEventListener('click', closeAirBottomSheet);
}

if (btnAirConfirm) {
  btnAirConfirm.addEventListener('click', () => {
    // UI 로딩 상태로 변경
    const dataCard = document.querySelector('.air-data-card');
    if (dataCard) dataCard.style.display = 'none';
    btnAirConfirm.style.display = 'none';
    airLoadingArea.style.display = 'flex';

    // 로딩바 애니메이션 진행
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      airProgressFill.style.width = progress + '%';

      if (progress < 40) {
        airLoadingText.textContent = "커피 수혈 결제 내역 분석 중...";
      } else if (progress < 80) {
        airLoadingText.textContent = "커피 DNA 수혈 타임 분석 중...";
      } else if (progress < 100) {
        airLoadingText.textContent = "커피 DNA 분석 완료!";
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // 상태 업데이트 및 화면 갱신 (무작위 세그먼트 부여)
          const segments = ["Morning", "Lunch", "Afternoon", "Evening"];
          state.segment = segments[Math.floor(Math.random() * segments.length)];
          state.isIssued = true;
          state.currentStep = 2;

          closeAirBottomSheet();
          renderCurrentScreen();
        }, 300);
      }
    }, 80);
  });
}

function handleStep2() {
  console.log("Step 2 실행 - 크레덴셜 검증");

  // 버튼 로딩 상태 변경
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

  // 1.5초 스캔 애니메이션 시뮬레이션 후 성공 처리
  setTimeout(() => {
    if (laserLine) {
      laserLine.classList.remove('scanning');
      laserLine.style.display = 'none';
    }

    // 세그먼트에 따른 쿠폰 난수 코드 생성
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

// 커스텀 토스트 알림 함수
function showToast(message) {
  const mocaToast = document.getElementById('mocaToast');
  const mocaToastText = document.getElementById('mocaToastText');
  if (mocaToast && mocaToastText) {
    mocaToastText.textContent = message;
    mocaToast.classList.add('active');

    // 2.8초 후 자동으로 닫기
    setTimeout(() => {
      mocaToast.classList.remove('active');
    }, 2800);
  }
}

function handleStep3() {
  console.log("Step 3 실행 - 컴포즈 앱 전환");
  state.currentStep = 4;
  renderCurrentScreen();
}

// 이벤트 리스너 등록
btnReset.addEventListener('click', () => {
  resetSimulator();
});

// 초기화 호출
document.addEventListener('DOMContentLoaded', () => {
  resetSimulator();
});
