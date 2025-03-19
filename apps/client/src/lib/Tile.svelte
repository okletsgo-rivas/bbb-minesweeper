<script module lang="ts">
	export const TileType = {
		MINE: 'MINE',
		NUMBER: 'NUMBER',
		BLANK: 'BLANK'
	};

	type FieldType = 'flag' | 'hide' | 'player';
	type FieldValue = boolean | string | null;
	interface IChange {
		dynamicIndex: number | undefined;
		field: FieldType;
		op: number;
		previousValue: FieldValue;
		value: FieldValue;
	}

	export interface ITileState {
		flag: boolean | null;
		hide: boolean | null;
		player: string | null;
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
	import { onMount } from 'svelte';

	import { serverRoom } from '$lib/store';
	import Flag from './Flag.svelte';

	let { data } = $props();
	let { id, index, x, y, type, label, ...changeable } = data;
	let tileState = $state<ITileState>(changeable);
	let userId = $derived($serverRoom.sessionId);

	onMount(() => {
		data.onChange = (change: IChange[]) => {
			change.forEach((_) => {
				tileState[_.field] = _.value;
			});
		};
	});

	export function reset() {
		tileState.hide = true;
	}

	function action(e: MouseEvent, action: string) {
		e.preventDefault();
		$serverRoom?.send('tile', { id, action });
	}
</script>

<svelte:body />

<button
	class="tile"
	class:flipped={!tileState.hide}
	onclick={(e) => action(e, 'select')}
	oncontextmenu={(e) => action(e, 'flag')}
>
	{#if !tileState.hide}
		{#if type === TileType.MINE}
			<div class="mine" style:background-color={userId === tileState.player ? '#ccf' : '#fcc'}>
				<img src="./mine.png" alt="Mine" />
			</div>
		{:else}
			<span class={'num-' + label}>{@html label}</span>
		{/if}
	{:else if tileState.flag}
		<Flag color={userId === tileState.player ? 'blue' : 'red'} />
	{/if}
</button>

<style>
	.tile {
		margin: 0;
		padding: 0.375rem;
		float: left;
		color: #444;
		font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
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

	.mine {
		margin: -0.375rem;
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
