<script lang="ts">
  import { serverRoom, chat } from "../store";

  let chatInput = $state();
  let chatBox: HTMLDivElement;

  $effect(() => {
    $chat;
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  function keyup(e) {
    if (e.keyCode !== 13 || !chatInput.trim()) return;
    $serverRoom?.send("message", chatInput);
    chatInput = "";
  }
</script>

<div class="chat">
  <div bind:this={chatBox} class="messages" onchange={() => {}}>
    {#each $chat as msg}
      <p>{msg}</p>
    {/each}
  </div>
  <input bind:value={chatInput} type="text" id="chat-input" onkeyup={keyup} />
</div>

<style>
  .chat {
    background-color: #000;
    flex-grow: 1;
    margin-top: auto;
    display: flex;
    flex-direction: column;
    border-top: 1px solid #1a1a1a;
  }

  .messages {
    padding: 10px 20px 0 20px;
    overflow-y: scroll;
    color: #ddca7e;

    overflow-y: auto;
    scrollbar-width: auto;
    scrollbar-color: #1a1a1a;
  }
  /* ===== Scrollbar CSS ===== */
  /* Chrome, Edge, and Safari */
  .messages::-webkit-scrollbar {
    width: 16px;
  }

  .messages::-webkit-scrollbar-thumb {
    background-color: #212121;
    border-radius: 10px;
    border: 0px none #ffffff;
  }

  input {
    margin-top: auto;
    margin-left: 10px;
    margin-right: 10px;
    background-color: #222222;
    color: #ddca7e;
    border-radius: 5px;
  }
</style>
