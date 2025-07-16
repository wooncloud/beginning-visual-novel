type CharacterPosition = 'left' | 'center' | 'right';

interface CharacterVisual {
  id: string;
  name: string;
  image: string;
  position: CharacterPosition;
}

interface DialogueChoice {
  text: string;
  event: string; // 이벤트명 (e.g. next_situation, next_scene)
}

interface Dialogue {
  characterId: string;
  characterName: string;
  text: string;
  choices?: DialogueChoice[];
}

interface Situation {
  id: string;
  backgroundImage: string;
  bgm: string;
  characters: CharacterVisual[];
  dialogue: Dialogue;
}

interface Scene {
  id: string;
  situations: Situation[];
}

// 씬 로드 함수
export async function loadScene(sceneId: string): Promise<Scene | null> {
  try {
    const sceneNumber = sceneId.replace('scene', '').padStart(3, '0');
    const response = await fetch(`/scenes/scene-${sceneNumber}.json`);
    
    if (!response.ok) {
      console.error(`Failed to load scene ${sceneId}: ${response.status}`);
      return null;
    }
    
    const scene: Scene = await response.json();
    return scene;
  } catch (error) {
    console.error(`Error loading scene ${sceneId}:`, error);
    return null;
  }
}

// 다음 씬 ID 생성 함수
export function getNextSceneId(currentSceneId: string): string {
  const currentNumber = parseInt(currentSceneId.replace('scene', ''));
  return `scene${currentNumber + 1}`;
}

// 씬 존재 확인 함수
export async function checkSceneExists(sceneId: string): Promise<boolean> {
  try {
    const sceneNumber = sceneId.replace('scene', '').padStart(3, '0');
    const response = await fetch(`/scenes/scene-${sceneNumber}.json`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export type { CharacterPosition, CharacterVisual, DialogueChoice, Dialogue, Situation, Scene };