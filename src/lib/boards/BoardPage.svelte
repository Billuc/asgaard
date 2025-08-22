<script lang="ts">
	import { cloneDeep, debounce } from 'lodash-es';
	import type { Board } from './board';
	import NewBoardItem from './NewBoardItem.svelte';
	import { BoardStorage } from './storage';
	import { flip } from 'svelte/animate';
	import { fly, slide } from 'svelte/transition';
	import BoardItem from './BoardItem.svelte';
	import { goto } from '$app/navigation';
	import { deleteBlock, moveBlockDown, moveBlockUp, newItem, updateItem } from './functions';
	import ActionsButton from '$lib/common/ActionsButton.svelte';
	import MyInput from '$lib/common/MyInput.svelte';
	import { asHref, Routes } from '$lib/routes/routes';

	interface Props {
		board: Board;
	}

	const { board: initialBoard }: Props = $props();
	let showActions = $state(false);
	let board = $state(initialBoard);
	const boardStorage = BoardStorage.getInstance();

	const updateBoard = async (newBoard: Board) => {
		await boardStorage.upsert(cloneDeep(newBoard));
		let updatedBoard = await boardStorage.get(newBoard.id);
		if (updatedBoard) board = updatedBoard;

		console.debug('Board updated:', $state.snapshot(board));
	};
	const debouncedUpdateBoard = debounce(updateBoard, 250);

	async function deleteBoard() {
		if (!confirm(`Here be dragons ! This board will be deleted permanently !`)) return;

		await boardStorage.delete(board.id);
		goto(asHref(Routes.Boards), { state: { message: 'Board deleted successfully' } });
	}

	function exportBoard() {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(board));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', `${board.title}.json`);
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}
</script>

<div class="text-center">
	<MyInput
		class="input-xl input-ghost text-center font-bold"
		value={board.title}
		oninput={(title) => debouncedUpdateBoard({ ...board, title })}
	/>
</div>

<div class="mb-4 flex flex-row flex-wrap justify-center gap-2">
	<ActionsButton bind:show={showActions}>
		<div
			class="flex flex-row flex-wrap justify-center gap-2"
			transition:slide={{ axis: 'x', duration: 250 }}
		>
			<button class="btn btn-outline btn-sm btn-info" onclick={exportBoard}>Export board</button>
			<NewBoardItem createItem={(type) => updateBoard(newItem(board, type))} />
			<button class="btn btn-outline btn-sm btn-error" onclick={deleteBoard}>Delete board</button>
		</div>
	</ActionsButton>
</div>

<div>
	{#each board.items as item (item.id)}
		<div animate:flip={{ duration: 300 }} transition:fly>
			<BoardItem
				data={item.data}
				moveBlockUp={() => updateBoard(moveBlockUp(board, item.id))}
				moveBlockDown={() => updateBoard(moveBlockDown(board, item.id))}
				deleteBlock={() => updateBoard(deleteBlock(board, item.id))}
				updateData={(d) => updateBoard(updateItem(board, item.id, d))}
				{showActions}
			></BoardItem>
		</div>
	{/each}
</div>
