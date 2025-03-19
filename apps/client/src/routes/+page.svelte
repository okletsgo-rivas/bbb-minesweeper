<script>
	import { goto } from '$app/navigation';
	import { connect, username } from '$lib/store';

	const size = { width: 9, height: 9 };

	async function join() {
		try {
			const { roomId, sessionId } = await connect($username, size);
			goto(`/room/${roomId}/${sessionId}`);
		} catch (e) {
			console.error(e);
		}
	}
</script>

<h1>Multiplayer Minesweeper!</h1>

<div class="username">
	<label>
		Username:
		<input name="user_name" bind:value={$username} />
	</label>
	<button on:click={join}>Join!</button>
</div>

<style>
	h1 {
		text-align: center;
	}
	.username {
		margin: 0 auto;
		width: 25%;
	}

	input {
		width: 100%;
	}
</style>
