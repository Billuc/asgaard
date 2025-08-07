<script lang="ts">
	import type { Board } from '$lib/boards/board';
	import BoardRow from '$lib/boards/BoardRow.svelte';
	import { BoardStorage } from '$lib/boards/storage';

	async function getFavoriteBoards(): Promise<Board[]> {
		const boards = await BoardStorage.getInstance().getAll();
		return boards.filter((board) => board.favorite);
	}
</script>

<h1 class="text-center text-2xl font-black">Asgaard</h1>

<p class="text-center">Welcome to Asgaard, the ultimate quest management system!</p>

<div class="my-4 text-lg">Your favorite boards</div>

<div class="list">
	{#await getFavoriteBoards()}
		<p>Loading favorites...</p>
	{:then favoriteBoards}
		{#each favoriteBoards as board (board.id)}
			<BoardRow {board}></BoardRow>
		{/each}
	{/await}
</div>
