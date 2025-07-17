<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { getSaveSlots, loadGame, type SaveData } from './saveLoad';
  import { resetGame, startGame } from './gameState';
  import SettingsMenu from './SettingsMenu.svelte';
  
  const dispatch = createEventDispatcher();
  
  let showLoadSlots = false;
  let showOptions = false;
  let showSettings = false;
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
  
  function handleSettings() {
    showSettings = true;
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
      <button class="menu-button" on:click={handleSettings}>설정</button>
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
  
  <!-- 설정 팝업 -->
  {#if showSettings}
    <SettingsMenu on:close={() => showSettings = false} />
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

<style>
  .main-menu {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
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
    z-index: 1;
  }
  
  .menu-container {
    position: relative;
    z-index: 2;
    text-align: center;
    margin-top: 20vh; /* 화면 중간보다 약간 아래 배치 */
  }
  
  .game-title {
    color: white;
    font-size: 3rem;
    margin-bottom: 3rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    font-weight: bold;
  }
  
  .menu-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .menu-button {
    width: 200px;
    padding: 12px 24px;
    font-size: 18px;
    font-weight: bold;
    color: white;
    background: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
  }
  
  .menu-button:hover {
    background: rgba(52, 152, 219, 0.8);
    border-color: rgba(255, 255, 255, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  .menu-button:active {
    transform: translateY(0);
  }
  
  /* 팝업 스타일 */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
  
  .popup-content {
    background: rgba(30, 30, 30, 0.95);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    max-width: 500px;
    max-height: 70vh;
    overflow-y: auto;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .popup-content h2 {
    margin: 0 0 1.5rem 0;
    text-align: center;
    color: #3498db;
    font-size: 1.5rem;
  }
  
  .no-saves {
    text-align: center;
    color: #bbb;
    font-style: italic;
    margin: 2rem 0;
  }
  
  .save-slots {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .save-slot {
    background: rgba(52, 152, 219, 0.2);
    border: 1px solid rgba(52, 152, 219, 0.5);
    color: white;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }
  
  .save-slot:hover {
    background: rgba(52, 152, 219, 0.4);
    border-color: rgba(52, 152, 219, 0.8);
  }
  
  .slot-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .slot-number {
    font-weight: bold;
    color: #3498db;
  }
  
  .slot-date {
    font-size: 0.9rem;
    color: #bbb;
  }
  
  .slot-details {
    font-size: 0.9rem;
    color: #ddd;
  }
  
  .scene-info {
    color: #95a5a6;
  }
  
  .close-button {
    width: 100%;
    padding: 0.8rem;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s ease;
  }
  
  .close-button:hover {
    background: #c0392b;
  }
  
  .placeholder-text {
    text-align: center;
    color: #bbb;
    margin: 2rem 0;
    font-style: italic;
  }
  
  /* 모바일 대응 */
  @media (max-width: 768px) {
    .game-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }
    
    .menu-button {
      width: 180px;
      font-size: 16px;
    }
    
    .popup-content {
      margin: 1rem;
      max-width: calc(100% - 2rem);
      padding: 1.5rem;
    }
    
    .menu-container {
      margin-top: 15vh;
    }
  }
  
  @media (max-width: 480px) {
    .game-title {
      font-size: 1.5rem;
    }
    
    .menu-button {
      width: 160px;
      font-size: 14px;
      padding: 10px 20px;
    }
    
    .menu-container {
      margin-top: 10vh;
    }
  }
</style>