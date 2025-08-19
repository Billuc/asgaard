<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { BoardItemData } from './board';
	import { BoardItemType } from './board';
	import BoardListView from './BoardListView.svelte';
	import BoardNoteView from './BoardNoteView.svelte';
	import BoardQuestView from './BoardQuestView.svelte';
	import BoardImageView from './BoardImageView.svelte';

	interface Props {
		data: BoardItemData;
		moveBlockUp: () => void;
		moveBlockDown: () => void;
		deleteBlock: () => void;
		updateData: (data: BoardItemData) => void;
		showActions: boolean;
	}

	let { data, moveBlockUp, moveBlockDown, deleteBlock, showActions, updateData }: Props = $props();
</script>

<div class="card relative mb-4 bg-zinc-700 card-sm">
	{#if showActions}
		<div class="absolute -top-2 right-4 flex flex-row gap-1" transition:slide={{ axis: 'x' }}>
			<button class="btn btn-sm" onclick={moveBlockUp}>Up</button>
			<button class="btn btn-sm" onclick={moveBlockDown}>Down</button>
			<button class="btn btn-sm btn-error" onclick={deleteBlock}>Delete block</button>
		</div>
	{/if}
	<div class="card-body">
		{#if data.type === BoardItemType.LIST}
			<BoardListView {data} {updateData} {showActions}></BoardListView>
		{/if}
		{#if data.type === BoardItemType.NOTE}
			<BoardNoteView {data} {updateData}></BoardNoteView>
		{/if}
		{#if data.type === BoardItemType.QUEST}
			<BoardQuestView {data} {updateData} manageMode={showActions}></BoardQuestView>
		{/if}
		{#if data.type === BoardItemType.IMAGE}
			<BoardImageView {data} {updateData}></BoardImageView>
		{/if}
	</div>
</div>
