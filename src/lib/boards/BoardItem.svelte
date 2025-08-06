<script lang="ts">
	import { scale } from 'svelte/transition';
	import type { BoardItemData } from './board';
	import { BoardItemType } from './board';
	import BoardListView from './BoardListView.svelte';
	import BoardNoteView from './BoardNoteView.svelte';
	import BoardQuestView from './BoardQuestView.svelte';

	interface Props {
		data: BoardItemData;
		moveBlockUp: () => void;
		moveBlockDown: () => void;
		deleteBlock: () => void;
		updateData: (data: BoardItemData) => void;
		manageMode: boolean;
	}

	let {
		data,
		moveBlockUp,
		moveBlockDown,
		deleteBlock,
		manageMode = $bindable(),
		updateData
	}: Props = $props();
</script>

<div class="card relative mb-4 bg-zinc-700 card-sm">
	{#if manageMode}
		<div class="absolute -top-2 right-4" transition:scale>
			<button class="btn btn-sm" onclick={moveBlockUp}>Up</button>
			<button class="btn btn-sm" onclick={moveBlockDown}>Down</button>
			<button class="btn btn-sm btn-error" onclick={deleteBlock}>Delete block</button>
		</div>
	{/if}
	<div class="card-body">
		{#if data.type === BoardItemType.LIST}
			<BoardListView {data} {updateData} {manageMode}></BoardListView>
		{/if}
		{#if data.type === BoardItemType.NOTE}
			<BoardNoteView {data} {updateData}></BoardNoteView>
		{/if}
		{#if data.type === BoardItemType.QUEST}
			<BoardQuestView {data} {updateData} {manageMode}></BoardQuestView>
		{/if}
	</div>
</div>
