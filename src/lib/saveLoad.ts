import { get } from 'svelte/store';
import { gameState, type GameState, moveToScene } from './gameState';

export interface SaveData {
  gameState: GameState;
  timestamp: number;
  saveSlot: number;
  version: string; // 버전 정보 추가
}

const SAVE_KEY_PREFIX = 'visual_novel_save_';
const AUTO_SAVE_KEY = 'visual_novel_auto_save';
const CURRENT_VERSION = '3.0'; // 새로운 JSON 구조 버전

export function saveGame(slotNumber: number = 1): boolean {
  try {
    const currentState = get(gameState);
    const saveData: SaveData = {
      gameState: {
        ...currentState,
        playedScenes: new Set(currentState.playedScenes) // Set을 배열로 변환
      },
      timestamp: Date.now(),
      saveSlot: slotNumber,
      version: CURRENT_VERSION
    };
    
    const serializedData = JSON.stringify({
      ...saveData,
      gameState: {
        ...saveData.gameState,
        playedScenes: Array.from(saveData.gameState.playedScenes)
      }
    });
    
    localStorage.setItem(`${SAVE_KEY_PREFIX}${slotNumber}`, serializedData);
    return true;
  } catch (error) {
    console.error('Save failed:', error);
    return false;
  }
}

export async function loadGame(slotNumber: number = 1): Promise<boolean> {
  try {
    const saveData = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotNumber}`);
    if (!saveData) return false;
    
    const parsedData = JSON.parse(saveData);
    
    // 구버전 데이터인 경우 무시
    if (!parsedData.version || parsedData.version !== CURRENT_VERSION) {
      console.warn('Incompatible save data version, ignoring old save');
      return false;
    }
    
    const restoredState: GameState = {
      ...parsedData.gameState,
      playedScenes: new Set(parsedData.gameState.playedScenes)
    };
    
    gameState.set(restoredState);
    
    // 씬을 비동기로 로드
    const success = await moveToScene(restoredState.sceneId, restoredState.situationIndex);
    return success;
  } catch (error) {
    console.error('Load failed:', error);
    return false;
  }
}

export function autoSave(): boolean {
  try {
    const currentState = get(gameState);
    const saveData = {
      gameState: {
        ...currentState,
        playedScenes: Array.from(currentState.playedScenes)
      },
      timestamp: Date.now(),
      saveSlot: 'auto',
      version: CURRENT_VERSION
    };
    
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Auto save failed:', error);
    return false;
  }
}

export async function loadAutoSave(): Promise<boolean> {
  try {
    const saveData = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saveData) return false;
    
    const parsedData = JSON.parse(saveData);
    
    // 구버전 데이터인 경우 무시
    if (!parsedData.version || parsedData.version !== CURRENT_VERSION) {
      console.warn('Incompatible auto save data version, ignoring old save');
      return false;
    }
    
    const restoredState: GameState = {
      ...parsedData.gameState,
      playedScenes: new Set(parsedData.gameState.playedScenes)
    };
    
    gameState.set(restoredState);
    
    // 씬을 비동기로 로드
    const success = await moveToScene(restoredState.sceneId, restoredState.situationIndex);
    return success;
  } catch (error) {
    console.error('Auto load failed:', error);
    return false;
  }
}

export function getSaveSlots(): SaveData[] {
  const saves: SaveData[] = [];
  
  for (let i = 1; i <= 10; i++) {
    const saveData = localStorage.getItem(`${SAVE_KEY_PREFIX}${i}`);
    if (saveData) {
      try {
        const parsedData = JSON.parse(saveData);
        
        // 구버전 데이터는 제외
        if (parsedData.version && parsedData.version === CURRENT_VERSION) {
          saves.push(parsedData);
        }
      } catch (error) {
        console.error(`Error parsing save slot ${i}:`, error);
      }
    }
  }
  
  return saves.sort((a, b) => b.timestamp - a.timestamp);
}

export function deleteSave(slotNumber: number): boolean {
  try {
    localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotNumber}`);
    return true;
  } catch (error) {
    console.error('Delete save failed:', error);
    return false;
  }
}

export function hasAutoSave(): boolean {
  try {
    const saveData = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saveData) return false;
    
    const parsedData = JSON.parse(saveData);
    // 구버전 데이터인 경우 false 반환
    return parsedData.version && parsedData.version === CURRENT_VERSION;
  } catch (error) {
    console.error('Check auto save failed:', error);
    return false;
  }
}