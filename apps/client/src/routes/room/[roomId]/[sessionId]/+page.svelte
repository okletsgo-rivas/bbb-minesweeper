<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	import Tile from '$lib/Tile.svelte';
	import Chat from '$lib/Chat.svelte';
	import { reconnect, field, serverRoom } from '$lib/store';

	let { data }: PageProps = $props();

	onMount(() => {
		if (!$serverRoom) {
			reconnect(data.roomId, data.sessionId);
		}
	});
</script>

<main>
	<div class="field-container">
		<div class="field" style={`width: ${Math.sqrt($field.length) * 45}px`}>
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
