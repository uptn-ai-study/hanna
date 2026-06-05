const path = require('path');
// 로컬 개발 환경용 환경변수 로드 (.env.local 선순위, .env 후순위)
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ 환경변수 SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.");
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

module.exports = supabase;
