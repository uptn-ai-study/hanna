---
name: gui-style
description: UPTNStation 모바일 앱 기반 GUI 스타일 및 톤앤매너 가이드라인 (Layout, Text, Color, Table, Footer)
---

# 🎨 UPTNStation GUI Guide

이 문서는 UPTNStation 모바일 웹/앱에 공통 적용되는 톤앤매너(Tone & Manner) 및 GUI 가이드라인을 정의합니다. 일관되고 프리미엄한 브랜드 정체성을 유지하기 위해 작성되었습니다.

---

## 📱 1. Layout & Viewport (레이아웃 및 프레임)

모바일 중심의 정돈된 레이아웃 환경을 구성하기 위해 모바일 전용 컨테이너 프레임을 사용합니다.

* **외부 배경**: 연한 블루그레이 / 회색톤 (`#F5F6F8`)을 사용하여 앱 밖의 여백을 처리합니다.
* **모바일 컨테이너**: 가로 폭을 **최대 420px**로 고정한 뒤 화면 중앙에 정렬시킵니다.
* **내부 배경**: 컨테이너 내부는 순백색 (`#FFFFFF`)을 기본으로 하며, 모서리는 `12px ~ 16px` 정도로 둥글게(Border-radius) 처리하여 세련된 카드의 느낌을 줍니다.

---

## 🔤 2. Text Style (타이포그래피 사양)

모든 텍스트는 **SUIT** 폰트를 기본으로 사용하며, 아래 지정된 두께(Weight), 크기(Size), 자간(Spacing), 행간(Line-height) 스펙을 준수합니다.

| 스타일 이름 | 스타일 용도 | Font | Weight | Size (px) | Spacing (em) | Line-height (px) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Title 1** | 대형 포인트, 특별 강조 | SUIT | 700 (Bold) | 22 | 0.0 | 32 |
| **Title 2** | 일반 타이틀, 중요 단위 | SUIT | 700 (Bold) | 18 | -0.3 | 28 |
| **Title 3** | 서브 타이틀, 영역 헤더 | SUIT | 700 (Bold) | 16 | -0.3 | 24 |
| **Title 4 (Body)** | 기본 본문 텍스트 | SUIT | 400 (Regular) | 14 | 0.0 | 24 |
| **Sub 1 (Sub)** | 메타 정보, 입력창 라벨 | SUIT | 500 (Medium) | 13 | -0.3 | 20 |
| **Sub 2** | 부가 정보, 얇은 메타정보 | SUIT | 400 (Regular) | 12 | -0.3 | 18 |

---

## 🎨 3. Color Palette (브랜드 컬러 시스템)

서비스의 정체성과 가독성을 위해 규정된 브랜드 컬러 4종을 사용합니다.

* **본문 주 컬러 (Main Text)**: `#222222` (가독성을 극대화한 맑은 블랙)
* **브랜드 포인트 컬러 (Accent)**: `#5F61FF` (UPTNStation 핵심 액센트 바이올렛 블루. 버튼 배경, 포인트 뱃지 등에 적극 사용)
* **보조/유의사항 텍스트 (Muted)**: `#666666` (설명글 및 정보 텍스트에 적용)
* **경고/핵심 알림 컬러 (Alert)**: `#FF2034` (에러 피드백, 주요 혜택 강조 시 사용)

---

## 🏷️ 4. Badge & Buttons (뱃지 및 버튼)

* **캡슐형 뱃지 (Badge Capsule)**: 중요 정보 강조용 뱃지는 모서리를 완전히 둥글게 깎고 (`border-radius: 999px`), 배경색으로 `#5F61FF`를 지정하여 텍스트 가시성을 극대화합니다.
* **스핀/응모 버튼 (Action Button)**: 
  * 둥글고 직관적인 모서리 (`border-radius: 12px`)를 가진 큰 크기의 버튼을 배치합니다.
  * 배경은 포인트 컬러인 `#5F61FF` 단색을 채우고 글씨는 흰색(SUIT 700)으로 처리합니다.

---

## 📊 5. Table (미니멀 리스트형 테이블)

기존의 박스형 표 형태에서 탈피하여 래플 리스트 감성의 얇고 슬림한 경계선의 테이블을 생성합니다.

* **테이블 헤더 배경**: `#F8F9FA`
* **외곽 테두리 및 가로선**: 최소한의 구분용도로만 얇게 기입 (`#EBEBEB` 및 `#F5F6F8` 사용)
* **헤더 텍스트**: `#666666` (SUIT 700 / 12px)
* **본문 텍스트**: `#222222` (SUIT 600) / 날짜는 `#666666` (SUIT 400)

---

## 📝 6. Notice Footer (유의사항 푸터)

페이지 하단에 위치하여 중요 부가 설명을 제공하는 푸터 사양입니다.

* **배경색**: 가로 너비에 꽉 차는 연한 회색 (`#F4F5F7`)을 사용하며, 상단에 `1px solid #EBEBEB` 라인을 두어 경계를 명확히 분리합니다.
* **타이틀**: `유의사항` (SUIT 700 / 14px / `#333333`)
* **목록 스타일**: 블릿 기호(점, 숫자)를 배제하고 자연스러운 문장 줄바꿈(`margin-bottom: 8px`)으로 가독성을 높입니다.
* **텍스트**: SUIT 400 / 12px / `#666666` / 행간 20px 적용.

---

## 💻 코드 구현 예시 (CSS)

### Vanilla CSS
```css
/* Layout Frame */
.phone-container {
  max-width: 420px;
  width: 100%;
  background: #FFFFFF;
  min-height: 100vh;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  border-left: 1px solid #EBEBEB;
  border-right: 1px solid #EBEBEB;
}

/* Typography Styles */
.editor-title-1 { font-family: 'SUIT', sans-serif; font-weight: 700; font-size: 22px; line-height: 32px; letter-spacing: 0; }
.editor-title-2 { font-family: 'SUIT', sans-serif; font-weight: 700; font-size: 18px; line-height: 28px; letter-spacing: -0.3px; }
.editor-title-3 { font-family: 'SUIT', sans-serif; font-weight: 700; font-size: 16px; line-height: 24px; letter-spacing: -0.3px; }
.editor-title-4 { font-family: 'SUIT', sans-serif; font-weight: 400; font-size: 14px; line-height: 24px; letter-spacing: 0; color: #222222; }
.editor-sub-1   { font-family: 'SUIT', sans-serif; font-weight: 500; font-size: 13px; line-height: 20px; letter-spacing: -0.3px; color: #666666; }
.editor-sub-2   { font-family: 'SUIT', sans-serif; font-weight: 400; font-size: 12px; line-height: 18px; letter-spacing: -0.3px; color: #666666; }

/* Colors */
.color-primary { color: #222222; }
.color-accent  { color: #5F61FF; }
.color-muted   { color: #666666; }
.color-alert   { color: #FF2034; }

/* Buttons & Badges */
.badge-capsule {
  background: #5F61FF;
  color: #FFFFFF;
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 12px;
}
.btn-action {
  width: 100%;
  background: #5F61FF;
  color: #FFFFFF;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  font-weight: 700;
}

/* Notice Footer */
.notice-footer {
  background: #F4F5F7;
  padding: 24px 20px 48px;
  border-top: 1px solid #EBEBEB;
}
.notice-footer p {
  font-size: 12px;
  color: #666666;
  line-height: 20px;
  margin-bottom: 8px;
}
```
