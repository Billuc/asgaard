<script lang="ts">
	import { BoardType as BoardItemType, type BoardItemData } from '$lib/boards/board';
	import { boardStorage } from '$lib/boards/storage';
	import { generateId } from '$lib/id_generator';
	import type { PageProps } from './$types';
	import { cloneDeep } from '$lib/clone';
	import BoardListView from '$lib/boards/BoardListView.svelte';
	import BoardNoteView from '$lib/boards/BoardNoteView.svelte';

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
</script>

<div>
	<a href="/boards" class="btn">Return to boards</a>
	<input class="input input-xl input-ghost" value={board.title} />

	{#each board.items as item (item.id)}
		{#if item.data.type === BoardItemType.LIST}
			<BoardListView data={item.data} updateData={(d) => (item.data = d)}></BoardListView>
		{/if}
		{#if item.data.type === BoardItemType.NOTE}
			<BoardNoteView data={item.data} updateData={(d) => (item.data = d)}></BoardNoteView>
		{/if}
	{/each}

	<div class="btn" onclick={() => newItem(BoardItemType.LIST)}>New list</div>
	<div class="btn" onclick={() => newItem(BoardItemType.NOTE)}>New note</div>
	<div class="btn" onclick={() => newItem(BoardItemType.QUEST)}>New quest</div>
</div>
