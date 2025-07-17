<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { optionsState, setBgmVolume, setSfxVolume, setTextSpeed, setFullscreen } from './optionsState';
  
  const dispatch = createEventDispatcher();
  
  let bgmVolume = $optionsState.bgmVolume;
  let sfxVolume = $optionsState.sfxVolume;
  let textSpeed = $optionsState.textSpeed;
  let isFullscreen = $optionsState.isFullscreen;
  
  // 반응형으로 옵션 상태 업데이트
  $: {
    bgmVolume = $optionsState.bgmVolume;
    sfxVolume = $optionsState.sfxVolume;
    textSpeed = $optionsState.textSpeed;
    isFullscreen = $optionsState.isFullscreen;
  }
  
  function handleBgmVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const volume = parseInt(target.value);
    setBgmVolume(volume);
  }
  
  function handleSfxVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const volume = parseInt(target.value);
    setSfxVolume(volume);
  }
  
  function handleTextSpeedChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const speed = parseInt(target.value);
    setTextSpeed(speed);
  }
  
  function handleFullscreenToggle() {
    setFullscreen(!isFullscreen);
  }
  
  function handleClose() {
    dispatch('close');
  }
  
  // 텍스트 속도 라벨 생성
  function getTextSpeedLabel(speed: number): string {
    if (speed <= 2) return '매우 느림';
    if (speed <= 4) return '느림';
    if (speed <= 6) return '보통';
    if (speed <= 8) return '빠름';
    return '매우 빠름';
  }
</script>

<div class="options-overlay" on:click={handleClose}>
  <div class="options-container" on:click|stopPropagation>
    <h2 class="options-title">게임 옵션</h2>
    
    <div class="options-content">
      <!-- BGM 볼륨 -->
      <div class="option-group">
        <label for="bgm-volume" class="option-label">
          배경음악 볼륨
          <span class="volume-value">{bgmVolume}%</span>
        </label>
        <div class="slider-container">
          <input
            id="bgm-volume"
            type="range"
            min="0"
            max="100"
            step="1"
            value={bgmVolume}
            on:input={handleBgmVolumeChange}
            class="volume-slider"
          />
          <div class="slider-track"></div>
        </div>
      </div>
      
      <!-- SFX 볼륨 -->
      <div class="option-group">
        <label for="sfx-volume" class="option-label">
          효과음 볼륨
          <span class="volume-value">{sfxVolume}%</span>
        </label>
        <div class="slider-container">
          <input
            id="sfx-volume"
            type="range"
            min="0"
            max="100"
            step="1"
            value={sfxVolume}
            on:input={handleSfxVolumeChange}
            class="volume-slider"
          />
          <div class="slider-track"></div>
        </div>
      </div>
      
      <!-- 텍스트 속도 -->
      <div class="option-group">
        <label for="text-speed" class="option-label">
          텍스트 출력 속도
          <span class="speed-value">{getTextSpeedLabel(textSpeed)}</span>
        </label>
        <div class="slider-container">
          <input
            id="text-speed"
            type="range"
            min="1"
            max="10"
            step="1"
            value={textSpeed}
            on:input={handleTextSpeedChange}
            class="speed-slider"
          />
          <div class="slider-track"></div>
        </div>
      </div>
      
      <!-- 전체화면 모드 -->
      <div class="option-group">
        <label class="option-label">전체화면 모드</label>
        <div class="toggle-container">
          <button 
            class="toggle-button {isFullscreen ? 'active' : ''}"
            on:click={handleFullscreenToggle}
          >
            <div class="toggle-slider"></div>
            <span class="toggle-text">{isFullscreen ? '켜짐' : '꺼짐'}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 닫기 버튼 -->
    <div class="options-actions">
      <button class="close-button" on:click={handleClose}>
        닫기
      </button>
    </div>
  </div>
</div>

<style>
  .options-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }
  
  .options-container {
    background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
    border-radius: 12px;
    padding: 2rem;
    min-width: 350px;
    max-width: 90vw;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .options-title {
    color: white;
    font-size: 1.5rem;
    margin: 0 0 1.5rem 0;
    text-align: center;
    font-weight: 600;
  }
  
  .options-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .option-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .option-label {
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .volume-value, .speed-value {
    color: #4a9eff;
    font-weight: 600;
  }
  
  .slider-container {
    position: relative;
    padding: 0.5rem 0;
  }
  
  .volume-slider, .speed-slider {
    width: 100%;
    height: 6px;
    background: transparent;
    outline: none;
    border-radius: 3px;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }
  
  .volume-slider::-webkit-slider-track, .speed-slider::-webkit-slider-track {
    width: 100%;
    height: 6px;
    background: #444;
    border-radius: 3px;
  }
  
  .volume-slider::-webkit-slider-thumb, .speed-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #4a9eff;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
  }
  
  .volume-slider::-webkit-slider-thumb:hover, .speed-slider::-webkit-slider-thumb:hover {
    transform: scale(1.2);
  }
  
  .volume-slider::-moz-range-track, .speed-slider::-moz-range-track {
    width: 100%;
    height: 6px;
    background: #444;
    border-radius: 3px;
    border: none;
  }
  
  .volume-slider::-moz-range-thumb, .speed-slider::-moz-range-thumb {
    height: 18px;
    width: 18px;
    border-radius: 50%;
    background: #4a9eff;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  .toggle-container {
    display: flex;
    align-items: center;
  }
  
  .toggle-button {
    position: relative;
    width: 80px;
    height: 40px;
    background: #444;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .toggle-button.active {
    background: #4a9eff;
  }
  
  .toggle-slider {
    position: absolute;
    left: 4px;
    width: 32px;
    height: 32px;
    background: white;
    border-radius: 50%;
    transition: transform 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  .toggle-button.active .toggle-slider {
    transform: translateX(40px);
  }
  
  .toggle-text {
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
    z-index: 1;
  }
  
  .options-actions {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
  }
  
  .close-button {
    background: linear-gradient(135deg, #4a9eff 0%, #357abd 100%);
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(74, 158, 255, 0.3);
  }
  
  .close-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(74, 158, 255, 0.4);
  }
  
  .close-button:active {
    transform: translateY(0);
  }
  
  /* 모바일 대응 */
  @media (max-width: 480px) {
    .options-container {
      margin: 1rem;
      padding: 1.5rem;
      min-width: unset;
    }
    
    .options-title {
      font-size: 1.3rem;
    }
    
    .option-label {
      font-size: 0.85rem;
    }
    
    .volume-slider::-webkit-slider-thumb, .speed-slider::-webkit-slider-thumb {
      height: 20px;
      width: 20px;
    }
    
    .toggle-button {
      width: 70px;
      height: 36px;
    }
    
    .toggle-slider {
      width: 28px;
      height: 28px;
    }
    
    .toggle-button.active .toggle-slider {
      transform: translateX(34px);
    }
  }
</style>