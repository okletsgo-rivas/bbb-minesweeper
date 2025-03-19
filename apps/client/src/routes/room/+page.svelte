<script lang="ts">
	import { onMount } from 'svelte';

	import Tile from '../../lib/Tile.svelte';
	import Chat from '../../lib/Chat.svelte';
	import { connect, field } from '../../lib/store';

	/** @type {{width: number,height:number}} */
	let { width = 9, height = 9 } = $props();

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
