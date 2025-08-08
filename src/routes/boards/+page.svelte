<script lang="ts">
	import type { Board } from '$lib/boards/board';
	import BoardRow from '$lib/boards/BoardRow.svelte';
	import NewBoard from '$lib/boards/NewBoard.svelte';
	import { BoardStorage } from '$lib/boards/storage';

	async function getBoards(): Promise<Board[]> {
		return await BoardStorage.getInstance().getAll();
	}
</script>

<svelte:head>
	<title>Asgaard - Boards</title>
</svelte:head>

<div>
	<a href="/" class="btn">Back to Home</a>
	<h1 class="mt-2 mb-8 text-center text-2xl font-black">Boards</h1>

	<div class="my-4 text-center">
		<NewBoard />
	</div>

	<div class="list my-4 rounded-box shadow-md">
		{#await getBoards()}
			{#each [1, 2, 3] as i (i)}
				<div class="list-row">
					<div class="h-6 w-6 skeleton bg-base-content/30"></div>
					<div>
						<div class="h-3 w-32 skeleton bg-base-content/30"></div>
					</div>
					<div class="h-6 w-6 skeleton bg-base-content/30"></div>
				</div>
			{/each}
		{:then boards}
			{#each boards as board (board.id)}
				<BoardRow {board} />
			{/each}
		{/await}
	</div>
</div>
