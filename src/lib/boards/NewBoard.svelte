<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateId } from '$lib/id_generator';
	import { asHref, Routes } from '$lib/routes/routes';
	import type { Board } from './board';
	import { BoardStorage } from './storage';

	async function createBoard() {
		const newBoard: Board = {
			id: generateId('board'),
			title: 'New Board',
			items: [],
			favorite: false
		};
		await BoardStorage.getInstance().upsert(newBoard);
		goto(asHref(Routes.Board, { id: newBoard.id }), { state: { message: 'New board created!' } });
	}
</script>

<button onclick={() => createBoard()} class="btn">Create a new board</button>
