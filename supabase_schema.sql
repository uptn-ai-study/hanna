-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  points INTEGER NOT NULL DEFAULT 10000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  color TEXT NOT NULL,
  probability DOUBLE PRECISION NOT NULL,
  weekly_limit INTEGER NOT NULL DEFAULT 9999,
  points_value INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS win_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id INTEGER NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  won_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 초기 경품 데이터 등록 (rewards 테이블이 비어있을 때 실행 권장)
-- 중복 실행 방지를 위해 TRUNCATE 후 INSERT 하거나, 아래 쿼리를 한 번만 실행하세요.
INSERT INTO rewards (name, label, color, probability, weekly_limit, points_value) VALUES
('꽝', '꽝', '#374151', 0.55, 9999, 0),
('추파춥스', '추파춥스', '#6366f1', 0.20, 9999, 0),
('마이쭈', '마이쭈', '#8b5cf6', 0.19, 9999, 0),
('배스킨라빈스 싱글레귤러', '베라', '#f59e0b', 0.04, 5, 0),
('스타벅스 1잔', '스벅', '#10b981', 0.015, 2, 0),
('치킨 기프티콘', '치킨', '#5F61FF', 0.005, 1, 0);
