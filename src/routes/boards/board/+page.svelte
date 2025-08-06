<script lang="ts">
	import { BoardItemType, type Board, type BoardItemData } from '$lib/boards/board';
	import { boardStorage } from '$lib/boards/storage';
	import { generateId } from '$lib/id_generator';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { debounce, cloneDeep } from 'lodash-es';
	import { updateAt } from '$lib/arrayUtils';
	import BoardItem from '$lib/boards/BoardItem.svelte';
	import NewBoardItem from '$lib/boards/NewBoardItem.svelte';

	let { data }: PageProps = $props();
	let board = $state(data.board);
	let manageMode = $state(false);

	const updateBoard = async (newBoard: Board) => {
		await boardStorage.upsert(cloneDeep(newBoard));
		let updatedBoard = await boardStorage.get(newBoard.id);
		if (updatedBoard) board = updatedBoard;

		console.debug('Board updated:', $state.snapshot(board));
	};

	const debouncedUpdateBoard = debounce(updateBoard, 250);

	async function newItem(itemType: BoardItemType) {
		let itemData: BoardItemData;

		switch (itemType) {
			case BoardItemType.LIST:
				itemData = {
					type: BoardItemType.LIST,
					title: 'New list',
					hideDone: false,
					list: [{ done: false, label: 'New item' }]
				};
				break;
			case BoardItemType.NOTE:
				itemData = { type: BoardItemType.NOTE, note: 'New note' };
				break;
			case BoardItemType.QUEST:
				itemData = { type: BoardItemType.QUEST, questId: '' };
				break;
		}

		await updateBoard({
			...board,
			items: [...board.items, { id: generateId('item'), data: itemData }]
		});
	}

	async function deleteBoard() {
		await boardStorage.delete(board.id);
		goto('/boards', { state: { message: 'Board deleted successfully' }, invalidateAll: true });
	}

	async function deleteBlock(itemId: string) {
		await updateBoard({
			...board,
			items: board.items.filter((item) => item.id !== itemId)
		});
	}

	async function moveBlockUp(itemId: string) {
		const index = board.items.findIndex((item) => item.id === itemId);
		if (index > 0) {
			const newItems = [...board.items];
			[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
			updateBoard({ ...board, items: newItems });
		}
	}

	async function moveBlockDown(itemId: string) {
		const index = board.items.findIndex((item) => item.id === itemId);
		if (index < board.items.length - 1) {
			const newItems = [...board.items];
			[newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
			updateBoard({ ...board, items: newItems });
		}
	}

	async function updateItem(itemId: string, newData: BoardItemData) {
		const itemIndex = board.items.findIndex((item) => item.id === itemId);
		if (itemIndex !== -1) {
			await updateBoard({
				...board,
				items: updateAt(board.items, itemIndex, { ...board.items[itemIndex], data: newData })
			});
		}
	}
</script>

<div>
	<a href="/boards" class="btn">Return to boards</a>
	<input
		class="input input-xl input-ghost"
		value={board.title}
		oninput={(ev) => debouncedUpdateBoard({ ...board, title: ev.target.value })}
	/>

	<div class="mb-4 flex flex-row justify-center gap-2">
		<button class="btn btn-outline btn-sm btn-warning" onclick={() => (manageMode = !manageMode)}>
			Manage
		</button>
		<button class="btn btn-outline btn-sm btn-error" onclick={deleteBoard}>Delete board</button>
		<NewBoardItem createItem={newItem} />
	</div>

	<div>
		{#each board.items as item (item.id)}
			<div animate:flip={{ duration: 300 }} transition:fly>
				<BoardItem
					data={item.data}
					moveBlockUp={() => moveBlockUp(item.id)}
					moveBlockDown={() => moveBlockDown(item.id)}
					deleteBlock={() => deleteBlock(item.id)}
					updateData={(d) => updateItem(item.id, d)}
					{manageMode}
				></BoardItem>
			</div>
		{/each}
	</div>
</div>
