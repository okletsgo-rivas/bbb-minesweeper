<script module lang="ts">
  export const TileType = {
    MINE: "MINE",
    NUMBER: "NUMBER",
    BLANK: "BLANK",
  };
</script>

<script lang="ts">
  import { preventDefault } from "svelte/legacy";
  import { serverRoom } from "./store";

  interface Props {
    id: number;
    x: number;
    y: number;
    type: string;
    label: string;
    flag?: boolean;
    hide: boolean;
  }

  let { id, x, y, type, label, flag, hide }: Props = $props();

  export function reset() {
    hide = true;
  }

  function action(type: string) {
    console.log("client", id, type);
    switch (type) {
      case "select":
        $serverRoom?.send("tile", { id, action: "select" });
        break;
      case "flag":
        $serverRoom?.send("tile", { id, action: "flag" });
        break;
      default:
        console.log("action not found");
    }
    // room.send("message", chatInput);
  }

  let el = $state();
</script>

<svelte:body />

<button
  bind:this={el}
  class="tile"
  class:flipped={!hide}
  onclick={() => action("select")}
  oncontextmenu={preventDefault(() => action("flag"))}
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
</button>

<style>
  .tile {
    margin: 0;
    padding: 0.375rem;
    float: left;
    color: #444;
    font-size: 2rem;
    cursor: pointer;
    outline: 1px solid #444;
    width: 45px;
    height: 45px;
    text-align: center;
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
