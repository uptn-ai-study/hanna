import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'hamster22',
  web: {
    host: 'localhost', // 실기기 테스트 시 본인의 로컬 IP 주소로 변경해 주세요
    port: 5173,        // Vite 기본 개발 서버 포트
    commands: {
      dev: 'vite',
      build: 'vue-tsc -b && vite build',
    },
  },
  appType: 'game', // 게임 카테고리로 지정
  brand: {
    displayName: '햄스터 찾기',
    primaryColor: '#ff9f43', // 야바위 오렌지 테마 컬러
    icon: 'https://img.toss.im/placeholder/600x600.png', // 콘솔에 업로드 완료된 아이콘 URL로 변경해 주세요
  },
  permissions: [], // 필요한 앱 권한(clipboard, geolocation 등)이 있을 경우 기재
  navigationBar: {
    theme: 'light',
    withBackButton: true,
  },
});
