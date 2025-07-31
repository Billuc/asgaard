<script lang="ts">
	import { BoardType as BoardItemType, type BoardItemData } from '$lib/boards/board';
	import { boardStorage } from '$lib/boards/storage';
	import { generateId } from '$lib/id_generator';
	import type { PageProps } from './$types';
	import { cloneDeep } from '$lib/clone';
	import BoardListView from '$lib/boards/BoardListView.svelte';
	import BoardNoteView from '$lib/boards/BoardNoteView.svelte';
	import BoardQuestView from '$lib/boards/BoardQuestView.svelte';
	import { goto } from '$app/navigation';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	let { data }: PageProps = $props();
	let board = $state(data.board);

	$effect(() => {
		let clonedBoard = cloneDeep(board);
		if (clonedBoard == data.board && clonedBoard.items == data.board.items) return; // Nothing changed (supposedly)

		boardStorage.upsert(clonedBoard);
	});

	function newItem(itemType: BoardItemType) {
		let itemData: BoardItemData;

		switch (itemType) {
			case BoardItemType.LIST:
				itemData = {
					type: BoardItemType.LIST,
					title: 'New list',
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

		board = {
			...board,
			items: [...board.items, { id: generateId('item'), data: itemData }]
		};
	}

	async function deleteBoard() {
		await boardStorage.delete(board.id);
		goto('/boards', { state: { message: 'Board deleted successfully' }, invalidateAll: true });
	}

	function deleteBlock(itemId: string) {
		board = {
			...board,
			items: board.items.filter((item) => item.id !== itemId)
		};
	}

	function moveBlockUp(itemId: string) {
		const index = board.items.findIndex((item) => item.id === itemId);
		if (index > 0) {
			const newItems = [...board.items];
			[newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
			board = { ...board, items: newItems };
		}
	}

	function moveBlockDown(itemId: string) {
		const index = board.items.findIndex((item) => item.id === itemId);
		if (index < board.items.length - 1) {
			const newItems = [...board.items];
			[newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
			board = { ...board, items: newItems };
		}
	}
</script>

<div>
	<a href="/boards" class="btn">Return to boards</a>
	<input class="input input-xl input-ghost" value={board.title} />

	<div>
		<button class="btn" onclick={deleteBoard}>Delete board</button>
	</div>

	<div>
		{#each board.items as item (item.id)}
			<div class="card mb-4 bg-zinc-700" animate:flip={{ duration: 300 }} transition:fly>
				<div class="card-actions">
					<button class="btn" onclick={() => deleteBlock(item.id)}>Delete block</button>
					<button class="btn" onclick={() => moveBlockUp(item.id)}>Move up</button>
					<button class="btn" onclick={() => moveBlockDown(item.id)}>Move down</button>
				</div>
				<div class="card-body">
					{#if item.data.type === BoardItemType.LIST}
						<BoardListView data={item.data} updateData={(d) => (item.data = d)}></BoardListView>
					{/if}
					{#if item.data.type === BoardItemType.NOTE}
						<BoardNoteView data={item.data} updateData={(d) => (item.data = d)}></BoardNoteView>
					{/if}
					{#if item.data.type === BoardItemType.QUEST}
						<BoardQuestView data={item.data} updateData={(d) => (item.data = d)}></BoardQuestView>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<div>
		<button class="btn" onclick={() => newItem(BoardItemType.LIST)}>New list</button>
		<button class="btn" onclick={() => newItem(BoardItemType.NOTE)}>New note</button>
		<button class="btn" onclick={() => newItem(BoardItemType.QUEST)}>New quest</button>
	</div>
</div>
