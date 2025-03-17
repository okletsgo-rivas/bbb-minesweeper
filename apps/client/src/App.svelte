<script lang="ts">
  import { onMount } from "svelte";

  import Tile, { TileType } from "./lib/Tile.svelte";
  import Chat from "./lib/Chat.svelte";
  import { connect, field } from "./store";

  /** @type {{width: number,height:number}} */
  let { width, height } = $props();

  onMount(() => {
    connect();
  });
</script>

<main>
  <div class="field-container">
    <div class="field" style={`width: ${width * 45}px`}>
      {#each $field as tile (tile.id)}
        <Tile data={tile} />
      {/each}
    </div>
  </div>
  <Chat />
</main>

<style>
  :global(body) {
    background-color: #2b2b2b;
    font-size: 12px;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    min-height: 100vh;
    padding: 0;
  }

  main {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .field-container {
    padding: 1rem;
  }

  .field {
    margin: 0 auto;
  }
</style>
