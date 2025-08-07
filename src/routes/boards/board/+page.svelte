<script lang="ts">
	import { type Board } from '$lib/boards/board';
	import { BoardStorage } from '$lib/boards/storage';
	import { page } from '$app/state';
	import BoardPage from '$lib/boards/BoardPage.svelte';
	import BoardPageSkeleton from '$lib/boards/BoardPageSkeleton.svelte';

	async function getBoard(): Promise<Board> {
		const id = page.url.searchParams.get('id');

		if (!id) throw new Error('An ID is required !');

		const board = await BoardStorage.getInstance().get(id);
		console.log('Board with ID ', id, board);

		if (!board) throw new Error('Could not find a board with this ID !');

		return board;
	}
</script>

<div>
	<a href="/boards" class="btn">Return to boards</a>
	{#await getBoard()}
		<BoardPageSkeleton />
	{:then board}
		<BoardPage {board} />
	{:catch error}
		<p class="text-error">Error: {error.message}</p>
	{/await}
</div>
