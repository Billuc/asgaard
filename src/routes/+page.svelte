<script lang="ts">
	import type { Board } from '$lib/boards/board';
	import BoardRow from '$lib/boards/BoardRow.svelte';
	import { BoardStorage } from '$lib/boards/storage';
	import { asHref, Routes } from '$lib/routes/routes';

	async function getFavoriteBoards(): Promise<Board[]> {
        const boardStorage = await BoardStorage.getInstance();
		const boards = await boardStorage.getAll();
		return boards.filter((board) => board.favorite);
	}
</script>

<svelte:head>
	<title>Asgaard - Home</title>
</svelte:head>

<div class="container mx-auto px-8 pt-4">
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

	<div class="my-4 text-lg">Notes</div>
	<a href={asHref(Routes.Notes)} class="btn btn-outline">Go to Notes</a>
</div>
