<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getSaveSlots, loadGame, type SaveData } from './saveLoad';
  import { resetGame, startGame } from './gameState';
  import '../styles/components/MainMenu.css';
  
  const dispatch = createEventDispatcher();
  
  let showLoadSlots = false;
  let showOptions = false;
  let saveSlots: SaveData[] = [];
  
  function handleStart() {
    dispatch('start');
  }
  
  function handleLoad() {
    saveSlots = getSaveSlots();
    showLoadSlots = true;
  }
  
  function handleOptions() {
    showOptions = true;
  }
  
  function handleExit() {
    if (confirm('게임을 종료하시겠습니까?')) {
      // 브라우저에서는 실제 종료가 불가능하므로 메시지만 표시
      alert('게임을 종료합니다.');
    }
  }
  
  async function handleLoadSlot(slotNumber: number) {
    const success = await loadGame(slotNumber);
    if (success) {
      showLoadSlots = false;
      dispatch('loadGame');
    } else {
      alert('불러오기에 실패했습니다.');
    }
  }
  
  function closeLoadSlots() {
    showLoadSlots = false;
  }
  
  function closeOptions() {
    showOptions = false;
  }
  
  function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
</script>

<div class="main-menu">
  <!-- 배경 이미지 -->
  <div class="background" style="background-image: url('/images/backgrounds/bg_placeholder.png')"></div>
  
  <!-- 메인 메뉴 버튼들 -->
  <div class="menu-container">
    <h1 class="game-title">Visual Novel Game</h1>
    <div class="menu-buttons">
      <button class="menu-button" on:click={handleStart}>시작</button>
      <button class="menu-button" on:click={handleLoad}>불러오기</button>
      <button class="menu-button" on:click={handleOptions}>옵션</button>
      <button class="menu-button" on:click={handleExit}>종료</button>
    </div>
  </div>
  
  <!-- 불러오기 슬롯 팝업 -->
  {#if showLoadSlots}
    <div class="popup-overlay" on:click={closeLoadSlots}>
      <div class="popup-content" on:click|stopPropagation>
        <h2>불러오기</h2>
        {#if saveSlots.length === 0}
          <p class="no-saves">저장된 내용이 없습니다.</p>
        {:else}
          <div class="save-slots">
            {#each saveSlots as save}
              <button class="save-slot" on:click={() => handleLoadSlot(save.saveSlot)}>
                <div class="slot-info">
                  <span class="slot-number">슬롯 {save.saveSlot}</span>
                  <span class="slot-date">{formatDate(save.timestamp)}</span>
                </div>
                <div class="slot-details">
                  <span class="scene-info">씬: {save.gameState.sceneId}</span>
                </div>
              </button>
            {/each}
          </div>
        {/if}
        <button class="close-button" on:click={closeLoadSlots}>닫기</button>
      </div>
    </div>
  {/if}
  
  <!-- 옵션 팝업 -->
  {#if showOptions}
    <div class="popup-overlay" on:click={closeOptions}>
      <div class="popup-content" on:click|stopPropagation>
        <h2>옵션</h2>
        <p class="placeholder-text">옵션 설정은 추후 구현 예정입니다.</p>
        <button class="close-button" on:click={closeOptions}>닫기</button>
      </div>
    </div>
  {/if}
</div>

