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

export const scenario: Scene[] = [
  {
    id: "scene1",
    situations: [
      {
        id: "situation1",
        backgroundImage: "bg_placeholder.png",
        bgm: "bgm_placeholder.mp3",
        characters: [
          {
            id: "charA",
            name: "캐릭터A",
            image: "char_a.png",
            position: "left"
          },
          {
            id: "charB",
            name: "캐릭터B",
            image: "char_b.png",
            position: "right"
          }
        ],
        dialogue: {
          characterId: "charA",
          characterName: "캐릭터A",
          text: "환영합니다! 비주얼 노벨의 시작입니다.",
          choices: [
            { text: "인사를 받는다", event: "next_situation" },
            { text: "무시하고 지나간다", event: "next_scene_scene3" }
          ]
        }
      },
      {
        id: "situation2",
        backgroundImage: "bg_placeholder.png",
        bgm: "bgm_placeholder.mp3",
        characters: [
          {
            id: "charB",
            name: "캐릭터B",
            image: "char_b.png",
            position: "center"
          }
        ],
        dialogue: {
          characterId: "charB",
          characterName: "캐릭터B",
          text: "좋은 선택입니다. 이제 길을 선택해야 합니다.",
          choices: [
            { text: "왼쪽 길로 간다", event: "next_scene_scene2" },
            { text: "오른쪽 길로 간다", event: "next_scene_scene3" }
          ]
        }
      }
    ]
  },
  {
    id: "scene2",
    situations: [
      {
        id: "situation1",
        backgroundImage: "bg_forest.png",
        bgm: "bgm_forest.mp3",
        characters: [
          {
            id: "charA",
            name: "캐릭터A",
            image: "char_a.png",
            position: "left"
          }
        ],
        dialogue: {
          characterId: "charA",
          characterName: "캐릭터A",
          text: "왼쪽 길로 오셨군요. 이곳은 숲 속입니다."
        }
      },
      {
        id: "situation2",
        backgroundImage: "bg_forest.png",
        bgm: "bgm_forest.mp3",
        characters: [
          {
            id: "charA",
            name: "캐릭터A",
            image: "char_a.png",
            position: "center"
          }
        ],
        dialogue: {
          characterId: "charA",
          characterName: "캐릭터A",
          text: "여기서 새로운 모험이 시작됩니다.",
          choices: [
            { text: "계속 진행한다", event: "next_scene_scene4" },
            { text: "뒤로 돌아간다", event: "next_scene_scene1" }
          ]
        }
      }
    ]
  },
  {
    id: "scene3",
    situations: [
      {
        id: "situation1",
        backgroundImage: "bg_mountain.png",
        bgm: "bgm_mountain.mp3",
        characters: [
          {
            id: "charB",
            name: "캐릭터B",
            image: "char_b.png",
            position: "right"
          }
        ],
        dialogue: {
          characterId: "charB",
          characterName: "캐릭터B",
          text: "오른쪽 길입니다. 여기는 산길이군요."
        }
      },
      {
        id: "situation2",
        backgroundImage: "bg_mountain.png",
        bgm: "bgm_mountain.mp3",
        characters: [
          {
            id: "charB",
            name: "캐릭터B",
            image: "char_b.png",
            position: "center"
          }
        ],
        dialogue: {
          characterId: "charB",
          characterName: "캐릭터B",
          text: "다른 길로 가보겠습니다.",
          choices: [
            { text: "계속 진행한다", event: "next_scene_scene4" },
            { text: "뒤로 돌아간다", event: "next_scene_scene1" }
          ]
        }
      }
    ]
  },
  {
    id: "scene4",
    situations: [
      {
        id: "situation1",
        backgroundImage: "bg_ending.png",
        bgm: "bgm_ending.mp3",
        characters: [
          {
            id: "narrator",
            name: "내레이션",
            image: "",
            position: "center"
          }
        ],
        dialogue: {
          characterId: "narrator",
          characterName: "내레이션",
          text: "모험의 결말입니다."
        }
      },
      {
        id: "situation2",
        backgroundImage: "bg_ending.png",
        bgm: "bgm_ending.mp3",
        characters: [
          {
            id: "charA",
            name: "캐릭터A",
            image: "char_a.png",
            position: "left"
          },
          {
            id: "charB",
            name: "캐릭터B",
            image: "char_b.png",
            position: "right"
          }
        ],
        dialogue: {
          characterId: "charA",
          characterName: "캐릭터A",
          text: "게임을 완료했습니다!",
          choices: [
            { text: "처음으로 돌아가기", event: "next_scene_scene1" }
          ]
        }
      }
    ]
  }
];

export type { CharacterPosition, CharacterVisual, DialogueChoice, Dialogue, Situation, Scene };