<script lang="ts">
	import { mapMatching, removeMatching } from '$lib/arrayUtils';
	import { fly, slide } from 'svelte/transition';
	import type { ListData, ListItem } from './board';
	import { flip } from 'svelte/animate';
	import { generateId } from '$lib/id_generator';
	import { cloneDeep, debounce } from 'lodash-es';
	import { listItemDown, listItemUp } from './functions';

	interface Props {
		showActions: boolean;
		data: ListData;
		updateData?: (data: ListData) => void;
	}

	let { showActions, data, updateData = () => {} }: Props = $props();

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
</script>

<div class="card-title">
	<input
		class="input input-sm grow input-ghost text-lg font-bold"
		value={data.title}
		oninput={(ev) => debouncedUpdateTitle(ev.target.value)}
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
		<div
			class="flex flex-row items-center gap-2 px-1"
			transition:fly
			animate:flip={{ duration: 300 }}
		>
			<input
				type="checkbox"
				class="checkbox checkbox-primary"
				checked={item.done}
				onchange={() =>
					updateList(
						mapMatching(
							data.list,
							(d) => d.id === item.id,
							(d) => ({ ...d, done: !d.done })
						)
					)}
			/>

			<input
				class="input input-sm grow input-ghost"
				value={item.label}
				oninput={(ev) =>
					updateList(
						mapMatching(
							data.list,
							(d) => d.id === item.id,
							(d) => ({ ...d, label: ev.target.value })
						)
					)}
			/>

			{#if showActions}
				<div transition:slide={{ axis: 'x' }} class="flex flex-row gap-1">
					<button
						class="btn inline btn-xs"
						onclick={() => updateList(listItemUp(data, item.id).list)}
					>
						Up
					</button>
					<button
						class="btn inline btn-xs"
						onclick={() => updateList(listItemDown(data, item.id).list)}
					>
						Down
					</button>
					<button
						class="btn btn-xs btn-error"
						onclick={() => updateList(removeMatching(data.list, (i) => i.id === item.id))}
					>
						Delete
					</button>
				</div>
			{/if}
		</div>
	{/each}
</div>

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
