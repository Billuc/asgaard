<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { BoardItemData } from '../board';
	import { BoardItemType } from '../board';
	import BoardListView from './list/BoardListView.svelte';
	import BoardNoteView from './note/BoardNoteView.svelte';
	import BoardQuestView from './quest/BoardQuestView.svelte';
	import BoardImageView from './image/BoardImageView.svelte';
	import BoardTableView from './table/BoardTableView.svelte';
	import type { Style } from '$lib/styles/style';

	interface Props {
		data: BoardItemData;
		style: Style;
		moveBlockUp: () => void;
		moveBlockDown: () => void;
		deleteBlock: () => void;
		updateData: (data: BoardItemData) => void;
		showActions: boolean;
	}

	let { data, style, moveBlockUp, moveBlockDown, deleteBlock, showActions, updateData }: Props =
		$props();
</script>

<div
	class={[
		style.flatItems ? '' : 'card bg-zinc-700 card-sm',
		style.flatItems ? 'mb-6' : 'mb-4',
		'relative',
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
	<div class={['card-body', style.flatItems ? 'p-0' : '']}>
		{#if data.type === BoardItemType.LIST}
			<BoardListView {data} {updateData} {showActions}></BoardListView>
		{:else if data.type === BoardItemType.NOTE}
			<BoardNoteView {data} {updateData}></BoardNoteView>
		{:else if data.type === BoardItemType.QUEST}
			<BoardQuestView {data} {updateData} manageMode={showActions}></BoardQuestView>
		{:else if data.type === BoardItemType.IMAGE}
			<BoardImageView {data} {updateData}></BoardImageView>
		{:else if data.type === BoardItemType.TABLE}
			<BoardTableView {data} {updateData} {showActions}></BoardTableView>
		{:else}
			<div class="text-center text-gray-400">Unsupported item: {data}</div>
		{/if}
	</div>
</div>
