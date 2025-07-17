<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  
  export let text: string = '';
  export let speed: number = 50; // 글자당 지연 시간 (ms)
  export let autoStart: boolean = true;
  export let skipOnClick: boolean = true;
  
  const dispatch = createEventDispatcher<{
    start: void;
    complete: void;
    skip: void;
  }>();
  
  let displayText = '';
  let currentIndex = 0;
  let isTyping = false;
  let isComplete = false;
  let typingTimeout: number | null = null;
  let containerElement: HTMLElement;
  
  $: if (text && autoStart && text !== displayText) {
    startTyping();
  }
  
  function startTyping() {
    if (isTyping) stopTyping();
    
    displayText = '';
    currentIndex = 0;
    isComplete = false;
    isTyping = true;
    
    // 타이핑 시작 이벤트 발생
    dispatch('start');
    
    typeNextCharacter();
  }
  
  function typeNextCharacter() {
    if (currentIndex >= text.length) {
      completeTyping();
      return;
    }
    
    displayText += text[currentIndex];
    currentIndex++;
    
    typingTimeout = window.setTimeout(() => {
      typeNextCharacter();
    }, speed);
  }
  
  function stopTyping() {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    isTyping = false;
  }
  
  function completeTyping() {
    stopTyping();
    displayText = text;
    isComplete = true;
    dispatch('complete');
  }
  
  function skipTyping() {
    if (isTyping) {
      completeTyping();
      dispatch('skip');
    }
  }
  
  function handleClick(event: MouseEvent) {
    if (skipOnClick) {
      event.stopPropagation();
      skipTyping();
    }
  }
  
  function handleTouchEnd(event: TouchEvent) {
    if (skipOnClick) {
      event.stopPropagation();
      event.preventDefault();
      skipTyping();
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (skipOnClick && (event.code === 'Space' || event.code === 'Enter')) {
      event.preventDefault();
      event.stopPropagation();
      skipTyping();
    }
  }
  
  // 외부에서 호출할 수 있는 메서드들
  export function restart() {
    startTyping();
  }
  
  export function skip() {
    skipTyping();
  }
  
  export function getIsTyping() {
    return isTyping;
  }
  
  export function getIsComplete() {
    return isComplete;
  }
  
  onMount(() => {
    if (containerElement && skipOnClick) {
      document.addEventListener('keydown', handleKeydown);
    }
  });
  
  onDestroy(() => {
    stopTyping();
    document.removeEventListener('keydown', handleKeydown);
  });
</script>

<div 
  bind:this={containerElement}
  class="typewriter-container"
  on:click={handleClick}
  on:touchend={handleTouchEnd}
  role="button"
  tabindex="0"
>
  {displayText}
  {#if isTyping}
    <span class="cursor">|</span>
  {/if}
</div>

<style>
  .typewriter-container {
    position: relative;
    cursor: pointer;
  }
  
  .cursor {
    animation: blink 1s infinite;
    opacity: 1;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
</style>