import { get } from 'svelte/store';
import { gameState, type GameState } from './gameState';

export interface SaveData {
  gameState: GameState;
  timestamp: number;
  saveSlot: number;
}

const SAVE_KEY_PREFIX = 'visual_novel_save_';
const AUTO_SAVE_KEY = 'visual_novel_auto_save';

export function saveGame(slotNumber: number = 1): boolean {
  try {
    const currentState = get(gameState);
    const saveData: SaveData = {
      gameState: {
        ...currentState,
        playedScenes: new Set(currentState.playedScenes) // Set을 배열로 변환
      },
      timestamp: Date.now(),
      saveSlot: slotNumber
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

export function loadGame(slotNumber: number = 1): boolean {
  try {
    const saveData = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotNumber}`);
    if (!saveData) return false;
    
    const parsedData = JSON.parse(saveData);
    const restoredState: GameState = {
      ...parsedData.gameState,
      playedScenes: new Set(parsedData.gameState.playedScenes)
    };
    
    gameState.set(restoredState);
    return true;
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
      saveSlot: 'auto'
    };
    
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Auto save failed:', error);
    return false;
  }
}

export function loadAutoSave(): boolean {
  try {
    const saveData = localStorage.getItem(AUTO_SAVE_KEY);
    if (!saveData) return false;
    
    const parsedData = JSON.parse(saveData);
    const restoredState: GameState = {
      ...parsedData.gameState,
      playedScenes: new Set(parsedData.gameState.playedScenes)
    };
    
    gameState.set(restoredState);
    return true;
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
        saves.push(parsedData);
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
  return localStorage.getItem(AUTO_SAVE_KEY) !== null;
}