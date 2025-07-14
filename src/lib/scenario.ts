export interface Dialogue {
  name: string;
  text: string;
}

export interface Choice {
  text: string;
  nextScene: string;
}

export interface Scene {
  id: string;
  background: string;
  character: string;
  dialogues: Dialogue[];
  choices?: Choice[];
  bgm?: string;
}

export const scenario: Scene[] = [
  {
    id: "scene1",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "캐릭터A", text: "환영합니다! 비주얼 노벨 시작입니다." },
      { name: "캐릭터B", text: "선택을 준비하세요." },
    ],
    choices: [
      { text: "왼쪽 길로 간다", nextScene: "scene2" },
      { text: "오른쪽 길로 간다", nextScene: "scene3" },
    ],
    bgm: "bgm_placeholder.mp3"
  },
  {
    id: "scene2",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "캐릭터A", text: "왼쪽 길입니다." },
      { name: "캐릭터A", text: "여기서 새로운 모험이 시작됩니다." },
    ],
    choices: [
      { text: "계속 진행한다", nextScene: "scene4" },
      { text: "뒤로 돌아간다", nextScene: "scene1" },
    ]
  },
  {
    id: "scene3",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "캐릭터B", text: "오른쪽 길입니다." },
      { name: "캐릭터B", text: "다른 길로 가보겠습니다." },
    ],
    choices: [
      { text: "계속 진행한다", nextScene: "scene4" },
      { text: "뒤로 돌아간다", nextScene: "scene1" },
    ]
  },
  {
    id: "scene4",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "내레이션", text: "모험의 결말입니다." },
      { name: "캐릭터A", text: "게임을 완료했습니다!" },
    ],
    choices: [
      { text: "처음으로 돌아가기", nextScene: "scene1" },
    ]
  }
];