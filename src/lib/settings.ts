import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface GameSettings {
  typingSpeed: number; // 글자당 지연 시간 (ms)
  autoAdvance: boolean; // 자동 진행 여부
  autoAdvanceDelay: number; // 자동 진행 지연 시간 (ms)
  sfxVolume: number; // 효과음 볼륨 (0-1)
  bgmVolume: number; // 배경음 볼륨 (0-1)
  enableTypingEffect: boolean; // 타이핑 효과 활성화 여부
}

const defaultSettings: GameSettings = {
  typingSpeed: 50,
  autoAdvance: false,
  autoAdvanceDelay: 3000,
  sfxVolume: 0.7,
  bgmVolume: 0.5,
  enableTypingEffect: true
};

function createSettingsStore() {
  const { subscribe, set, update } = writable<GameSettings>(defaultSettings);

  return {
    subscribe,
    set,
    update,
    
    // 설정 로드
    load: () => {
      if (browser) {
        const saved = localStorage.getItem('game-settings');
        if (saved) {
          try {
            const parsedSettings = JSON.parse(saved);
            set({ ...defaultSettings, ...parsedSettings });
          } catch (error) {
            console.error('설정 로드 실패:', error);
            set(defaultSettings);
          }
        }
      }
    },
    
    // 설정 저장
    save: (settings: GameSettings) => {
      if (browser) {
        localStorage.setItem('game-settings', JSON.stringify(settings));
      }
      set(settings);
    },
    
    // 개별 설정 업데이트
    updateSetting: <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
      update(settings => {
        const newSettings = { ...settings, [key]: value };
        if (browser) {
          localStorage.setItem('game-settings', JSON.stringify(newSettings));
        }
        return newSettings;
      });
    },
    
    // 설정 초기화
    reset: () => {
      if (browser) {
        localStorage.removeItem('game-settings');
      }
      set(defaultSettings);
    }
  };
}

export const gameSettings = createSettingsStore();