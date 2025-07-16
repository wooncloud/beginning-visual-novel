import { writable } from 'svelte/store';
import { loadScene, getNextSceneId, checkSceneExists, type Scene, type Situation, type Dialogue } from './scenario';

export type GameMode = 'main' | 'game';

export interface GameState {
  gameMode: GameMode;
  sceneId: string;
  situationIndex: number;
  dialogueIndex: number;
  isShowingChoices: boolean;
  autoSave: boolean;
  playedScenes: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export const gameState = writable<GameState>({
  gameMode: 'main',
  sceneId: "scene1",
  situationIndex: 0,
  dialogueIndex: 0,
  isShowingChoices: false,
  autoSave: true,
  playedScenes: new Set<string>(),
  isLoading: false,
  error: null
});

export const currentScene = writable<Scene | null>(null);
export const currentSituation = writable<Situation | null>(null);

// 현재 씬 데이터 관리
let currentSceneData: Scene | null = null;

export function getCurrentScene(): Scene | null {
  return currentSceneData;
}

export function getCurrentSituation(): Situation | null {
  if (!currentSceneData) return null;
  
  let state: GameState;
  gameState.subscribe(value => state = value)();
  
  return currentSceneData.situations[state.situationIndex] || null;
}

export function getCurrentDialogue(): Dialogue | null {
  const situation = getCurrentSituation();
  if (!situation) return null;
  
  return situation.dialogue;
}

export async function moveToScene(sceneId: string, situationIndex: number = 0): Promise<boolean> {
  gameState.update(state => {
    state.isLoading = true;
    state.error = null;
    return state;
  });
  
  try {
    const scene = await loadScene(sceneId);
    if (!scene) {
      gameState.update(state => {
        state.isLoading = false;
        state.error = `씬 '${sceneId}'를 불러올 수 없습니다.`;
        return state;
      });
      return false;
    }
    
    currentSceneData = scene;
    
    gameState.update(state => {
      state.sceneId = sceneId;
      state.situationIndex = situationIndex;
      state.dialogueIndex = 0;
      state.isShowingChoices = false;
      state.playedScenes.add(sceneId);
      state.isLoading = false;
      state.error = null;
      return state;
    });
    
    currentScene.set(scene);
    const situation = scene.situations[situationIndex];
    if (situation) {
      currentSituation.set(situation);
      // 선택지가 있는 경우 바로 표시
      if (situation.dialogue.choices && situation.dialogue.choices.length > 0) {
        gameState.update(state => {
          state.isShowingChoices = true;
          return state;
        });
      }
    }
    
    return true;
  } catch (error) {
    gameState.update(state => {
      state.isLoading = false;
      state.error = `씬 로딩 중 오류 발생: ${error}`;
      return state;
    });
    return false;
  }
}

export function moveToSituation(situationIndex: number): void {
  if (!currentSceneData) return;
  
  gameState.update(state => {
    state.situationIndex = situationIndex;
    state.dialogueIndex = 0;
    state.isShowingChoices = false;
    return state;
  });
  
  const situation = currentSceneData.situations[situationIndex];
  if (situation) {
    currentSituation.set(situation);
    // 선택지가 있는 경우 바로 표시
    if (situation.dialogue.choices && situation.dialogue.choices.length > 0) {
      gameState.update(state => {
        state.isShowingChoices = true;
        return state;
      });
    }
  }
}

export async function nextSituation(): Promise<boolean> {
  if (!currentSceneData) return false;
  
  let state: GameState;
  gameState.subscribe(value => state = value)();
  
  if (state.situationIndex < currentSceneData.situations.length - 1) {
    moveToSituation(state.situationIndex + 1);
    return true;
  } else {
    // 현재 씬의 마지막 상황이면 다음 씬으로 이동
    const nextSceneId = getNextSceneId(state.sceneId);
    return await moveToScene(nextSceneId);
  }
}

export async function nextDialogue(): Promise<void> {
  const situation = getCurrentSituation();
  if (!situation) return;
  
  gameState.update(state => {
    // 선택지가 있는 경우 바로 표시
    if (situation.dialogue.choices && situation.dialogue.choices.length > 0) {
      state.isShowingChoices = true;
    }
    return state;
  });
  
  // 선택지가 없는 경우 자동으로 다음 상황으로 이동
  if (!situation.dialogue.choices || situation.dialogue.choices.length === 0) {
    const success = await nextSituation();
    if (!success) {
      console.log("게임 종료: 더 이상 진행할 씬이 없습니다.");
    }
  }
}

export async function selectChoice(choiceIndex: number): Promise<void> {
  const situation = getCurrentSituation();
  if (!situation || !situation.dialogue.choices || choiceIndex >= situation.dialogue.choices.length) {
    return;
  }
  
  const choice = situation.dialogue.choices[choiceIndex];
  const event = choice.event;
  
  if (event === "next_situation") {
    await nextSituation();
  } else if (event.startsWith("next_scene_")) {
    const targetSceneId = event.replace("next_scene_", "");
    await moveToScene(targetSceneId);
  }
  
  // 자동 세이브
  gameState.subscribe(state => {
    if (state.autoSave) {
      import('./saveLoad').then(({ autoSave }) => autoSave());
    }
  })();
}

export async function resetGame(): Promise<void> {
  gameState.set({
    sceneId: "scene1",
    situationIndex: 0,
    dialogueIndex: 0,
    isShowingChoices: false,
    autoSave: true,
    playedScenes: new Set<string>(),
    isLoading: false,
    error: null
  });
  
  await moveToScene("scene1");
}

export function showMainMenu(): void {
  gameState.update(state => {
    state.gameMode = 'main';
    return state;
  });
}

export function startGame(): void {
  gameState.update(state => {
    state.gameMode = 'game';
    return state;
  });
}

// 초기 씬 설정은 컴포넌트에서 수행