<script lang="ts">
  import { onMount } from "svelte";

  import Tile, { TileType } from "./Tile.svelte";
  import Chat from "./Chat.svelte";
  import { connect, field } from "./store";

  /** @type {{width: number,height:number}} */
  let { width, height } = $props();

  onMount(() => {
    connect();
  });
</script>

<main>
  <div style="overflow: hidden;">
    <div id="field" style={`width: ${width * 45}px`}>
      {#each $field as props (props.id)}
        <Tile bind:this={props.ref} {...props} />
      {/each}
    </div>
  </div>
  <Chat />
</main>

<style>
  :global(body) {
    background-color: #2b2b2b;
    font-size: 12px;
    font-family: arial;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    padding: 0;
  }

  main {
    padding: 15px;
  }
</style>
