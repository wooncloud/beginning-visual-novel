import { writable } from 'svelte/store';
import { scenario, type Scene } from './scenario';

export interface GameState {
  currentSceneId: string;
  currentDialogueIndex: number;
  isShowingChoices: boolean;
  autoSave: boolean;
  playedScenes: Set<string>;
}

export const gameState = writable<GameState>({
  currentSceneId: "scene1",
  currentDialogueIndex: 0,
  isShowingChoices: false,
  autoSave: true,
  playedScenes: new Set<string>()
});

export const currentScene = writable<Scene | null>(null);

export function getCurrentScene(): Scene | null {
  return scenario.find(scene => {
    let state: GameState;
    gameState.subscribe(value => state = value)();
    return scene.id === state.currentSceneId;
  }) || null;
}

export function moveToScene(sceneId: string): void {
  gameState.update(state => {
    state.currentSceneId = sceneId;
    state.currentDialogueIndex = 0;
    state.isShowingChoices = false;
    state.playedScenes.add(sceneId);
    return state;
  });
  
  const scene = scenario.find(s => s.id === sceneId);
  if (scene) {
    currentScene.set(scene);
  }
}

export function nextDialogue(): void {
  gameState.update(state => {
    const scene = getCurrentScene();
    if (!scene) return state;
    
    if (state.currentDialogueIndex < scene.dialogues.length - 1) {
      state.currentDialogueIndex++;
    } else {
      // 대사가 끝나면 선택지 표시
      if (scene.choices && scene.choices.length > 0) {
        state.isShowingChoices = true;
      }
    }
    
    return state;
  });
}

export function selectChoice(choiceIndex: number): void {
  const scene = getCurrentScene();
  if (!scene || !scene.choices || choiceIndex >= scene.choices.length) return;
  
  const choice = scene.choices[choiceIndex];
  moveToScene(choice.nextScene);
  
  // 자동 세이브
  gameState.subscribe(state => {
    if (state.autoSave) {
      import('./saveLoad').then(({ autoSave }) => autoSave());
    }
  })();
}

export function resetGame(): void {
  gameState.set({
    currentSceneId: "scene1",
    currentDialogueIndex: 0,
    isShowingChoices: false,
    autoSave: true,
    playedScenes: new Set<string>()
  });
  
  const scene = scenario.find(s => s.id === "scene1");
  if (scene) {
    currentScene.set(scene);
  }
}

// 초기 씬 설정
moveToScene("scene1");