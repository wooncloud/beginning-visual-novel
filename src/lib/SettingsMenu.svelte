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
    </div>
    
    <div class="settings-content">
      <!-- 타이핑 효과 설정 -->
      <div class="setting-group">
        <div class="setting-item toggle">
          <label for="typing-effect-toggle">타이핑 효과</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="typing-effect-toggle"
              bind:checked={settings.enableTypingEffect}
            />
            <span class="switch"></span>
          </div>
        </div>
        
        {#if settings.enableTypingEffect}
          <div class="setting-item slider">
            <label for="typing-speed">타이핑 속도</label>
            <input 
              id="typing-speed"
              type="range" 
              min="10" 
              max="100" 
              step="10"
              bind:value={settings.typingSpeed}
            />
            <span>{getTypingSpeedLabel(settings.typingSpeed)}</span>
          </div>
        {/if}
      </div>
      
      <!-- 자동 진행 설정 -->
      <div class="setting-group">
        <div class="setting-item toggle">
          <label for="auto-advance-toggle">자동 진행</label>
          <div class="toggle-switch">
            <input 
              type="checkbox" 
              id="auto-advance-toggle"
              bind:checked={settings.autoAdvance}
            />
            <span class="switch"></span>
          </div>
        </div>
        
        {#if settings.autoAdvance}
          <div class="setting-item slider">
            <label for="auto-delay">자동 진행 속도</label>
            <input 
              id="auto-delay"
              type="range" 
              min="1000" 
              max="5000" 
              step="500"
              bind:value={settings.autoAdvanceDelay}
            />
            <span>{settings.autoAdvanceDelay / 1000}초</span>
          </div>
        {/if}
      </div>
      
      <!-- 음향 설정 -->
      <div class="setting-group">
        <div class="setting-item slider">
          <label for="bgm-volume">배경음 볼륨</label>
          <input 
            id="bgm-volume"
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            bind:value={settings.bgmVolume}
          />
          <span>{Math.round(settings.bgmVolume * 100)}%</span>
        </div>
        
        <div class="setting-item slider">
          <label for="sfx-volume">효과음 볼륨</label>
          <input 
            id="sfx-volume"
            type="range" 
            min="0" 
            max="1" 
            step="0.05"
            bind:value={settings.sfxVolume}
          />
          <span>{Math.round(settings.sfxVolume * 100)}%</span>
        </div>
      </div>
    </div>
    
    <div class="settings-footer">
      <button class="btn-secondary" on:click={handleReset}>초기화</button>
      <button class="btn-primary" on:click={handleSave}>확인</button>
      <button class="btn-secondary" on:click={handleCancel}>닫기</button>
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
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }
  
  .settings-modal {
    background: #2c2c2c;
    color: white;
    border-radius: 10px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
    width: 90%;
    max-width: 400px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .settings-header {
    text-align: center;
    margin-bottom: 25px;
  }
  
  .settings-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }
  
  .settings-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .setting-group {
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .setting-group:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  .setting-item:last-child {
    margin-bottom: 0;
  }
  
  .setting-item label {
    font-size: 16px;
  }
  
  .setting-item.slider {
    display: grid;
    grid-template-columns: 1fr 2fr 0.5fr;
    gap: 15px;
  }
  
  .slider span {
    text-align: right;
    min-width: 50px;
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 28px;
  }
  
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .switch {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #555;
    transition: .4s;
    border-radius: 28px;
  }
  
  .switch:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + .switch {
    background-color: #3498db;
  }
  
  input:checked + .switch:before {
    transform: translateX(22px);
  }
  
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    background: #555;
    border-radius: 5px;
    outline: none;
    opacity: 0.7;
    transition: opacity .2s;
  }
  
  input[type="range"]:hover {
    opacity: 1;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3498db;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;
  }
  
  .settings-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
  }
  
  .btn-primary, .btn-secondary {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-primary {
    background: #3498db;
    color: white;
  }
  .btn-primary:hover {
    background: #2980b9;
  }
  
  .btn-secondary {
    background: #6c757d;
    color: white;
  }
  .btn-secondary:hover {
    background: #5a6268;
  }
</style>