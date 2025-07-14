# Visual Novel Game

SvelteKit + Capacitor 기반의 크로스플랫폼 비주얼 노벨 게임입니다.

## 🎮 게임 기능

- **씬과 대사 진행 시스템**: JSON 기반 시나리오로 게임 진행
- **선택지(분기) 시스템**: 플레이어 선택에 따른 스토리 분기
- **세이브/로드 시스템**: 게임 상태 저장 및 불러오기 (5개 슬롯)
- **자동 세이브**: 씬 이동 시 자동으로 게임 상태 저장
- **배경음악**: 씬별 BGM 지원 (현재 placeholder)
- **반응형 UI**: 모바일 친화적 인터페이스

## 🎯 조작 방법

- **마우스 클릭** 또는 **스페이스바**: 다음 대사로 진행
- **선택지 버튼**: 클릭하여 스토리 분기 선택
- **저장하기/불러오기**: 우상단 버튼으로 세이브/로드 메뉴 접근

## 🛠 개발 환경

### 필요한 도구

- Node.js 18 이상
- npm 또는 yarn

### 로컬 개발 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### Capacitor 모바일 빌드

```bash
# Capacitor 설치
npm install -g @capacitor/cli

# 플랫폼 추가
npx cap add android
npx cap add ios

# 빌드 후 네이티브 프로젝트 동기화
npm run build
npx cap sync

# 네이티브 앱 실행
npx cap run android
npx cap run ios
```

## 📁 프로젝트 구조

```
src/
├── routes/
│   └── +page.svelte        # 메인 게임 화면
├── lib/
│   ├── scenario.ts         # JSON 기반 시나리오 파일
│   ├── gameState.ts        # 게임 상태 관리
│   └── saveLoad.ts         # 세이브/로드 기능
static/
├── images/
│   ├── backgrounds/        # 배경 이미지
│   └── characters/         # 캐릭터 이미지
└── sounds/
    └── bgm/                # 배경음악
```

## 🎨 시나리오 편집

`src/lib/scenario.ts` 파일을 편집하여 게임 시나리오를 수정할 수 있습니다.

### 시나리오 구조

```typescript
export interface Scene {
  id: string;           // 씬 ID
  background: string;   // 배경 이미지 파일명
  character: string;    // 캐릭터 이미지 파일명
  dialogues: Dialogue[]; // 대사 배열
  choices?: Choice[];   // 선택지 (선택사항)
  bgm?: string;         // 배경음악 파일명 (선택사항)
}
```

## 🖼 리소스 파일

현재 모든 이미지와 음악 파일은 placeholder입니다. 실제 게임에서는 다음 파일들을 교체해야 합니다:

- `static/images/backgrounds/`: 배경 이미지 (PNG, JPG)
- `static/images/characters/`: 캐릭터 이미지 (PNG, JPG)
- `static/sounds/bgm/`: 배경음악 (MP3, OGG)

## 📱 모바일 지원

이 게임은 Capacitor를 사용하여 Android와 iOS에서 네이티브 앱으로 실행할 수 있습니다.

## 🔧 확장 가능성

- JSON 기반 시나리오 구조로 쉬운 콘텐츠 추가
- 모듈식 설계로 기능 확장 용이
- 반응형 디자인으로 다양한 디바이스 지원

## 📄 라이선스

MIT License