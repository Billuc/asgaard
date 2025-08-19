<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { BoardItemData } from './board';
	import { BoardItemType } from './board';
	import BoardListView from './BoardListView.svelte';
	import BoardNoteView from './BoardNoteView.svelte';
	import BoardQuestView from './BoardQuestView.svelte';
	import BoardImageView from './BoardImageView.svelte';
	import BoardTableView from './BoardTableView.svelte';

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

<div
	class={[
		'card  bg-zinc-700 card-sm',
		'relative',
		'mb-4',
		showActions ? 'mt-6' : 'mt-0',
		'transition-all duration-200'
	]}
>
	{#if showActions}
		<div class="absolute -top-4 right-4 flex flex-row gap-1" transition:slide={{ axis: 'x' }}>
			<button class="btn btn-sm" onclick={moveBlockUp}>Up</button>
			<button class="btn btn-sm" onclick={moveBlockDown}>Down</button>
			<button class="btn btn-sm btn-error" onclick={deleteBlock}>Delete card</button>
		</div>
	{/if}
	<div class="card-body">
		{#if data.type === BoardItemType.LIST}
			<BoardListView {data} {updateData}></BoardListView>
		{:else if data.type === BoardItemType.NOTE}
			<BoardNoteView {data} {updateData}></BoardNoteView>
		{:else if data.type === BoardItemType.QUEST}
			<BoardQuestView {data} {updateData} manageMode={showActions}></BoardQuestView>
		{:else if data.type === BoardItemType.IMAGE}
			<BoardImageView {data} {updateData}></BoardImageView>
		{:else if data.type === BoardItemType.TABLE}
			<BoardTableView {data} {updateData}></BoardTableView>
		{:else}
			<div class="text-center text-gray-400">Unsupported item: {data}</div>
		{/if}
	</div>
</div>
