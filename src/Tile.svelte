<script context="module" lang="ts">
  export const TileType = {
    MINE: "MINE",
    NUMBER: "NUMBER",
    BLANK: "BLANK",
  };
</script>

<script lang="ts">
  export let id: number;
  export let x: number;
  export let y: number;
  export let type: string;
  export let label: string;
  export let flag: boolean = false;
  export let hide: boolean;

  export function reset() {
    hide = true;
  }

  let el;
</script>

<svelte:body />

<div
  bind:this={el}
  class="tile"
  class:flipped={!hide}
  on:click={() => (hide = false)}
  on:contextmenu|preventDefault={() => (flag = !flag)}
>
  {#if !hide}
    {#if type === TileType.MINE}
      <img src="./mine.png" alt="Mine" />
    {:else}
      <span>{@html label}</span>
    {/if}
  {:else if flag}
    <img src="./flag.png" alt="Flag" />
  {/if}
</div>

<style>
  .tile {
    float: left;
    color: #444;
    font-size: 2rem;
    cursor: pointer;
    outline: 1px solid #444;
    width: 45px;
    height: 45px;
    text-align: center;
    line-height: 45px;
    background-color: #ccc;
  }

  .tile img {
    width: 100%;
  }

  .tile.flipped {
    background-color: #fff;
    pointer-events: none;
  }
</style>
