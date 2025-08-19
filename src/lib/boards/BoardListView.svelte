<script lang="ts">
	import { moveTo, removeMatching, updateMatching } from '$lib/arrayUtils';
	import { fly } from 'svelte/transition';
	import type { ListData, ListItem } from './board';
	import { flip } from 'svelte/animate';
	import { generateId } from '$lib/id_generator';
	import { cloneDeep, debounce } from 'lodash-es';
	import MyInput from '$lib/common/MyInput.svelte';
	import BoardListItem from './BoardListItem.svelte';

	interface Props {
		data: ListData;
		updateData?: (data: ListData) => void;
	}

	let { data, updateData = () => {} }: Props = $props();

	let newItemLabel = $state('');
	let itemsToShow = $derived(data.list.filter((i) => !i.done || !data.hideDone));

	function updateTitle(newTitle: string) {
		updateData({ ...data, title: newTitle });
	}
	const debouncedUpdateTitle = debounce(updateTitle, 250);

	function updateList(newList: ListItem[]) {
		updateData({ ...data, list: cloneDeep(newList) });
	}

	function newItem() {
		if (newItemLabel === '') return;

		const newListItem: ListItem = { done: false, label: newItemLabel, id: generateId('item') };
		updateList([...data.list, newListItem]);
		newItemLabel = '';
	}

	function inputKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			newItem();
		}
	}

	function onDrop(itemId: string, dropItemId: string) {
		const itemIndex = data.list.findIndex((i) => i.id === itemId);
		const dropItemIndex = data.list.findIndex((i) => i.id === dropItemId);
		if (itemIndex === -1 || dropItemIndex === -1 || itemIndex === dropItemIndex) {
			return; // Invalid indices, do nothing
		}

		updateList(moveTo(data.list, itemIndex, dropItemIndex));
	}
</script>

<div class="card-title">
	<MyInput
		class="input input-sm grow input-ghost text-lg font-bold"
		value={data.title}
		oninput={(t) => debouncedUpdateTitle(t)}
	/>
</div>

<div>
	<button class="btn btn-xs" onclick={() => updateList(data.list.filter((item) => !item.done))}>
		Clear done
	</button>
	<button class="btn btn-xs" onclick={() => updateData({ ...data, hideDone: !data.hideDone })}>
		{data.hideDone ? 'Show done' : 'Hide done'}
	</button>
</div>

<div class="flex w-full flex-col">
	{#each itemsToShow as item (item.id)}
		<div transition:fly animate:flip={{ duration: 300 }}>
			<BoardListItem
				{item}
				updateItem={(value) =>
					updateList(updateMatching(data.list, (d) => d.id === item.id, value))}
				removeItem={() => updateList(removeMatching(data.list, (i) => i.id === item.id))}
				{onDrop}
			/>
		</div>
	{/each}
</div>

<div class="flex flex-row items-center gap-1">
	<span class="w-4"></span>
	<label class="input input-sm w-full rounded-md px-1">
		<button class="btn btn-square font-bold btn-xs btn-info" onclick={() => newItem()}>+</button>
		<input
			type="text"
			class="grow"
			placeholder="New item"
			bind:value={newItemLabel}
			onkeypress={inputKeyPress}
		/>
	</label>
</div>
