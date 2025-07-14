import { c as create_ssr_component, a as subscribe, e as each } from "../../chunks/ssr.js";
import { w as writable } from "../../chunks/index.js";
import { e as escape } from "../../chunks/escape.js";
const scenario = [
  {
    id: "scene1",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "캐릭터A", text: "환영합니다! 비주얼 노벨 시작입니다." },
      { name: "캐릭터B", text: "선택을 준비하세요." }
    ],
    choices: [
      { text: "왼쪽 길로 간다", nextScene: "scene2" },
      { text: "오른쪽 길로 간다", nextScene: "scene3" }
    ],
    bgm: "bgm_placeholder.mp3"
  },
  {
    id: "scene2",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "캐릭터A", text: "왼쪽 길입니다." },
      { name: "캐릭터A", text: "여기서 새로운 모험이 시작됩니다." }
    ],
    choices: [
      { text: "계속 진행한다", nextScene: "scene4" },
      { text: "뒤로 돌아간다", nextScene: "scene1" }
    ]
  },
  {
    id: "scene3",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "캐릭터B", text: "오른쪽 길입니다." },
      { name: "캐릭터B", text: "다른 길로 가보겠습니다." }
    ],
    choices: [
      { text: "계속 진행한다", nextScene: "scene4" },
      { text: "뒤로 돌아간다", nextScene: "scene1" }
    ]
  },
  {
    id: "scene4",
    background: "bg_placeholder.png",
    character: "char_placeholder.png",
    dialogues: [
      { name: "내레이션", text: "모험의 결말입니다." },
      { name: "캐릭터A", text: "게임을 완료했습니다!" }
    ],
    choices: [
      { text: "처음으로 돌아가기", nextScene: "scene1" }
    ]
  }
];
const gameState = writable({
  currentSceneId: "scene1",
  currentDialogueIndex: 0,
  isShowingChoices: false,
  autoSave: true,
  playedScenes: /* @__PURE__ */ new Set()
});
const currentScene = writable(null);
function moveToScene(sceneId) {
  gameState.update((state) => {
    state.currentSceneId = sceneId;
    state.currentDialogueIndex = 0;
    state.isShowingChoices = false;
    state.playedScenes.add(sceneId);
    return state;
  });
  const scene = scenario.find((s) => s.id === sceneId);
  if (scene) {
    currentScene.set(scene);
  }
}
moveToScene("scene1");
const css = {
  code: ".game-container.svelte-1ud1fqj.svelte-1ud1fqj{position:relative;width:100vw;height:100vh;overflow:hidden;font-family:'Noto Sans KR', sans-serif}.game-screen.svelte-1ud1fqj.svelte-1ud1fqj{position:relative;width:100%;height:100%;cursor:pointer}.background.svelte-1ud1fqj.svelte-1ud1fqj{position:absolute;top:0;left:0;width:100%;height:100%;background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#2c2c2c}.character.svelte-1ud1fqj.svelte-1ud1fqj{position:absolute;bottom:20%;left:50%;transform:translateX(-50%);z-index:2}.character.svelte-1ud1fqj img.svelte-1ud1fqj{max-height:60vh;max-width:40vw;object-fit:contain}.choices-container.svelte-1ud1fqj.svelte-1ud1fqj{position:absolute;bottom:25%;left:50%;transform:translateX(-50%);z-index:10;display:flex;flex-direction:column;gap:10px}.choice-button.svelte-1ud1fqj.svelte-1ud1fqj{padding:15px 30px;background:rgba(0, 0, 0, 0.8);color:white;border:2px solid #ffffff;border-radius:10px;cursor:pointer;font-size:16px;transition:all 0.3s ease}.choice-button.svelte-1ud1fqj.svelte-1ud1fqj:hover{background:rgba(255, 255, 255, 0.2);transform:translateY(-2px)}.ui-controls.svelte-1ud1fqj.svelte-1ud1fqj{position:absolute;top:20px;right:20px;z-index:20;display:flex;gap:10px}.control-btn.svelte-1ud1fqj.svelte-1ud1fqj{padding:10px 20px;background:rgba(0, 0, 0, 0.7);color:white;border:1px solid #ffffff;border-radius:5px;cursor:pointer;font-size:14px;transition:background 0.3s ease}.control-btn.svelte-1ud1fqj.svelte-1ud1fqj:hover{background:rgba(255, 255, 255, 0.2)}.dialogue-box.svelte-1ud1fqj.svelte-1ud1fqj{position:absolute;bottom:0;left:0;right:0;background:rgba(0, 0, 0, 0.8);color:white;padding:20px;z-index:10;border-top:2px solid #ffffff}.character-name.svelte-1ud1fqj.svelte-1ud1fqj{font-size:18px;font-weight:bold;color:#ffcc00;margin-bottom:10px}.dialogue-text.svelte-1ud1fqj.svelte-1ud1fqj{font-size:16px;line-height:1.6;margin-bottom:10px}.continue-hint.svelte-1ud1fqj.svelte-1ud1fqj{font-size:12px;color:#cccccc;text-align:right;opacity:0.7}.save-menu.svelte-1ud1fqj.svelte-1ud1fqj,.load-menu.svelte-1ud1fqj.svelte-1ud1fqj{position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);background:rgba(0, 0, 0, 0.9);color:white;padding:30px;border-radius:10px;border:2px solid #ffffff;z-index:30;min-width:300px}.save-menu.svelte-1ud1fqj h3.svelte-1ud1fqj,.load-menu.svelte-1ud1fqj h3.svelte-1ud1fqj{margin:0 0 20px 0;text-align:center}.save-slots.svelte-1ud1fqj.svelte-1ud1fqj{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}.save-slot.svelte-1ud1fqj.svelte-1ud1fqj{padding:10px 20px;background:rgba(255, 255, 255, 0.1);color:white;border:1px solid #ffffff;border-radius:5px;cursor:pointer;transition:background 0.3s ease}.save-slot.svelte-1ud1fqj.svelte-1ud1fqj:hover{background:rgba(255, 255, 255, 0.2)}.close-btn.svelte-1ud1fqj.svelte-1ud1fqj{width:100%;padding:10px;background:rgba(255, 0, 0, 0.7);color:white;border:1px solid #ffffff;border-radius:5px;cursor:pointer;transition:background 0.3s ease}.close-btn.svelte-1ud1fqj.svelte-1ud1fqj:hover{background:rgba(255, 0, 0, 0.9)}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script>\\n  import { onMount } from 'svelte';\\n  import { gameState, currentScene, nextDialogue, selectChoice, moveToScene } from '../lib/gameState';\\n  import { saveGame, loadGame, autoSave, loadAutoSave, hasAutoSave } from '../lib/saveLoad';\\n  import { scenario } from '../lib/scenario';\\n  \\n  let showSaveMenu = false;\\n  let showLoadMenu = false;\\n  let currentBgm = null;\\n  \\n  onMount(() => {\\n    // 자동 세이브 로드\\n    if (hasAutoSave()) {\\n      const shouldLoad = confirm('자동 저장된 데이터를 불러오시겠습니까?');\\n      if (shouldLoad) {\\n        loadAutoSave();\\n      }\\n    }\\n    \\n    // 초기 씬 설정\\n    moveToScene(\\"scene1\\");\\n    \\n    // 키보드 이벤트 리스너\\n    window.addEventListener('keydown', handleKeyDown);\\n    \\n    return () => {\\n      window.removeEventListener('keydown', handleKeyDown);\\n      if (currentBgm) {\\n        currentBgm.pause();\\n      }\\n    };\\n  });\\n  \\n  function handleKeyDown(event) {\\n    if (event.code === 'Space') {\\n      event.preventDefault();\\n      if (!$gameState.isShowingChoices) {\\n        nextDialogue();\\n      }\\n    }\\n  }\\n  \\n  function handleScreenClick() {\\n    if (!$gameState.isShowingChoices) {\\n      nextDialogue();\\n    }\\n  }\\n  \\n  function handleChoice(index) {\\n    selectChoice(index);\\n    showSaveMenu = false;\\n    showLoadMenu = false;\\n  }\\n  \\n  function handleSave(slotNumber) {\\n    if (saveGame(slotNumber)) {\\n      alert(\`슬롯 \${slotNumber}에 저장되었습니다.\`);\\n    } else {\\n      alert('저장에 실패했습니다.');\\n    }\\n    showSaveMenu = false;\\n  }\\n  \\n  function handleLoad(slotNumber) {\\n    if (loadGame(slotNumber)) {\\n      alert(\`슬롯 \${slotNumber}에서 불러왔습니다.\`);\\n    } else {\\n      alert('불러오기에 실패했습니다.');\\n    }\\n    showLoadMenu = false;\\n  }\\n  \\n  // 현재 씬의 대화 가져오기\\n  $: currentDialogue = $currentScene && $gameState.currentDialogueIndex < $currentScene.dialogues.length \\n    ? $currentScene.dialogues[$gameState.currentDialogueIndex] \\n    : null;\\n    \\n  // 현재 씬의 선택지 가져오기\\n  $: currentChoices = $currentScene && $gameState.isShowingChoices \\n    ? $currentScene.choices || [] \\n    : [];\\n    \\n  // 배경음악 재생\\n  $: if ($currentScene && $currentScene.bgm) {\\n    if (currentBgm) {\\n      currentBgm.pause();\\n    }\\n    currentBgm = new Audio(\`/sounds/bgm/\${$currentScene.bgm}\`);\\n    currentBgm.loop = true;\\n    currentBgm.volume = 0.5;\\n    currentBgm.play().catch(e => console.log('BGM play failed:', e));\\n  }\\n<\/script>\\n\\n<svelte:head>\\n  <title>Visual Novel Game</title>\\n  <meta name=\\"description\\" content=\\"SvelteKit + Capacitor Visual Novel Game\\" />\\n</svelte:head>\\n\\n<main class=\\"game-container\\">\\n  <!-- 게임 화면 -->\\n  <div class=\\"game-screen\\" on:click={handleScreenClick}>\\n    <!-- 배경 이미지 -->\\n    {#if $currentScene}\\n      <div class=\\"background\\" style=\\"background-image: url('/images/backgrounds/{$currentScene.background}')\\"></div>\\n    {/if}\\n    \\n    <!-- 캐릭터 이미지 -->\\n    {#if $currentScene}\\n      <div class=\\"character\\">\\n        <img src=\\"/images/characters/{$currentScene.character}\\" alt=\\"Character\\" />\\n      </div>\\n    {/if}\\n    \\n    <!-- 선택지 -->\\n    {#if currentChoices.length > 0}\\n      <div class=\\"choices-container\\">\\n        {#each currentChoices as choice, index}\\n          <button \\n            class=\\"choice-button\\" \\n            on:click|stopPropagation={() => handleChoice(index)}\\n          >\\n            {choice.text}\\n          </button>\\n        {/each}\\n      </div>\\n    {/if}\\n  </div>\\n  \\n  <!-- UI 컨트롤 -->\\n  <div class=\\"ui-controls\\">\\n    <button class=\\"control-btn\\" on:click={() => showSaveMenu = !showSaveMenu}>\\n      저장하기\\n    </button>\\n    <button class=\\"control-btn\\" on:click={() => showLoadMenu = !showLoadMenu}>\\n      불러오기\\n    </button>\\n  </div>\\n  \\n  <!-- 대화 박스 -->\\n  {#if currentDialogue}\\n    <div class=\\"dialogue-box\\">\\n      <div class=\\"character-name\\">{currentDialogue.name}</div>\\n      <div class=\\"dialogue-text\\">{currentDialogue.text}</div>\\n      <div class=\\"continue-hint\\">▼ 클릭하거나 스페이스키를 누르세요</div>\\n    </div>\\n  {/if}\\n  \\n  <!-- 저장 메뉴 -->\\n  {#if showSaveMenu}\\n    <div class=\\"save-menu\\">\\n      <h3>저장하기</h3>\\n      <div class=\\"save-slots\\">\\n        {#each Array(5) as _, i}\\n          <button \\n            class=\\"save-slot\\" \\n            on:click={() => handleSave(i + 1)}\\n          >\\n            슬롯 {i + 1}\\n          </button>\\n        {/each}\\n      </div>\\n      <button class=\\"close-btn\\" on:click={() => showSaveMenu = false}>닫기</button>\\n    </div>\\n  {/if}\\n  \\n  <!-- 로드 메뉴 -->\\n  {#if showLoadMenu}\\n    <div class=\\"load-menu\\">\\n      <h3>불러오기</h3>\\n      <div class=\\"save-slots\\">\\n        {#each Array(5) as _, i}\\n          <button \\n            class=\\"save-slot\\" \\n            on:click={() => handleLoad(i + 1)}\\n          >\\n            슬롯 {i + 1}\\n          </button>\\n        {/each}\\n      </div>\\n      <button class=\\"close-btn\\" on:click={() => showLoadMenu = false}>닫기</button>\\n    </div>\\n  {/if}\\n</main>\\n\\n<style>\\n  .game-container {\\n    position: relative;\\n    width: 100vw;\\n    height: 100vh;\\n    overflow: hidden;\\n    font-family: 'Noto Sans KR', sans-serif;\\n  }\\n  \\n  .game-screen {\\n    position: relative;\\n    width: 100%;\\n    height: 100%;\\n    cursor: pointer;\\n  }\\n  \\n  .background {\\n    position: absolute;\\n    top: 0;\\n    left: 0;\\n    width: 100%;\\n    height: 100%;\\n    background-size: cover;\\n    background-position: center;\\n    background-repeat: no-repeat;\\n    background-color: #2c2c2c;\\n  }\\n  \\n  .character {\\n    position: absolute;\\n    bottom: 20%;\\n    left: 50%;\\n    transform: translateX(-50%);\\n    z-index: 2;\\n  }\\n  \\n  .character img {\\n    max-height: 60vh;\\n    max-width: 40vw;\\n    object-fit: contain;\\n  }\\n  \\n  .choices-container {\\n    position: absolute;\\n    bottom: 25%;\\n    left: 50%;\\n    transform: translateX(-50%);\\n    z-index: 10;\\n    display: flex;\\n    flex-direction: column;\\n    gap: 10px;\\n  }\\n  \\n  .choice-button {\\n    padding: 15px 30px;\\n    background: rgba(0, 0, 0, 0.8);\\n    color: white;\\n    border: 2px solid #ffffff;\\n    border-radius: 10px;\\n    cursor: pointer;\\n    font-size: 16px;\\n    transition: all 0.3s ease;\\n  }\\n  \\n  .choice-button:hover {\\n    background: rgba(255, 255, 255, 0.2);\\n    transform: translateY(-2px);\\n  }\\n  \\n  .ui-controls {\\n    position: absolute;\\n    top: 20px;\\n    right: 20px;\\n    z-index: 20;\\n    display: flex;\\n    gap: 10px;\\n  }\\n  \\n  .control-btn {\\n    padding: 10px 20px;\\n    background: rgba(0, 0, 0, 0.7);\\n    color: white;\\n    border: 1px solid #ffffff;\\n    border-radius: 5px;\\n    cursor: pointer;\\n    font-size: 14px;\\n    transition: background 0.3s ease;\\n  }\\n  \\n  .control-btn:hover {\\n    background: rgba(255, 255, 255, 0.2);\\n  }\\n  \\n  .dialogue-box {\\n    position: absolute;\\n    bottom: 0;\\n    left: 0;\\n    right: 0;\\n    background: rgba(0, 0, 0, 0.8);\\n    color: white;\\n    padding: 20px;\\n    z-index: 10;\\n    border-top: 2px solid #ffffff;\\n  }\\n  \\n  .character-name {\\n    font-size: 18px;\\n    font-weight: bold;\\n    color: #ffcc00;\\n    margin-bottom: 10px;\\n  }\\n  \\n  .dialogue-text {\\n    font-size: 16px;\\n    line-height: 1.6;\\n    margin-bottom: 10px;\\n  }\\n  \\n  .continue-hint {\\n    font-size: 12px;\\n    color: #cccccc;\\n    text-align: right;\\n    opacity: 0.7;\\n  }\\n  \\n  .save-menu, .load-menu {\\n    position: absolute;\\n    top: 50%;\\n    left: 50%;\\n    transform: translate(-50%, -50%);\\n    background: rgba(0, 0, 0, 0.9);\\n    color: white;\\n    padding: 30px;\\n    border-radius: 10px;\\n    border: 2px solid #ffffff;\\n    z-index: 30;\\n    min-width: 300px;\\n  }\\n  \\n  .save-menu h3, .load-menu h3 {\\n    margin: 0 0 20px 0;\\n    text-align: center;\\n  }\\n  \\n  .save-slots {\\n    display: flex;\\n    flex-direction: column;\\n    gap: 10px;\\n    margin-bottom: 20px;\\n  }\\n  \\n  .save-slot {\\n    padding: 10px 20px;\\n    background: rgba(255, 255, 255, 0.1);\\n    color: white;\\n    border: 1px solid #ffffff;\\n    border-radius: 5px;\\n    cursor: pointer;\\n    transition: background 0.3s ease;\\n  }\\n  \\n  .save-slot:hover {\\n    background: rgba(255, 255, 255, 0.2);\\n  }\\n  \\n  .close-btn {\\n    width: 100%;\\n    padding: 10px;\\n    background: rgba(255, 0, 0, 0.7);\\n    color: white;\\n    border: 1px solid #ffffff;\\n    border-radius: 5px;\\n    cursor: pointer;\\n    transition: background 0.3s ease;\\n  }\\n  \\n  .close-btn:hover {\\n    background: rgba(255, 0, 0, 0.9);\\n  }\\n</style>"],"names":[],"mappings":"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"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentDialogue;
  let currentChoices;
  let $currentScene, $$unsubscribe_currentScene;
  let $gameState, $$unsubscribe_gameState;
  $$unsubscribe_currentScene = subscribe(currentScene, (value) => $currentScene = value);
  $$unsubscribe_gameState = subscribe(gameState, (value) => $gameState = value);
  let currentBgm = null;
  $$result.css.add(css);
  currentDialogue = $currentScene && $gameState.currentDialogueIndex < $currentScene.dialogues.length ? $currentScene.dialogues[$gameState.currentDialogueIndex] : null;
  currentChoices = $currentScene && $gameState.isShowingChoices ? $currentScene.choices || [] : [];
  {
    if ($currentScene && $currentScene.bgm) {
      if (currentBgm) {
        currentBgm.pause();
      }
      currentBgm = new Audio(`/sounds/bgm/${$currentScene.bgm}`);
      currentBgm.loop = true;
      currentBgm.volume = 0.5;
      currentBgm.play().catch((e) => console.log("BGM play failed:", e));
    }
  }
  $$unsubscribe_currentScene();
  $$unsubscribe_gameState();
  return `${$$result.head += `<!-- HEAD_svelte-hq575f_START -->${$$result.title = `<title>Visual Novel Game</title>`, ""}<meta name="description" content="SvelteKit + Capacitor Visual Novel Game"><!-- HEAD_svelte-hq575f_END -->`, ""} <main class="game-container svelte-1ud1fqj"> <div class="game-screen svelte-1ud1fqj"> ${$currentScene ? `<div class="background svelte-1ud1fqj" style="${"background-image: url('/images/backgrounds/" + escape($currentScene.background, true) + "')"}"></div>` : ``}  ${$currentScene ? `<div class="character svelte-1ud1fqj"><img src="${"/images/characters/" + escape($currentScene.character, true)}" alt="Character" class="svelte-1ud1fqj"></div>` : ``}  ${currentChoices.length > 0 ? `<div class="choices-container svelte-1ud1fqj">${each(currentChoices, (choice, index) => {
    return `<button class="choice-button svelte-1ud1fqj">${escape(choice.text)} </button>`;
  })}</div>` : ``}</div>  <div class="ui-controls svelte-1ud1fqj"><button class="control-btn svelte-1ud1fqj" data-svelte-h="svelte-1h52fyk">저장하기</button> <button class="control-btn svelte-1ud1fqj" data-svelte-h="svelte-16wus8x">불러오기</button></div>  ${currentDialogue ? `<div class="dialogue-box svelte-1ud1fqj"><div class="character-name svelte-1ud1fqj">${escape(currentDialogue.name)}</div> <div class="dialogue-text svelte-1ud1fqj">${escape(currentDialogue.text)}</div> <div class="continue-hint svelte-1ud1fqj" data-svelte-h="svelte-k8flop">▼ 클릭하거나 스페이스키를 누르세요</div></div>` : ``}  ${``}  ${``} </main>`;
});
export {
  Page as default
};
