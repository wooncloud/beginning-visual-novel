import { writable } from 'svelte/store';
import { scenario, type Scene, type Situation, type Dialogue } from './scenario';

export interface GameState {
  sceneId: string;
  situationIndex: number;
  dialogueIndex: number;
  isShowingChoices: boolean;
  autoSave: boolean;
  playedScenes: Set<string>;
}

export const gameState = writable<GameState>({
  sceneId: "scene1",
  situationIndex: 0,
  dialogueIndex: 0,
  isShowingChoices: false,
  autoSave: true,
  playedScenes: new Set<string>()
});

export const currentScene = writable<Scene | null>(null);
export const currentSituation = writable<Situation | null>(null);

export function getCurrentScene(): Scene | null {
  let state: GameState;
  gameState.subscribe(value => state = value)();
  return scenario.find(scene => scene.id === state.sceneId) || null;
}

export function getCurrentSituation(): Situation | null {
  const scene = getCurrentScene();
  if (!scene) return null;
  
  let state: GameState;
  gameState.subscribe(value => state = value)();
  
  return scene.situations[state.situationIndex] || null;
}

export function getCurrentDialogue(): Dialogue | null {
  const situation = getCurrentSituation();
  if (!situation) return null;
  
  return situation.dialogue;
}

export function moveToScene(sceneId: string, situationIndex: number = 0): void {
  gameState.update(state => {
    state.sceneId = sceneId;
    state.situationIndex = situationIndex;
    state.dialogueIndex = 0;
    state.isShowingChoices = false;
    state.playedScenes.add(sceneId);
    return state;
  });
  
  const scene = scenario.find(s => s.id === sceneId);
  if (scene) {
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
  }
}

export function moveToSituation(situationIndex: number): void {
  gameState.update(state => {
    state.situationIndex = situationIndex;
    state.dialogueIndex = 0;
    state.isShowingChoices = false;
    return state;
  });
  
  const situation = getCurrentSituation();
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

export function nextSituation(): void {
  const scene = getCurrentScene();
  if (!scene) return;
  
  gameState.update(state => {
    if (state.situationIndex < scene.situations.length - 1) {
      state.situationIndex++;
      state.dialogueIndex = 0;
      state.isShowingChoices = false;
    }
    return state;
  });
  
  const situation = getCurrentSituation();
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

export function nextDialogue(): void {
  const situation = getCurrentSituation();
  if (!situation) return;
  
  gameState.update(state => {
    // 선택지가 있는 경우 바로 표시
    if (situation.dialogue.choices && situation.dialogue.choices.length > 0) {
      state.isShowingChoices = true;
    } else {
      // 선택지가 없는 경우 자동으로 다음 상황으로 이동
      const scene = getCurrentScene();
      if (scene && state.situationIndex < scene.situations.length - 1) {
        state.situationIndex++;
        state.dialogueIndex = 0;
        state.isShowingChoices = false;
      }
    }
    return state;
  });
  
  // 상황이 변경된 경우 다시 설정
  const newSituation = getCurrentSituation();
  if (newSituation) {
    currentSituation.set(newSituation);
    // 새로운 상황에 선택지가 있는 경우 바로 표시
    if (newSituation.dialogue.choices && newSituation.dialogue.choices.length > 0) {
      gameState.update(state => {
        state.isShowingChoices = true;
        return state;
      });
    }
  }
}

export function selectChoice(choiceIndex: number): void {
  const situation = getCurrentSituation();
  if (!situation || !situation.dialogue.choices || choiceIndex >= situation.dialogue.choices.length) {
    return;
  }
  
  const choice = situation.dialogue.choices[choiceIndex];
  const event = choice.event;
  
  if (event === "next_situation") {
    nextSituation();
  } else if (event.startsWith("next_scene_")) {
    const targetSceneId = event.replace("next_scene_", "");
    moveToScene(targetSceneId);
  }
  
  // 자동 세이브
  gameState.subscribe(state => {
    if (state.autoSave) {
      import('./saveLoad').then(({ autoSave }) => autoSave());
    }
  })();
}

export function resetGame(): void {
  gameState.set({
    sceneId: "scene1",
    situationIndex: 0,
    dialogueIndex: 0,
    isShowingChoices: false,
    autoSave: true,
    playedScenes: new Set<string>()
  });
  
  moveToScene("scene1");
}

// 초기 씬 설정
moveToScene("scene1");