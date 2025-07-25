<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { gameState, currentScene, currentSituation, nextDialogue, selectChoice, moveToScene, resetGame, startGame, showMainMenu, setTypingState, onTypingComplete, canAdvanceDialogue, clearAutoAdvanceTimer } from '../lib/gameState';
  import { saveGame, loadGame, autoSave, loadAutoSave, hasAutoSave } from '../lib/saveLoad';
  import { gameSettings } from '../lib/settings';
  import MainMenu from '../lib/MainMenu.svelte';
  import TypewriterEffect from '../lib/TypewriterEffect.svelte';
  import SettingsMenu from '../lib/SettingsMenu.svelte';
  import '../styles/components/Game.css';
  import { applyBgmVolume, applySfxVolume, optionsState } from '../lib/optionsState';
  
  let showSaveMenu = false;
  let showLoadMenu = false;
  let showSettingsMenu = false;
  let currentBgm: HTMLAudioElement | null = null;
  let typewriterComponent: TypewriterEffect;
  
  function handleKeydown(event: KeyboardEvent) {
    if ($gameState.gameMode !== 'game') return;
    
    if (event.code === 'Space' || event.code === 'Enter') {
      event.preventDefault();
      handleScreenClick();
    }
  }
  
  function handleTouchEnd(event: TouchEvent) {
    if ($gameState.gameMode !== 'game') return;
    
    event.preventDefault();
    handleScreenClick();
  }
  
  onMount(() => {
    gameSettings.load();
    document.addEventListener('keydown', handleKeydown);
    return () => {
      if (currentBgm) {
        currentBgm.pause();
      }
      document.removeEventListener('keydown', handleKeydown);
    };
  });
  
  async function handleScreenClick() {
    // 자동 진행 타이머 정리 (사용자가 수동으로 진행)
    clearAutoAdvanceTimer();
    
    // 타이핑 중이면 타이핑을 완료시킴
    if ($gameState.isTyping && typewriterComponent) {
      typewriterComponent.skip();
      return;
    }
    
    // 진행 가능한 상태일 때만 다음 대사로 이동
    if (canAdvanceDialogue()) {
      await nextDialogue();
    }
  }

  function handleTypingStart() {
    setTypingState(true);
  }
  
  function handleTypingComplete() {
    onTypingComplete();
  }
  
  function handleTypingSkip() {
    onTypingComplete();
  }
  
  async function handleChoice(index: number) {
    // 선택 효과음 재생
    playSfx('click.mp3');
    
    await selectChoice(index);
    showSaveMenu = false;
    showLoadMenu = false;
    showSettingsMenu = false;
  }

  function playSfx(filename: string) {
    if (!browser) return;
    
    try {
      const audio = new Audio(`/sounds/sfx/${filename}`);
      applySfxVolume(audio, $optionsState.sfxVolume);
      audio.play().catch(e => console.log('SFX play failed:', e));
    } catch (error) {
      console.log('SFX error:', error);
    }
  }
  
  function handleSave(slotNumber: number) {
    if (saveGame(slotNumber)) {
      alert(`슬롯 ${slotNumber}에 저장되었습니다.`);
    } else {
      alert('저장에 실패했습니다.');
    }
    showSaveMenu = false;
  }
  
  async function handleLoad(slotNumber: number) {
    const success = await loadGame(slotNumber);
    if (success) {
      alert(`슬롯 ${slotNumber}에서 불러왔습니다.`);
    } else {
      alert('불러오기에 실패했습니다.');
    }
    showLoadMenu = false;
  }
  
  async function handleMainMenuStart() {
    // 자동 저장된 데이터가 있는지 확인
    if (hasAutoSave()) {
      const shouldLoad = confirm('자동 저장된 데이터를 불러오시겠습니까?');
      if (shouldLoad) {
        await loadAutoSave();
        startGame();
        return;
      }
    }
    
    // 새 게임 시작
    await resetGame();
    startGame();
  }
  
  function handleMainMenuLoadGame() {
    // 불러오기를 통해 게임이 로드된 경우
    startGame();
  }
  
  // 현재 상황의 대화 가져오기
  $: currentDialogue = $currentSituation ? $currentSituation.dialogue : null;
    
  // 현재 상황의 선택지 가져오기
  $: currentChoices = $currentSituation && $gameState.isShowingChoices 
    ? $currentSituation.dialogue.choices || [] 
    : [];
    
  // 캐릭터 이미지 위치별 분류
  $: leftCharacters = $currentSituation ? $currentSituation.characters.filter(c => c.position === 'left') : [];
  $: centerCharacters = $currentSituation ? $currentSituation.characters.filter(c => c.position === 'center') : [];
  $: rightCharacters = $currentSituation ? $currentSituation.characters.filter(c => c.position === 'right') : [];
    
  // 배경음악 재생
  $: if (browser && $gameState.gameMode === 'game') {
    const newBgm = $currentSituation?.bgm;
    const oldBgmSrc = currentBgm?.src;

    if (newBgm) {
      const newBgmPath = `/sounds/bgm/${newBgm}`;
      if (!oldBgmSrc || !oldBgmSrc.endsWith(newBgmPath)) {
        if (currentBgm) {
          currentBgm.pause();
        }
        currentBgm = new Audio(newBgmPath);
        currentBgm.loop = true;
        applyBgmVolume(currentBgm, $optionsState.bgmVolume);
        currentBgm.play().catch(e => console.error('BGM play failed:', e));
      }
    } else {
      if (currentBgm) {
        currentBgm.pause();
        currentBgm = null;
      }
    }
  }

  // BGM 볼륨 실시간 적용
  $: if (currentBgm && $optionsState) {
    applyBgmVolume(currentBgm, $optionsState.bgmVolume);
  }

  // 텍스트 애니메이션 시작
  $: if (currentDialogue && currentDialogue.text) {
    // startTextAnimation(currentDialogue.text); // 미사용 코드 제거
  }
</script>

<svelte:head>
  <title>Visual Novel Game</title>
</svelte:head>

{#if $gameState.gameMode === 'main'}
  <!-- 메인 메뉴 화면 -->
  <MainMenu 
    on:start={handleMainMenuStart}
    on:loadGame={handleMainMenuLoadGame}
  />
{:else}
  <!-- 게임 화면 -->
  
  <!-- 로딩 화면 -->
  {#if $gameState.isLoading}
    <div class="loading-screen">
      <div class="loading-spinner"></div>
      <p>씬을 불러오는 중...</p>
    </div>
  {/if}

  <!-- 오류 화면 -->
  {#if $gameState.error}
    <div class="error-screen">
      <h2>오류가 발생했습니다</h2>
      <p>{$gameState.error}</p>
      <button on:click={async () => await moveToScene("scene1")}>
        처음으로 돌아가기
      </button>
    </div>
  {/if}

  <!-- 메인 게임 화면 -->
  {#if !$gameState.isLoading && !$gameState.error && $currentSituation}
    <div class="game-container" on:click={handleScreenClick} on:touchend={handleTouchEnd}>
      <!-- 게임 UI -->
      <div class="ui-container">
        <!-- 메뉴 버튼들 -->
        <div class="menu-buttons">
          <button on:click|stopPropagation={() => showSaveMenu = !showSaveMenu}>
            저장
          </button>
          <button on:click|stopPropagation={() => showLoadMenu = !showLoadMenu}>
            불러오기
          </button>
          <button on:click|stopPropagation={() => showSettingsMenu = !showSettingsMenu}>
            설정
          </button>
          <button on:click|stopPropagation={() => {
            if (confirm('메인 메뉴로 돌아가시겠습니까?')) {
              showMainMenu();
            }
          }}>
            메인메뉴
          </button>
        </div>
        
        <!-- 저장 메뉴 -->
        {#if showSaveMenu}
          <div class="save-menu" on:click|stopPropagation>
            <h3>저장하기</h3>
            {#each Array(5) as _, i}
              <button on:click={() => handleSave(i + 1)}>
                슬롯 {i + 1}
              </button>
            {/each}
            <button on:click={() => showSaveMenu = false}>닫기</button>
          </div>
        {/if}
        
        <!-- 불러오기 메뉴 -->
        {#if showLoadMenu}
          <div class="load-menu" on:click|stopPropagation>
            <h3>불러오기</h3>
            {#each Array(5) as _, i}
              <button on:click={() => handleLoad(i + 1)}>
                슬롯 {i + 1}
              </button>
            {/each}
            <button on:click={() => showLoadMenu = false}>닫기</button>
          </div>
        {/if}
        
        <!-- 설정 메뉴 -->
        {#if showSettingsMenu}
          <SettingsMenu on:close={() => showSettingsMenu = false} />
        {/if}
      </div>
      
      <!-- 배경 이미지 -->
      <div class="background" style="background-image: url('/images/bg/{$currentSituation.backgroundImage}')">
      </div>
      
      <!-- 캐릭터 이미지들 -->
      <div class="characters">
        <!-- 왼쪽 캐릭터 -->
        {#if leftCharacters.length > 0}
          <div class="character-group left">
            {#each leftCharacters as character}
              <div class="character">
                <img 
                  src="/images/characters/{character.image}" 
                  alt={character.name}
                  class="character-image"
                />
              </div>
            {/each}
          </div>
        {/if}
        
        <!-- 가운데 캐릭터 -->
        {#if centerCharacters.length > 0}
          <div class="character-group center">
            {#each centerCharacters as character}
              <div class="character">
                <img 
                  src="/images/characters/{character.image}" 
                  alt={character.name}
                  class="character-image"
                />
              </div>
            {/each}
          </div>
        {/if}
        
        <!-- 오른쪽 캐릭터 -->
        {#if rightCharacters.length > 0}
          <div class="character-group right">
            {#each rightCharacters as character}
              <div class="character">
                <img 
                  src="/images/characters/{character.image}" 
                  alt={character.name}
                  class="character-image"
                />
              </div>
            {/each}
          </div>
        {/if}
      </div>
      
      <!-- 대화 박스 -->
      <div class="dialogue-box">
        <div class="speaker-name">{currentDialogue?.characterName}</div>
        <div class="dialogue-text">
          {#if currentDialogue?.text && $gameSettings.enableTypingEffect}
            <TypewriterEffect 
              bind:this={typewriterComponent}
              text={currentDialogue.text}
              speed={$gameSettings.typingSpeed}
              autoStart={true}
              skipOnClick={false}
              on:start={handleTypingStart}
              on:complete={handleTypingComplete}
              on:skip={handleTypingSkip}
            />
          {:else if currentDialogue?.text}
            {currentDialogue.text}
          {/if}
        </div>
        
        <!-- 선택지 표시 -->
        {#if currentChoices.length > 0}
          <div class="choices">
            {#each currentChoices as choice, index}
              <button 
                class="choice-button"
                on:click|stopPropagation={() => handleChoice(index)}
              >
                {choice.text}
              </button>
            {/each}
          </div>
        {:else if $gameState.canAdvance && !$gameState.isTyping}
          <!-- 진행 가능 인디케이터 -->
          <div class="advance-indicator">
            <span class="advance-text">클릭하여 계속</span>
            <span class="advance-icon">▼</span>
          </div>
        {/if}
      </div>
    </div>
  {/if}
{/if}
