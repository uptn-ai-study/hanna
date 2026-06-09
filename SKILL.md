# UPTNStation UI Kit — 팀 공통 규약

> 이 문서는 UPTNStation 앱의 UI 공통 규약을 정의합니다.  
> 모든 컴포넌트는 이 문서의 토큰·스타일 값을 기준으로 구현합니다.

---

## 목차

1. [Color Palette](#1-color-palette)
2. [Typography](#2-typography)
3. [Buttons](#3-buttons)
4. [Input Fields](#4-input-fields)
5. [Tab Bar](#5-tab-bar)
6. [Badge & Chip](#6-badge--chip)
7. [Cards & List Item](#7-cards--list-item)
8. [Bottom Sheet](#8-bottom-sheet)
9. [Empty State & FAB](#9-empty-state--fab)
10. [Spacing & Border Radius](#10-spacing--border-radius)

---

## 1. Color Palette

### CSS 변수 (`:root`)

```css
:root {
  --primary:       #6366F1;
  --primary-dark:  #4F52D9;
  --primary-light: #EEF0FF;
  --primary-dim:   rgba(99, 102, 241, 0.10);

  --app-bg:        #F4F3FF;
  --card-bg:       #FFFFFF;
  --muted-bg:      #F5F5F8;
  --border:        #E5E7EB;

  --text-1:        #111827;   /* 본문 주요 텍스트 */
  --text-2:        #6B7280;   /* 서브 텍스트 */
  --text-3:        #9CA3AF;   /* 캡션, 비활성 텍스트 */

  --success:       #10B981;
  --error:         #EF4444;
}
```

### 색상 토큰 요약표

| 토큰            | Hex / Value                    | 용도                        |
|----------------|--------------------------------|-----------------------------|
| `--primary`     | `#6366F1`                      | CTA 버튼, 포인트 컬러        |
| `--primary-dark`| `#4F52D9`                      | 버튼 active 상태             |
| `--primary-light`| `#EEF0FF`                     | 배경 강조, 선택된 영역 배경  |
| `--primary-dim` | `rgba(99,102,241,0.10)`        | 미묘한 primary 배경          |
| `--app-bg`      | `#F4F3FF`                      | 앱 전체 배경                 |
| `--card-bg`     | `#FFFFFF`                      | 카드, 시트 배경              |
| `--muted-bg`    | `#F5F5F8`                      | Secondary 버튼, 뮤트 영역    |
| `--border`      | `#E5E7EB`                      | 구분선, 인풋 테두리          |
| `--text-1`      | `#111827`                      | 주요 텍스트                  |
| `--text-2`      | `#6B7280`                      | 보조 텍스트                  |
| `--text-3`      | `#9CA3AF`                      | 캡션, 플레이스홀더           |
| `--success`     | `#10B981`                      | 성공 상태, 뱃지              |
| `--error`       | `#EF4444`                      | 오류 상태                    |

---

## 2. Typography

기본 폰트: **`"SUIT Variable", SUIT, -apple-system, sans-serif`**  
모든 텍스트에 `letter-spacing: -0.3px` 기본 적용 권장.

| 역할        | 크기 / 줄간격 | 굵기 | 색상         | 용도 예시                     |
|-----------|---------------|------|------------|-------------------------------|
| Display   | 36px / -      | 700  | `--text-1` | 숫자 강조 (포인트, 잔액 등)    |
| Title 1   | 28px / -      | 700  | `--text-1` | 화면 주요 수치 (예: 8,913 UP)  |
| Title 2   | 22px / 32px   | 700  | `--text-1` | 페이지 대제목 (예: 어디로 보낼까요?) |
| Title 3   | 18px / -      | 700  | `--text-1` | 섹션 제목 (예: 나의 UP)        |
| Title 4   | 16px / -      | 700  | `--text-1` | 카드 제목, 버튼 라벨           |
| Body 1    | 15px / 24px   | 400  | `#333333`  | 본문 내용                      |
| Body 2    | 14px / -      | 400  | `--text-2` | 보조 설명, 메타 정보            |
| Caption   | 12px / -      | 400  | `--text-3` | 날짜, 출처 등 부가 정보         |
| Link / Highlight | — / — | — | `--primary` | 인라인 링크, 강조 텍스트      |

```css
/* 예시 */
.display  { font-size: 36px; font-weight: 700; }
.title-1  { font-size: 28px; font-weight: 700; }
.title-2  { font-size: 22px; line-height: 32px; font-weight: 700; }
.title-3  { font-size: 18px; font-weight: 700; }
.title-4  { font-size: 16px; font-weight: 700; }
.body-1   { font-size: 15px; line-height: 24px; font-weight: 400; color: #333333; }
.body-2   { font-size: 14px; font-weight: 400; color: var(--text-2); }
.caption  { font-size: 12px; font-weight: 400; color: var(--text-3); }
.link     { color: var(--primary); }
```

---

## 3. Buttons

모든 버튼 공통 속성:

```css
.btn {
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  letter-spacing: -0.3px;
  transition: 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn:active { transform: scale(0.97); }
```

### 3-1. Primary (Full Width CTA)

```css
.btn-primary {
  background: var(--primary);
  color: #fff;
  font-size: 16px;
  height: 56px;
  border-radius: 12px;
  width: 100%;
}
.btn-primary:active { background: var(--primary-dark); }
```

- 화면 하단의 단일 주요 액션에 사용
- 항상 `width: 100%` 전폭 사용

### 3-2. Secondary (나란히 배치 - 연한 회색)

```css
.btn-secondary {
  background: var(--muted-bg);
  color: var(--text-1);
  font-size: 16px;
  height: 56px;
  border-radius: 12px;
  flex: 1;
}
```

- Primary와 나란히 쓸 때 `.btn-row { display: flex; gap: 10px; }` 사용
- Primary와 Secondary 비율은 `6:4` 또는 `1:1` (용도에 따라)

### 3-2-2. Secondary Light (연보라색 채움 버튼)

```css
.btn-secondary-light {
  background: var(--primary-light);
  color: var(--primary);
  font-size: 16px;
  height: 56px;
  border-radius: 12px;
  width: 100%;
}
```

- Primary 액션의 차선책 혹은 나란히 다중 액션을 배치할 때 사용 (예: 보내기 옆의 받기, 교환하기 등)

### 3-2-3. Tertiary Outline (흰색 배경 + 테두리 버튼)

```css
.btn-tertiary-outline {
  background: var(--card-bg);
  border: 1px solid var(--border);
  color: var(--text-1);
  font-size: 15px;
  height: 48px;
  border-radius: 12px;
  width: 100%;
}
```

- 카드 내부의 차선 기능 및 인라인 추가 제어 액션에 사용 (예: 이자 받기, 이자 맡기 등)

### 3-3. 아이콘 버튼 — 보내기 / 받기

```css
.btn-icon-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 16px;
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 700;
}
```

### 3-4. Outline Pill (소형 태그 버튼)

```css
.btn-outline {
  background: var(--muted-bg);
  border: 1px solid var(--border);
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  border-radius: 9999px;
  padding: 0 20px;
}
```

- 필터, 퀵 액션 등 소형 인터랙션에 사용
- `border-radius: 9999px` (완전한 Pill 형태)

### 3-5. Text Button

```css
.btn-text {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 15px;
  font-weight: 500;
  padding: 0 4px;
  font-family: inherit;
  cursor: pointer;
}
```

### 3-6. Disabled

```css
.btn-disabled {
  background: #E5E7EB;
  color: #9CA3AF;
  font-size: 16px;
  height: 56px;
  border-radius: 12px;
  width: 100%;
  cursor: not-allowed;
}
```

### 3-7. Sticky Bottom Bar (Full-bleed Button)

```css
.sticky-bottom-bar {
  display: flex;
  position: sticky;
  bottom: 0;
  width: 100%;
  background: var(--card-bg);
  /* 양옆/하단 여백이 없으며 꽉 차는 풀블리드 영역 */
}
.btn-flat {
  flex: 1;
  height: 56px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 0; /* 화면 외곽에 닿으므로 곡률 제거 */
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}
.btn-flat-secondary {
  background: #F5F5F8; /* Muted BG */
  color: var(--text-1);
}
.btn-flat-primary {
  background: var(--primary);
  color: #fff;
}
```

- 송금 마지막 확인 단계(`계속하기`, `취소하기`) 등 화면 하단을 꽉 채우는 분할 버튼에 사용합니다.
- 좌우 버튼 모서리(`border-radius`)를 0으로 설정하여 화면 프레임과 매끄럽게 연결되도록 합니다.

---

## 4. Input Fields

### 4-1. 보더리스 대형 인풋 (Borderless Large Input)

```css
.input-container-large {
  display: flex;
  align-items: center;
  position: relative;
  border-bottom: 2px solid var(--border); /* 하단 밑줄 */
  padding: 8px 0;
  margin-bottom: 12px;
}
.input-container-large:focus-within {
  border-bottom-color: var(--primary); /* 포커스 시 보라색 언더라인 */
}
.input-field-large {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-1);
  border: none;
  background: none;
  outline: none;
  width: 100%;
  padding-right: 48px; /* 우측 삭제 버튼 공간 */
  font-family: inherit;
}
.input-clear-btn {
  position: absolute;
  right: 16px;
  background: #E5E7EB;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  color: #9CA3AF;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.input-suffix-large {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-3);
  margin-left: 8px;
}
```

- **미니멀 레이아웃**: 사각형 테두리를 완전히 제거하고 하단의 얇은 보더 라인(`border-bottom`)만 남겨 세련되고 깨끗한 공간감을 줍니다.
- **거대 폰트**: 중요도 높은 금액/수량 데이터를 눈에 띄게 표시하기 위해 폰트 사이즈를 **`28px`** (Title 1급) 및 Bold 스타일로 지정합니다.
- **Clear(✕) 버튼**: 입력 도중 한 번에 값을 지울 수 있는 회색 원형 ✕ 삭제 버튼을 배치하여 모바일 접근성을 극대화합니다.

### 4-1-2. 입력 에러 상태 및 부분 강조 (Error & Highlight)

```css
.input-error-text {
  color: var(--error);
  font-size: 13px;
  margin-top: 4px;
}
.input-text-highlight {
  color: var(--primary);
}
```

- **에러 메시지**: 지갑 주소 형식이 다르거나 잔액이 부족할 경우, 인풋 박스 하단에 붉은색(`--error`)으로 텍스트를 제공합니다.
- **부분 강조**: 긴 주소 텍스트의 끝 4자리 등 특정 값만 보라색(`--primary`)으로 하이라이트할 수 있습니다.

### 4-2. 퀵 옵션 칩 (Quick Option Chips)

```css
.quick-chip-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  margin-bottom: 20px;
}
.quick-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px; /* 피그마 고정 높이 40px */
  width: 56px; /* 짧은 칩 고정 너비 56px (+1, 최대 등) */
  padding: 6px 16px; /* 피그마 여백 준수 */
  border-radius: 10px; /* 피그마 곡률 10px */
  background: #F5F5F5; /* Gray150 */
  color: #555555; /* 피그마 버튼 텍스트 컬러 */
  font-size: 14px; /* 피그마 4_Body_14SB */
  font-weight: 600; /* SemiBold */
  line-height: 22px; /* Line height 22px */
  letter-spacing: -0.3px; /* Letter spacing -0.3px */
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}
.quick-chip:active {
  background: #E5E7EB;
  transform: scale(0.97);
}
.quick-chip-wide {
  width: auto; /* 긴 텍스트 칩 가변 너비 대응 */
  min-width: 56px;
}
```

- **피그마 수치 정밀 규정**: 칩 높이를 고정 **`40px`**, 짧은 수치/명칭 조절 칩은 고정 너비 **`56px`**, 테두리 모서리는 **`10px`**로 통일하여 정돈된 레이아웃을 형성합니다.
- **배경색 (Gray150)**: 피그마 표준 색상인 **`#F5F5F5`**를 명확히 사용하여 모바일 디자인의 미적 감각을 일치시킵니다.
- **가변 확장 지원**: 텍스트가 긴 버튼(예: `현재 시세 적용` 등)은 글자 잘림을 예방하기 위해 `quick-chip-wide` 속성을 주어 유연하게 좌우 패딩을 유지하며 확장되도록 설계합니다.
- **마이크로 인터랙션**: 클릭 시 `:active` 피드백을 통해 쾌적하고 반응성 있는 모바일 입력 경험을 선사합니다.

---

## 5. Tab Bar

```css
.tab-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center; /* 세로 중앙 정렬 */
  height: 62px; /* 피그마 고정 높이 62px */
  padding: 0 24px; /* 좌우 패딩 24px */
  gap: 20px; /* 탭 아이템 간 격차 20px */
  background: var(--card-bg);
  border-bottom: none; /* 하단 회색 선 제거 */
}
.tab-item {
  flex: none; /* 너비 균등 분할 제거 */
  height: 100%; /* 탭바 전체 높이를 확보하여 밑줄을 바닥에 붙임 */
  display: flex;
  align-items: center; /* 세로 중앙 정렬 */
  padding: 0; /* 높이 고정 및 flex 정렬로 인해 패딩 제거 */
  font-size: 16px;
  font-weight: 400;
  color: var(--text-3);
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  font-family: inherit;
  letter-spacing: -0.3px;
}
.tab-item.active {
  font-weight: 700;
  color: var(--text-1);
}
.tab-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0; /* 글자폭에 100% 핏되도록 보정 */
  right: 0;
  height: 3px; /* 굵고 정돈된 3px 두께 */
  background: var(--text-1);
  border-radius: 2px;
}
```

- **레이아웃 위치**: 상단 고정 헤더 바로 밑에 연달아 밀착하여 배치됩니다.
- **좌측 밀착 정렬**: 전체 폭 쪼개기 정렬 대신 `justify-content: flex-start;`로 좌측에 바짝 정렬하고 항목 간 `20px` 갭(`gap: 20px`)으로 구분합니다.
- **고정 높이 및 여백**: 탭바 컨테이너 높이를 고정 `62px`로 잡고, 컨테이너 내부의 양측 수평 패딩을 `24px`로 설정하여 콘텐츠와 알맞은 내부 간격을 갖춥니다.
- **가로선(회색 선) 삭제**: 탭 영역 전체를 가로지르는 하단 회색 선을 완전히 제거하여 순백색 배경 위에 깔끔하게 텍스트와 굵은 활성 라인만 부각시킵니다.
- **인디케이터 폭 & 정렬**: 활성 밑줄이 탭 텍스트 가로폭과 100% 일치하도록 `left: 0; right: 0;`으로 글자폭 피팅을 구현하며, `.tab-item`에 `height: 100%`를 주어 인디케이터가 `62px` 컨테이너의 바닥(`bottom: 0`)에 올바르게 위치하게 합니다.

---

## 6. Badge & Chip

### 6-1. Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  font-family: inherit;
  font-weight: 600;
  border: none;
}
/* 성공 (응모 완료 등) */
.badge-success {
  background: var(--success);
  color: #fff;
  font-size: 11px;
  border-radius: 6px;
  padding: 3px 8px;
}
/* 추천 */
.badge-primary {
  background: var(--primary-light);
  color: var(--primary);
  font-size: 11px;
  border-radius: 6px;
  padding: 3px 8px;
}
/* 카운트 (+51 등) */
.badge-count {
  background: var(--muted-bg);
  color: var(--text-2);
  font-size: 11px;
  border-radius: 9999px;
  padding: 2px 8px;
}
/* 오류 */
.badge-error {
  background: #FEE2E2;
  color: var(--error);
  font-size: 11px;
  border-radius: 6px;
  padding: 3px 8px;
}
```

### 6-2. Chip (필터 탭)

```css
.chip {
  height: 34px;
  border-radius: 9999px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 500;
  background: var(--muted-bg);
  color: var(--text-2);
  border: none;
  cursor: pointer;
  font-family: inherit;
}
.chip.active {
  background: var(--primary);
  color: #fff;
  font-weight: 700;
}
```

---

## 7. Cards & List Item

### 7-1. Standard Card

```css
.card {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.06);
}
/* 선택된 카드 */
.card-selected {
  border: 2px solid var(--primary);
  border-radius: 20px;
}
```

### 7-2. List Item

```css
.list-item {
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 8px;
}
.list-thumb {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
```

- 썸네일(48×48px, `border-radius: 14px`) + 텍스트 영역 + 우측 화살표(›) 구조
- 아이템 간 간격: `margin-bottom: 8px`

### 7-3. Spec List (명세서형 리스트)

```css
.spec-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}
.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #F3F4F6;
}
.spec-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.spec-label {
  font-size: 14px;
  color: var(--text-2);
  font-weight: 400;
}
.spec-value {
  font-size: 14px;
  color: var(--text-1);
  font-weight: 700;
  text-align: right;
}
```

- **표 대안 명세**: 격자 모양의 표(Table) 대신 명세서/리스트 감성을 전달할 때 사용합니다 (좌측 라벨 정렬, 우측 수치 정렬 및 굵게 표현).
- **빈 상태(Empty State) 대응**: 입력이 완료되지 않았거나 계산 전인 상태에서도 결과 프레임을 숨기지 않고 항상 노출하되, 유효하지 않은 수치는 대시(`-`) 기호(예: `- 원`, `- AVAX`)로 깔끔하게 플레이스홀더 처리하여 안정적인 레이아웃 형태를 제공합니다.

### 7-4. Vertical Key-Value Card (디테일 확인용)

```css
.detail-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
}
.detail-label {
  font-size: 13px;
  color: var(--text-2);
}
.detail-value {
  font-size: 15px;
  color: var(--text-1);
  font-weight: 500;
  word-break: break-all;
}
```

- **세로형 구조**: 라벨(회색)이 상단에, 실제 값(검정/보라)이 하단에 위치하는 형태입니다.
- **테두리 카드**: 그림자 없이 `1px solid var(--border)` 외곽선과 `12px` 반경을 사용하여 깔끔한 명세 카드로 구성합니다.

---

## 8. Bottom Sheet

```css
.bottom-sheet-demo {
  background: var(--card-bg);
  border-radius: 24px 24px 0 0;
  padding: 24px 20px 28px;
  box-shadow: 0px -4px 24px rgba(0, 0, 0, 0.10);
}
.sheet-handle {
  width: 36px;
  height: 4px;
  background: #E5E7EB;
  border-radius: 2px;
  margin: 0 auto 20px;
}
.sheet-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
  margin-bottom: 16px;
}
```

- 상단 핸들(36×4px, `#E5E7EB`) 필수
- 제목: Title 2 스타일 (`22px / 700`)
- 상단 라운드: `border-radius: 24px 24px 0 0`
- 정보 강조 영역: `border: 1px solid var(--border)`, `border-radius: 12px`, `padding: 14px 16px`

---

## 9. Empty State & FAB

### 9-1. Empty State

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  gap: 10px;
}
.empty-icon  { font-size: 48px; opacity: 0.35; }
.empty-text  { font-size: 16px; font-weight: 700; color: var(--text-2); }
```

- 아이콘(48px, `opacity: 0.35`) + 설명 텍스트(`--text-2`, 16px/700) 구성

### 9-2. FAB (Floating Action Button)

```css
.fab {
  width: 52px;
  height: 52px;
  border-radius: 9999px;
  background: var(--primary);
  color: #fff;
  font-size: 22px;
  box-shadow: 0px 4px 16px rgba(99, 102, 241, 0.35);
  position: fixed;
  bottom: 28px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
}
```

---

## 10. Spacing & Border Radius

### 간격 (Spacing)

| 용도                    | 값     |
|------------------------|--------|
| 섹션 간격               | `48px` |
| 카드 내부 패딩          | `16px` |
| 버튼 그룹 gap           | `10px` |
| 리스트 아이템 간격      | `8px`  |
| 인풋 수평 패딩          | `16px` |
| 화면 좌우 여백          | `20px` |
| Bottom Sheet 내부 패딩 | `24px 20px 28px` |

### Border Radius

| 용도                    | 값        |
|------------------------|-----------|
| 전폭 버튼 (Primary)     | `12px`    |
| 카드                   | `16px`    |
| 선택된 카드             | `20px`    |
| Bottom Sheet          | `24px 24px 0 0` |
| 인풋 필드              | `12px`    |
| Pill 버튼 / Chip       | `9999px`  |
| 썸네일 아이콘           | `14px`    |
| 뱃지                   | `6px`     |
| FAB                   | `9999px`  |

---

## 부록 — App Header

```css
.app-header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: none; /* 하단 회색 선 삭제 */
}
.header-back {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.header-title  { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: var(--text-1); }
.header-icon   { font-size: 20px; color: var(--text-1); }
.header-icons  { display: flex; gap: 16px; align-items: center; }
```

- 높이 고정 `56px`
- **화살표 GNB 구조**: 좌측에 뒤로가기 화살표 기호(`＜` 또는 `.header-icon`)가 배치되고, 우측에 타이틀 명칭(`.header-title`)이 정렬되어 밀접하게 1열을 이룹니다. (예: `＜ 래플`, `＜ AVAX 계산기`)
- **모달형 헤더 (X 닫기)**: 페이지 타이틀 없이 우측에 `X` 버튼만 배치되는 송금/모달형 헤더 구조(`.app-header-modal`)도 지원합니다. 이때 화면 중앙의 큰 본문 텍스트(`Title 2`)가 페이지 제목 역할을 대신합니다.
- 우측 영역: 필요시 우측 기능성 버튼/아이콘 그룹(`.header-icons`)이 들어갑니다.

---

*최종 업데이트: 2026-06-04 | UPTNStation Design System*