<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';

	import Tile from '$lib/Tile.svelte';
	import Chat from '$lib/Chat.svelte';
	import { reconnect, field } from '$lib/store';

	const width = 9;
	let { data }: PageProps = $props();

	onMount(() => {
		reconnect(data.roomId, data.sessionId);
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
