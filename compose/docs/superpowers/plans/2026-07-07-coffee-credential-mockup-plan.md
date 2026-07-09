# 커피 크레덴셜 모의 시뮬레이터 (Mock-up) 구현 계획서

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 블록체인 크레덴셜 발급/검증 및 컴포즈 커피 앱 자동 연동(Approach B) 기획에 기반한 전체 시나리오를 웹브라우저에서 직접 조작해 볼 수 있는 100% 인터랙티브 모바일 시뮬레이터 웹앱을 구현합니다.

**Architecture:** 단일 페이지 모션 시뮬레이터로 구현하며, 모바일 화면 중심의 화면 뷰포트를 가진 스마트폰 디바이스 목업 프레임을 렌더링합니다. HTML/CSS/Vanilla JS로 작성하여 빌드 도구 없이 브라우저에서 바로 실행할 수 있도록 설계합니다.

**Tech Stack:** HTML5, CSS3 (Vanilla CSS), JavaScript (ES6+, DOM API)

## Global Constraints

* 모든 화면 요소의 스타일과 애니메이션은 프리미엄 무드로 구현 (그라데이션, 부드러운 트랜지션, 호버 효과 등).
* 기획서(`COFFEE_CREDENTIAL_PROPOSAL.md`)의 각 Step 정책 문구와 상태 전이 매트릭스를 100% 일치시킴.
* 외부 라이브러리(Tailwind 등) 없이 순수 CSS와 JS로 동작하도록 구성.

---

### Task 1: 스마트폰 디바이스 목업 프레임 및 기본 레이아웃 구성

**Files:**
* Create: `/Users/1004823/Desktop/compose/index.html`
* Create: `/Users/1004823/Desktop/compose/index.css`
* Create: `/Users/1004823/Desktop/compose/index.js`

**Interfaces:**
* Produces: `index.html`, `index.css`, `index.js` 파일 및 디바이스 외곽 베젤, 상단 상태 바, 기본 화면 프레임 및 초기화 버튼 UI 구성

- [ ] **Step 1: HTML 기초 구조 작성**
  스마트폰 모양의 기기 베젤을 렌더링하고, 초기화(Reset) 버튼이 포함된 컨트롤러 바를 배치합니다.
- [ ] **Step 2: CSS 레이아웃 및 폰 베젤 스타일 구현**
  아이폰 15 Pro 스타일의 다크 베젤(`border-radius`, `box-shadow`)과 시간, 배터리, 와이파이가 있는 상단 상태 바 스타일을 정의합니다.
- [ ] **Step 3: JS 초기화 로직 구현**
  리셋 버튼 클릭 시 시뮬레이션 상태를 초기화하는 기초 뼈대를 작성합니다.
- [ ] **Step 4: 브라우저에서 렌더링 검증**
  Chrome 브라우저에서 실행하여 기기 목업이 화면 중앙에 올바르고 아름답게 위치하는지 검증합니다.

---

### Task 2: 화면 1 - 모카 네트워크 이벤트 메인 및 3단계 카드 렌더링

**Files:**
* Modify: `/Users/1004823/Desktop/compose/index.html` (스레드 1 내부 구조 정의)
* Modify: `/Users/1004823/Desktop/compose/index.css` (카드 및 버튼 스타일)
* Modify: `/Users/1004823/Desktop/compose/index.js` (Step 상태 관리 및 활성화 분기)

**Interfaces:**
* Consumes: Task 1의 기본 디바이스 레이아웃
* Produces: 이벤트 메인 배너, 유의사항 및 스텝형 3개 카드 UI 구성 (Step 1은 활성화, Step 2/3은 Dimmed 상태)

- [ ] **Step 1: HTML에 이벤트 설명과 카드 3개 추가**
  * 타이틀: `커피로 나의 유형 알아보고 700P + 컴포즈 커피 할인 쿠폰 받기!`
  * Step 1 카드: `[내 커피 구매 시간대 크레덴셜 만들기]` 버튼 포함, 흐릿한 카드 그래픽.
  * Step 2 카드: `[크레덴셜 인증하고 혜택 받기]` 버튼 포함, OCB 700P 배너.
  * Step 3 카드: `[컴포즈 커피 쿠폰 받으러 가기]` 버튼 포함, 컴포즈 아메리카노 이미지 배너.
- [ ] **Step 2: CSS 카드 스타일링**
  커피 톤앤매너(`background: linear-gradient(135deg, #3E2723, #4E342E)`)와 투명도 50%의 비활성화(Dimmed) 스타일 클래스(`.dimmed`)를 정의합니다.
- [ ] **Step 3: JS 상태 머신 설계**
  `currentStep = 1` 상태를 생성하고, 상태에 따라 클래스(`.active`, `.dimmed`)를 동적으로 입히는 렌더링 함수(`renderState()`)를 구현합니다.
- [ ] **Step 4: 화면 상태 검증**
  최초 렌더링 시 Step 1만 버튼이 주황색으로 반짝이고, Step 2 & 3은 희미하게 잠겨 있는지 검증합니다.

---

### Task 3: 화면 2 - Air SDK 바텀시트 모달 및 크레덴셜 생성 시뮬레이션

**Files:**
* Modify: `/Users/1004823/Desktop/compose/index.html` (바텀시트 모달 추가)
* Modify: `/Users/1004823/Desktop/compose/index.css` (바텀시트 애니메이션 및 다크 테마)
* Modify: `/Users/1004823/Desktop/compose/index.js` (바텀시트 슬라이드 인터랙션 및 로딩 바)

**Interfaces:**
* Consumes: Task 2의 렌더링 상태
* Produces: Step 1 클릭 시 올라오는 Air SDK 모달, 데이터 조회/크레덴셜 발급 애니메이션 구현, 완료 후 Step 1 카드 잠금 해제

- [ ] **Step 1: HTML에 Air SDK 바텀시트 마크업 추가**
  로고 `AIR`, 문구 `Store your information securely`, `Confirm` 버튼과 함께 `OCB 포인트 등급: 100,000 P` 카드 배치.
- [ ] **Step 2: CSS 바텀시트 슬라이드 트랜지션 추가**
  하단에 숨겨져 있다가(transform: translateY(100%)) 활성화 시 올라오는(transform: translateY(0)) 효과 구현. 다크 모드 스타일 테마 적용.
- [ ] **Step 3: JS 애니메이션 로직 구현**
  * `Confirm` 버튼 클릭 시 1.5초간 스피너와 로딩 바 작동.
  * 로딩 후 모달 닫기 처리.
  * 완료 시 `is_issued = true` 및 `currentStep = 2` 설정.
  * Step 1 카드의 블러 해제: **'점심형 (Lunch: 10:00 ~ 14:00)'** 텍스트를 카드 내부 그래픽으로 선명하게 교체.
- [ ] **Step 4: 모달 슬라이드 및 렌더링 성공 여부 검증**
  버튼을 누르고 확인 시 바텀시트가 성공적으로 동작하고, 모카 웹뷰의 크레덴셜이 활성화되는지 검증합니다.

---

### Task 4: 화면 3 - 크레덴셜 레이저 스캔 검증 및 OCB 700P 획득

**Files:**
* Modify: `/Users/1004823/Desktop/compose/index.html` (검증 토스트 및 레퍼럴 코드 영역 추가)
* Modify: `/Users/1004823/Desktop/compose/index.css` (레이저 스캔 애니메이션 효과)
* Modify: `/Users/1004823/Desktop/compose/index.js` (레이저 트리거 및 OCB 지급 토스트, 코드 난수 생성)

**Interfaces:**
* Consumes: Task 3의 발급 완료 상태
* Produces: Step 2 클릭 시 레이저 스캔 효과, 700P 지급 완료 토스트 알림, 레퍼럴 코드 `COMP_LUNCH_[난수]` 로드 및 Step 3 활성화

- [ ] **Step 1: HTML에 레퍼럴 코드 노출 박스 및 검증 토스트 마크업 추가**
  Step 2 카드 내부에 완료 시 나타날 레퍼럴 코드 컨테이너 정의.
- [ ] **Step 2: CSS 레이저 스캔 라인 애니메이션 구현**
  크레덴셜 카드 내부를 위아래로 훑고 지나가는 광원 라인 효과(`.laser-line { animation: scan 1s ... }`) 구현.
- [ ] **Step 3: JS 검증 및 보상 적립 로직 구현**
  * Step 2 클릭 시 1초간 레이저 애니메이션 활성화.
  * 완료 시 `is_verified = true` 및 `currentStep = 3` 설정.
  * OCB 700P 즉시 지급 성공 팝업 토스트 노출.
  * 임의의 레퍼럴 코드 `COMP_LUNCH_W3B9X7`를 텍스트로 렌더링.
- [ ] **Step 4: 스캔 애니메이션 및 보상 지급 완료 검증**
  인증 버튼 클릭 후 레이저가 동작하고 토스트 메시지와 레퍼럴 코드가 생성되는지 검증합니다.

---

### Task 5: 화면 4 - 컴포즈 커피 앱 전환 및 레퍼럴 코드 자동 입력 (Approach B)

**Files:**
* Modify: `/Users/1004823/Desktop/compose/index.html` (컴포즈 앱 모의 화면 구조 추가)
* Modify: `/Users/1004823/Desktop/compose/index.css` (컴포즈 시그니처 옐로우 & 다크 테마)
* Modify: `/Users/1004823/Desktop/compose/index.js` (앱 실행 화면 페이드인 트랜지션 및 자동 입력 바인딩)

**Interfaces:**
* Consumes: Task 4의 검증 완료된 상태 및 레퍼럴 코드 데이터
* Produces: Step 3 클릭 시 컴포즈 앱 전환 모션, 레퍼럴 코드 자동 완성(Auto-fill), 등록 완료 후 1,800원 아메리카노 할인 쿠폰 지급 완료 알림

- [ ] **Step 1: HTML에 컴포즈 앱 모의 화면 구조 마크업 작성**
  컴포즈 로고 스플래시 화면 및 쿠폰 입력란(`input type="text"`, readonly), `[등록]` 버튼 마크업 배치.
- [ ] **Step 2: CSS 컴포즈 앱 옐로우 테마 스타일링**
  컴포즈 시그니처 옐로우(#FFE300)와 다크 블랙(#1A1A1A) 조합으로 쿠폰 페이지 완성.
- [ ] **Step 3: JS 앱 화면 전환 및 코드 자동 주입 구현**
  * Step 3 버튼 클릭 시 모카 화면을 감추고 컴포즈 스플래시 노출 (0.8초).
  * 스플래시 종료 후 쿠폰 페이지로 랜딩 및 Task 4의 레퍼럴 코드(`COMP_LUNCH_W3B9X7`) 값을 쿠폰 입력 필드에 자동으로 주입(Auto-fill).
  * 등록 버튼 클릭 시 "쿠폰 등록 성공! 컴포즈 아메리카노 1잔 무료 쿠폰이 발급되었습니다." 커스텀 Alert 팝업 표시.
- [ ] **Step 4: 최종 엔드투엔드 시나리오 실행 및 리셋 검증**
  전체 단계를 하나씩 진행하며 데이터가 정상 이동하는지, 초기화 시 원점(Step 0)으로 복귀하는지 검증합니다.
