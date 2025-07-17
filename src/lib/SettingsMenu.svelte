<script lang="ts">
  import { gameSettings, type GameSettings } from './settings';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher<{
    close: void;
  }>();
  
  let settings: GameSettings;
  
  // 현재 설정을 로컬 변수로 복사
  gameSettings.subscribe(value => {
    settings = { ...value };
  });
  
  function handleSave() {
    gameSettings.save(settings);
    dispatch('close');
  }
  
  function handleCancel() {
    dispatch('close');
  }
  
  function handleReset() {
    if (confirm('설정을 초기값으로 되돌리시겠습니까?')) {
      gameSettings.reset();
      dispatch('close');
    }
  }
  
  // 타이핑 속도 레이블 계산
  function getTypingSpeedLabel(speed: number): string {
    if (speed <= 20) return '매우 빠름';
    if (speed <= 40) return '빠름';
    if (speed <= 60) return '보통';
    if (speed <= 80) return '느림';
    return '매우 느림';
  }
</script>

<div class="settings-overlay" on:click={handleCancel}>
  <div class="settings-modal" on:click|stopPropagation>
    <div class="settings-header">
      <h2>게임 설정</h2>
      <button class="close-button" on:click={handleCancel}>×</button>
    </div>
    
    <div class="settings-content">
      <!-- 타이핑 효과 설정 -->
      <div class="setting-group">
        <h3>텍스트 표시</h3>
        
        <div class="setting-item">
          <label>
            <input 
              type="checkbox" 
              bind:checked={settings.enableTypingEffect}
            />
            타이핑 효과 사용
          </label>
        </div>
        
        {#if settings.enableTypingEffect}
          <div class="setting-item">
            <label for="typing-speed">
              타이핑 속도: {getTypingSpeedLabel(settings.typingSpeed)}
            </label>
            <input 
              id="typing-speed"
              type="range" 
              min="10" 
              max="100" 
              step="10"
              bind:value={settings.typingSpeed}
              class="slider"
            />
            <div class="slider-labels">
              <span>빠름</span>
              <span>느림</span>
            </div>
          </div>
        {/if}
      </div>
      
      <!-- 자동 진행 설정 -->
      <div class="setting-group">
        <h3>자동 진행</h3>
        
        <div class="setting-item">
          <label>
            <input 
              type="checkbox" 
              bind:checked={settings.autoAdvance}
            />
            자동 진행 사용
          </label>
        </div>
        
        {#if settings.autoAdvance}
          <div class="setting-item">
            <label for="auto-delay">
              자동 진행 속도: {settings.autoAdvanceDelay / 1000}초
            </label>
            <input 
              id="auto-delay"
              type="range" 
              min="1000" 
              max="5000" 
              step="500"
              bind:value={settings.autoAdvanceDelay}
              class="slider"
            />
            <div class="slider-labels">
              <span>빠름</span>
              <span>느림</span>
            </div>
          </div>
        {/if}
      </div>
      
      <!-- 음향 설정 -->
      <div class="setting-group">
        <h3>음향</h3>
        
        <div class="setting-item">
          <label for="bgm-volume">
            배경음 볼륨: {Math.round(settings.bgmVolume * 100)}%
          </label>
          <input 
            id="bgm-volume"
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            bind:value={settings.bgmVolume}
            class="slider"
          />
        </div>
        
        <div class="setting-item">
          <label for="sfx-volume">
            효과음 볼륨: {Math.round(settings.sfxVolume * 100)}%
          </label>
          <input 
            id="sfx-volume"
            type="range" 
            min="0" 
            max="1" 
            step="0.1"
            bind:value={settings.sfxVolume}
            class="slider"
          />
        </div>
      </div>
    </div>
    
    <div class="settings-footer">
      <button class="reset-button" on:click={handleReset}>초기화</button>
      <div class="button-group">
        <button class="cancel-button" on:click={handleCancel}>취소</button>
        <button class="save-button" on:click={handleSave}>저장</button>
      </div>
    </div>
  </div>
</div>

<style>
  .settings-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .settings-modal {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .settings-header h2 {
    margin: 0;
    color: #333;
    font-size: 24px;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 32px;
    color: #666;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s;
  }
  
  .close-button:hover {
    background: #f0f0f0;
    color: #333;
  }
  
  .settings-content {
    padding: 24px;
  }
  
  .setting-group {
    margin-bottom: 32px;
  }
  
  .setting-group:last-child {
    margin-bottom: 0;
  }
  
  .setting-group h3 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
  }
  
  .setting-item {
    margin-bottom: 16px;
  }
  
  .setting-item:last-child {
    margin-bottom: 0;
  }
  
  .setting-item label {
    display: block;
    color: #555;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .setting-item input[type="checkbox"] {
    margin-right: 8px;
    transform: scale(1.2);
  }
  
  .slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #ddd;
    outline: none;
    margin: 8px 0;
    -webkit-appearance: none;
    appearance: none;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
  }
  
  .slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #4CAF50;
    cursor: pointer;
    border: none;
  }
  
  .slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }
  
  .settings-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-top: 1px solid #e0e0e0;
    background: #f9f9f9;
    border-radius: 0 0 12px 12px;
  }
  
  .button-group {
    display: flex;
    gap: 12px;
  }
  
  .settings-footer button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .reset-button {
    background: #f44336;
    color: white;
  }
  
  .reset-button:hover {
    background: #d32f2f;
  }
  
  .cancel-button {
    background: #6c757d;
    color: white;
  }
  
  .cancel-button:hover {
    background: #5a6268;
  }
  
  .save-button {
    background: #007bff;
    color: white;
  }
  
  .save-button:hover {
    background: #0056b3;
  }
  
  /* 모바일 대응 */
  @media (max-width: 600px) {
    .settings-modal {
      width: 95%;
      max-height: 90vh;
    }
    
    .settings-header,
    .settings-content,
    .settings-footer {
      padding: 16px;
    }
    
    .settings-header h2 {
      font-size: 20px;
    }
    
    .setting-group h3 {
      font-size: 16px;
    }
  }
</style>