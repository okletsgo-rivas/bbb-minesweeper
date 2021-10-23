<script lang="ts">
  import { onMount } from "svelte";
  import Tile, { TileType } from "./Tile.svelte";

  export let width;
  export let height;

  const mineRatio = 0.20625; // classic windows xp ratio
  let field = Array.from(Array(width * height)).map((_, i) => ({
    id: i,
    x: i % width,
    y: Math.floor(i / width),
    type: null,
    label: "",
    flag: false,
    ref: null,
    hide: true,
  }));

  onMount(() => {
    reset();
  });

  function reset() {
    field = field.map((_) => ({ ..._, type: null, flag: false, hide: true }));

    let minesToPlace = Math.round(width * height * mineRatio);
    while (minesToPlace > 0) {
      let tile = field[Math.floor(Math.random() * field.length)];
      if (tile.type !== TileType.MINE) {
        tile.type = TileType.MINE;
        tile.label = "X";
        minesToPlace--;
      }
    }
    // field = field;
    const mines = field.filter((_) => _.type === TileType.MINE);
    const noMines = field.filter((_) => _.type !== TileType.MINE);

    noMines.map((tile) => {
      const totalMines = mines.filter(
        (mine) =>
          Math.abs(tile.x - mine.x) <= 1 && Math.abs(tile.y - mine.y) <= 1
      ).length;
      tile.type = totalMines ? TileType.NUMBER : TileType.BLANK;
      tile.label = totalMines ? totalMines.toString() : "&nbsp;";
    });

    field = field;
  }
</script>

<main>
  <div>
    <button on:click={reset}>New Game</button>
  </div>
  <div>
    <div id="field" style={`width: ${width * 45}px`}>
      {#each field as props (props.id)}
        <Tile bind:this={props.ref} {...props} />
      {/each}
    </div>
  </div>
</main>

<style>
  :global(body) {
    background-color: #1f2227;
    font-size: 12px;
    font-family: arial;
  }
</style>
