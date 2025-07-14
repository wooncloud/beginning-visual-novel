<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { gameState, currentScene, nextDialogue, selectChoice, moveToScene } from '../lib/gameState';
  import { saveGame, loadGame, autoSave, loadAutoSave, hasAutoSave } from '../lib/saveLoad';
  import { scenario } from '../lib/scenario';
  
  let showSaveMenu = false;
  let showLoadMenu = false;
  let currentBgm: HTMLAudioElement | null = null;
  
  onMount(() => {
    // 자동 세이브 로드
    if (hasAutoSave()) {
      const shouldLoad = confirm('자동 저장된 데이터를 불러오시겠습니까?');
      if (shouldLoad) {
        loadAutoSave();
      }
    }
    
    // 초기 씬 설정
    moveToScene("scene1");
    
    return () => {
      if (currentBgm) {
        currentBgm.pause();
      }
    };
  });
  
  function handleScreenClick() {
    if (!$gameState.isShowingChoices) {
      nextDialogue();
    }
  }
  
  function handleChoice(index: number) {
    selectChoice(index);
    showSaveMenu = false;
    showLoadMenu = false;
  }
  
  function handleSave(slotNumber: number) {
    if (saveGame(slotNumber)) {
      alert(`슬롯 ${slotNumber}에 저장되었습니다.`);
    } else {
      alert('저장에 실패했습니다.');
    }
    showSaveMenu = false;
  }
  
  function handleLoad(slotNumber: number) {
    if (loadGame(slotNumber)) {
      alert(`슬롯 ${slotNumber}에서 불러왔습니다.`);
    } else {
      alert('불러오기에 실패했습니다.');
    }
    showLoadMenu = false;
  }
  
  // 현재 씬의 대화 가져오기
  $: currentDialogue = $currentScene && $gameState.currentDialogueIndex < $currentScene.dialogues.length 
    ? $currentScene.dialogues[$gameState.currentDialogueIndex] 
    : null;
    
  // 현재 씬의 선택지 가져오기
  $: currentChoices = $currentScene && $gameState.isShowingChoices 
    ? $currentScene.choices || [] 
    : [];
    
  // 배경음악 재생
  $: if (browser) {
    const newBgm = $currentScene?.bgm;
    const oldBgmSrc = currentBgm?.src;

    if (newBgm) {
      const newBgmPath = `/sounds/bgm/${newBgm}`;
      if (!oldBgmSrc || !oldBgmSrc.endsWith(newBgmPath)) {
        if (currentBgm) {
          currentBgm.pause();
        }
        currentBgm = new Audio(newBgmPath);
        currentBgm.loop = true;
        currentBgm.volume = 0.5;
        currentBgm.play().catch(e => console.error('BGM play failed:', e));
      }
    } else {
      if (currentBgm) {
        currentBgm.pause();
        currentBgm = null;
      }
    }
  }
</script>

<svelte:head>
  <title>Visual Novel Game</title>
  <meta name="description" content="SvelteKit + Capacitor Visual Novel Game" />
</svelte:head>

<main class="game-container">
  <!-- 게임 화면 -->
  <div 
    class="game-screen" 
    on:click={handleScreenClick}
    on:keydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleScreenClick();
      }
    }}
    role="button"
    tabindex="0"
  >
    <!-- 배경 이미지 -->
    {#if $currentScene}
      <div class="background" style="background-image: url('/images/backgrounds/{$currentScene.background}')"></div>
    {/if}
    
    <!-- 캐릭터 이미지 -->
    {#if $currentScene}
      <div class="character">
        <img src="/images/characters/{$currentScene.character}" alt="Character" />
      </div>
    {/if}
    
    <!-- 선택지 -->
    {#if currentChoices.length > 0}
      <div class="choices-container">
        {#each currentChoices as choice, index}
          <button 
            class="choice-button" 
            on:click|stopPropagation={() => handleChoice(index)}
          >
            {choice.text}
          </button>
        {/each}
      </div>
    {/if}
  </div>
  
  <!-- UI 컨트롤 -->
  <div class="ui-controls">
    <button class="control-btn" on:click={() => showSaveMenu = !showSaveMenu}>
      저장하기
    </button>
    <button class="control-btn" on:click={() => showLoadMenu = !showLoadMenu}>
      불러오기
    </button>
  </div>
  
  <!-- 대화 박스 -->
  {#if currentDialogue}
    <div class="dialogue-box">
      <div class="character-name">{currentDialogue.name}</div>
      <div class="dialogue-text">{currentDialogue.text}</div>
      <div class="continue-hint">▼ 클릭하거나 스페이스키를 누르세요</div>
    </div>
  {/if}
  
  <!-- 저장 메뉴 -->
  {#if showSaveMenu}
    <div class="save-menu">
      <h3>저장하기</h3>
      <div class="save-slots">
        {#each Array(5) as _, i}
          <button 
            class="save-slot" 
            on:click={() => handleSave(i + 1)}
          >
            슬롯 {i + 1}
          </button>
        {/each}
      </div>
      <button class="close-btn" on:click={() => showSaveMenu = false}>닫기</button>
    </div>
  {/if}
  
  <!-- 로드 메뉴 -->
  {#if showLoadMenu}
    <div class="load-menu">
      <h3>불러오기</h3>
      <div class="save-slots">
        {#each Array(5) as _, i}
          <button 
            class="save-slot" 
            on:click={() => handleLoad(i + 1)}
          >
            슬롯 {i + 1}
          </button>
        {/each}
      </div>
      <button class="close-btn" on:click={() => showLoadMenu = false}>닫기</button>
    </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
  }

  .game-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: 'Noto Sans KR', sans-serif;
  }
  
  .game-screen {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-color: #2c2c2c;
  }
  
  .character {
    position: absolute;
    bottom: 20%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }
  
  .character img {
    max-height: 60vh;
    max-width: 40vw;
    object-fit: contain;
  }
  
  .choices-container {
    position: absolute;
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .choice-button {
    padding: 15px 30px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    border: 2px solid #ffffff;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s ease;
  }
  
  .choice-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  .ui-controls {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 20;
    display: flex;
    gap: 10px;
  }
  
  .control-btn {
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: 1px solid #ffffff;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s ease;
  }
  
  .control-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .dialogue-box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 20px;
    z-index: 10;
    border-top: 2px solid #ffffff;
  }
  
  .character-name {
    font-size: 18px;
    font-weight: bold;
    color: #ffcc00;
    margin-bottom: 10px;
  }
  
  .dialogue-text {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .continue-hint {
    font-size: 12px;
    color: #cccccc;
    text-align: right;
    opacity: 0.7;
  }
  
  .save-menu, .load-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 30px;
    border-radius: 10px;
    border: 2px solid #ffffff;
    z-index: 30;
    min-width: 300px;
  }
  
  .save-menu h3, .load-menu h3 {
    margin: 0 0 20px 0;
    text-align: center;
  }
  
  .save-slots {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .save-slot {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid #ffffff;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .save-slot:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .close-btn {
    width: 100%;
    padding: 10px;
    background: rgba(255, 0, 0, 0.7);
    color: white;
    border: 1px solid #ffffff;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .close-btn:hover {
    background: rgba(255, 0, 0, 0.9);
  }
</style>