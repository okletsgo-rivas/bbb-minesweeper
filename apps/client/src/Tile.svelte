<script module lang="ts">
  export const TileType = {
    MINE: "MINE",
    NUMBER: "NUMBER",
    BLANK: "BLANK",
  };

  type FieldType = "flag" | "hide";
  interface IChange {
    dynamicIndex: number | undefined;
    field: FieldType;
    op: number;
    previousValue: boolean | string;
    value: boolean | null;
  }

  export interface ITileState {
    flag: boolean;
    hide: boolean;
  }
  export interface ITile extends ITileState {
    id: string;
    index: number;
    x: number;
    y: number;
    type: string;
    label: string;
    onChange?: (change: IChange[]) => void;
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  import { serverRoom } from "./store";

  let { data } = $props();
  let { id, index, x, y, type, label, ...changeable } = data;
  let tileState = $state<ITileState>(changeable);

  onMount(() => {
    data.onChange = (change: IChange[]) => {
      change.forEach((_) => {
        tileState[_.field] = _.value || false;
      });
    };
  });

  export function reset() {
    tileState.hide = true;
  }

  function action(e: MouseEvent, type: string) {
    e.preventDefault();

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
  class:flipped={!tileState.hide}
  onclick={(e) => action(e, "select")}
  oncontextmenu={(e) => action(e, "flag")}
>
  {#if !tileState.hide}
    {#if type === TileType.MINE}
      <img src="./mine.png" alt="Mine" />
    {:else}
      <span class={"num-" + label}>{@html label}</span>
    {/if}
  {:else if tileState.flag}
    <img src="./flag.png" alt="Flag" />
  {/if}
</button>

<style>
  .tile {
    margin: 0;
    padding: 0.375rem;
    float: left;
    color: #444;
    font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
    font-size: 2rem;
    line-height: 0;
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

  .num-1 {
    color: #0201f8;
  }
  .num-2 {
    color: #007e00;
  }
  .num-3 {
    color: #ff0100;
  }
  .num-4 {
    color: #030083;
  }
  .num-5 {
    color: #7f0201;
  }
  .num-6 {
    color: #008183;
  }
  .num-7 {
    color: #000101;
  }
  .num-8 {
    color: #818180;
  }
</style>
