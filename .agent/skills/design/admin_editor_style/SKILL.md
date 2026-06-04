---
name: gui-style
description: UPTNStation GUI 스타일 가이드라인 (Text, Color, Bullet, Table)
---

# 🎨 GUI Guide

이 문서는 UPTNStation에 적용되는 GUI 스타일을 정의합니다. App과 어드민 에디터 간의 일관된 디자인 정체성을 보장하기 위해 작성되었습니다.

## 🔤 Text Style (텍스트 스타일)

텍스트 스타일을 작성할 때는 아래의 폰트 종류(Font), 두께(Weight), 크기(Size), 자간(Spacing), 행간(Line-height) 규칙을 엄격히 준수합니다.

| 스타일 이름 | 스타일 용도 | Font | Weight | Size (px) | Spacing (em/px) | Line-height (px) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Title 1** | 특별 강조 타이틀 | SUIT | 700 (Bold) | 22 | 0.0 | 32 |
| **Title 2** | 강조 타이틀 | SUIT | 700 (Bold) | 18 | -0.3 | 28 |
| **Title 3** | 일반 타이틀 | SUIT | 700 (Bold) | 16 | -0.3 | 24 |
| **Title 4 (Body)** | 본문 텍스트 | SUIT | 400 (Regular) | 14 | 0.0 | 24 |
| **Sub 1 (Sub)** | 서브 텍스트 | SUIT | 500 (Medium) | 13 | -0.3 | 20 |
| **Sub 2** | 작은 서브 텍스트 | SUIT | 400 (Regular) | 12 | -0.3 | 18 |

---

## 🎨 Color Palette (컬러 팔레트)

게시글 및 에디터 본문 작성 시 사용하는 기본 컬러 4종입니다.

| 컬러 구분 | 대표 색상 코드 | 설명 |
| :--- | :--- | :--- |
| **본문 컬러** | `#444444` | 기본 본문 텍스트에 적용 |
| **일반 강조 컬러** | `#5F61FF` | 하이라이트나 링크 등 일반적인 강조에 사용 |
| **꼭 봐야하는 강조 컬러** | `#FF2034` | 경고, 중요 알림 등 강력한 강조에 사용 |
| **비 강조 본문 컬러** | `#666666` | 부가 설명, 덜 중요한 정보 텍스트에 적용 |

---

## 📍 Bullet (블릿 리스트)

리스트 항목을 렌더링할 때 들여쓰기 및 디자인 사양입니다.

*   **숫자 블릿 (Numbered List)**: 일반 본문 영역 대비 왼쪽으로 **16px** 들여쓰기(`margin-left: 16px` 또는 `padding-left: 16px`)를 적용합니다.
*   **Dot 블릿 (Bullet List)**: 
    *   일반 본문 영역 대비 왼쪽으로 **16px** 들여쓰기를 적용합니다.
    *   Dot(점)의 원형 크기는 **8px * 8px**의 사이즈 가이드를 준수합니다.

---

## 📊 Table (테이블 스타일)

데이터를 직관적이고 가독성 높게 표현하기 위해 테이블 생성 시 아래의 가이드라인을 준수합니다.

| 구분 | 적용 색상 코드 | 용도 |
| :--- | :--- | :--- |
| **테이블 외곽 라인** | `#DDDDDD` | 테이블의 바깥쪽 border 선 |
| **테이블 내부 라인** | `#EBEBEB` | 행(Row)과 열(Column) 사이의 내부 구분선 |
| **테이블 내부 텍스트 1** | `#333333` | 주요 텍스트 및 헤더 영역 텍스트 |
| **테이블 내부 텍스트 2** | `#666666` | 보조 텍스트 및 상세 데이터 텍스트 |
| **테이블 내부 BG** | `#F8F8F8` | 헤더 영역 및 배경 채우기에 사용되는 색상 |

---

## 💻 코드 구현 예시 (CSS/Tailwind)

### Vanilla CSS
```css
/* Text Styles */
.editor-title-1 { font-family: 'SUIT', sans-serif; font-weight: 700; font-size: 22px; letter-spacing: 0; line-height: 32px; }
.editor-title-2 { font-family: 'SUIT', sans-serif; font-weight: 700; font-size: 18px; letter-spacing: -0.3px; line-height: 28px; }
.editor-title-3 { font-family: 'SUIT', sans-serif; font-weight: 700; font-size: 16px; letter-spacing: -0.3px; line-height: 24px; }
.editor-title-4 { font-family: 'SUIT', sans-serif; font-weight: 400; font-size: 14px; letter-spacing: 0; line-height: 24px; color: #444444; }
.editor-sub-1 { font-family: 'SUIT', sans-serif; font-weight: 500; font-size: 13px; letter-spacing: -0.3px; line-height: 20px; color: #666666; }
.editor-sub-2 { font-family: 'SUIT', sans-serif; font-weight: 400; font-size: 12px; letter-spacing: -0.3px; line-height: 18px; color: #666666; }

/* Colors */
.color-text-main { color: #444444; }
.color-text-highlight { color: #5F61FF; }
.color-text-alert { color: #FF2034; }
.color-text-muted { color: #666666; }

/* Bullets */
.editor-bullet-num, .editor-bullet-dot {
  padding-left: 16px;
}
.editor-bullet-dot::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #444444;
  margin-right: 8px;
}

/* Table */
.editor-table {
  border: 1px solid #DDDDDD;
  border-collapse: collapse;
}
.editor-table th, .editor-table td {
  border: 1px solid #EBEBEB;
  padding: 8px 12px;
}
.editor-table th {
  background-color: #F8F8F8;
  color: #333333;
}
.editor-table td {
  color: #666666;
}
```
