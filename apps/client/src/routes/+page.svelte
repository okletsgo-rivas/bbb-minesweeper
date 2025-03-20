<script lang="ts">
	import { serverRoom, clearState, connect, username, EDifficulty } from '$lib/store';
	import { onMount } from 'svelte';

	const difficultyList = new Map([
		[EDifficulty.BEGINNER, 'Beginner - 9x9 - 10 mines'],
		[EDifficulty.INTERMEDIATE, 'Intermediate - 16x16 - 40 mines'],
		[EDifficulty.EXPERT, 'Expert - 16x16 - 99 mines']
	]);

	let difficulty = $state<string>(EDifficulty.BEGINNER);

	onMount(() => {
		clearState();
	});

	async function join() {
		connect($username, difficulty);
	}
</script>

<div class="start">
	<div class="title">
		<span class="line1">Multiplayer</span><br />
		<span class="line2">MINESWEEPER</span><br />
		<span class="face">🙂</span>
	</div>

	<div class="username">
		<label>
			<input name="user_name" placeholder="Username" bind:value={$username} />
		</label>
		<button on:click={join}>PLAY</button>
	</div>

	<div class="settings">
		<select bind:value={difficulty}>
			{#each difficultyList as [K, V]}
				<option value={K}>{V}</option>
			{/each}
		</select>
	</div>
</div>

<style>
	.start {
		margin: 0 auto;
		padding-top: 5rem;
		width: 50%;
		text-align: center;
	}

	.face {
		font-size: 4rem;
	}
	.line1 {
		font-size: 1rem;
		font-style: italic;
	}
	.line2 {
		font-size: 2rem;
		font-weight: 800;
	}
	.username {
		margin: 2rem 0;
	}

	input,
	button {
		width: 100%;
		text-align: center;
		box-sizing: border-box;
	}
	input {
		margin-bottom: 1rem;
		padding: 0.5rem 0;
		font-size: 2rem;
	}
	button {
		padding: 0.5rem 0;
		color: white;
		background-color: green;
		border: none;
		cursor: pointer;
	}

	select {
		width: 100%;
		font-family:
			Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console', 'Lucida Sans Typewriter',
			'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Liberation Mono', 'Nimbus Mono L', Monaco,
			'Courier New', Courier, monospace;
	}
</style>
