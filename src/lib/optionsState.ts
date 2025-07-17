import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface OptionsState {
  bgmVolume: number;        // 0-100
  sfxVolume: number;        // 0-100
  textSpeed: number;        // 1-10 (1=slowest, 10=fastest)
  isFullscreen: boolean;
}

const defaultOptions: OptionsState = {
  bgmVolume: 50,
  sfxVolume: 50,
  textSpeed: 5,
  isFullscreen: false
};

// 로컬 스토리지에서 옵션 불러오기
function loadOptionsFromStorage(): OptionsState {
  if (!browser) return defaultOptions;
  
  try {
    const stored = localStorage.getItem('game-options');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        bgmVolume: Math.max(0, Math.min(100, parsed.bgmVolume ?? defaultOptions.bgmVolume)),
        sfxVolume: Math.max(0, Math.min(100, parsed.sfxVolume ?? defaultOptions.sfxVolume)),
        textSpeed: Math.max(1, Math.min(10, parsed.textSpeed ?? defaultOptions.textSpeed)),
        isFullscreen: parsed.isFullscreen ?? defaultOptions.isFullscreen
      };
    }
  } catch (error) {
    console.error('Failed to load options from storage:', error);
  }
  
  return defaultOptions;
}

// 옵션을 로컬 스토리지에 저장
function saveOptionsToStorage(options: OptionsState): void {
  if (!browser) return;
  
  try {
    localStorage.setItem('game-options', JSON.stringify(options));
  } catch (error) {
    console.error('Failed to save options to storage:', error);
  }
}

export const optionsState = writable<OptionsState>(loadOptionsFromStorage());

// 옵션 변경 시 자동으로 저장
optionsState.subscribe(options => {
  saveOptionsToStorage(options);
});

// 옵션 업데이트 함수들
export function setBgmVolume(volume: number): void {
  optionsState.update(options => ({
    ...options,
    bgmVolume: Math.max(0, Math.min(100, volume))
  }));
}

export function setSfxVolume(volume: number): void {
  optionsState.update(options => ({
    ...options,
    sfxVolume: Math.max(0, Math.min(100, volume))
  }));
}

export function setTextSpeed(speed: number): void {
  optionsState.update(options => ({
    ...options,
    textSpeed: Math.max(1, Math.min(10, speed))
  }));
}

export function setFullscreen(isFullscreen: boolean): void {
  optionsState.update(options => ({
    ...options,
    isFullscreen
  }));
  
  // 실제 전체화면 모드 적용
  if (browser) {
    if (isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(err => {
          console.error('Failed to enter fullscreen:', err);
          // 전체화면 실패 시 옵션 롤백
          optionsState.update(options => ({
            ...options,
            isFullscreen: false
          }));
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Failed to exit fullscreen:', err);
        });
      }
    }
  }
}

// 텍스트 속도를 밀리초로 변환 (1=2000ms, 10=200ms)
export function getTextSpeedMs(speed: number): number {
  return 2200 - (speed * 200);
}

// BGM 볼륨 적용 함수
export function applyBgmVolume(audioElement: HTMLAudioElement, volume: number): void {
  audioElement.volume = volume / 100;
}

// SFX 볼륨 적용 함수
export function applySfxVolume(audioElement: HTMLAudioElement, volume: number): void {
  audioElement.volume = volume / 100;
}

// 전체화면 상태 변경 감지
if (browser) {
  document.addEventListener('fullscreenchange', () => {
    const isFullscreen = !!document.fullscreenElement;
    optionsState.update(options => ({
      ...options,
      isFullscreen
    }));
  });
}