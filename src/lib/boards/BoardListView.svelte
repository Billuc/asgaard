<script lang="ts">
	import { removeAt, mapAt, swap } from '$lib/arrayUtils';
	import { fly, scale, slide } from 'svelte/transition';
	import type { ListData, ListItem } from './board';
	import { flip } from 'svelte/animate';
	import { generateId } from '$lib/id_generator';

	interface Props {
		showActions: boolean;
		data: ListData;
		updateData?: (data: ListData) => void;
	}

	let { showActions, data, updateData = () => {} }: Props = $props();

	let newItemLabel = $state('');

	let itemsToShow = $derived(data.list.filter((i) => !i.done || !data.hideDone));

	function updateList(newList: ListItem[]) {
		updateData({ ...data, list: newList });
	}
</script>

<div class="card-title">
	<input
		class="input input-sm grow input-ghost text-lg font-bold"
		value={data.title}
		onchange={(ev) => updateData({ ...data, title: ev.target.value })}
	/>

	<button class="btn btn-sm" onclick={() => updateList(data.list.filter((item) => !item.done))}>
		Clear completed
	</button>
	<button class="btn btn-sm" onclick={() => updateData({ ...data, hideDone: !data.hideDone })}>
		{data.hideDone ? 'Show done' : 'Hide done'}
	</button>
</div>

<div class="flex w-full flex-col">
	{#each itemsToShow as item, i (item.id)}
		<div
			class="flex flex-row items-center gap-2 px-1"
			transition:fly
			animate:flip={{ duration: 300 }}
		>
			<input
				type="checkbox"
				class="checkbox checkbox-primary"
				checked={item.done}
				onchange={() => updateList(mapAt(data.list, i, (d) => ({ ...d, done: !d.done })))}
			/>

			<input
				class="input input-sm grow input-ghost"
				value={item.label}
				oninput={(ev) => updateList(mapAt(data.list, i, (d) => ({ ...d, label: ev.target.value })))}
			/>

			{#if showActions}
				<div transition:slide={{ axis: 'x' }} class="flex flex-row gap-1">
					<button class="btn inline btn-xs" onclick={() => updateList(swap(data.list, i, i - 1))}>
						Up
					</button>
					<button class="btn inline btn-xs" onclick={() => updateList(swap(data.list, i, i + 1))}>
						Down
					</button>
					<button class="btn btn-xs btn-error" onclick={() => updateList(removeAt(data.list, i))}>
						Delete
					</button>
				</div>
			{/if}
		</div>
	{/each}
</div>

<label class="input input-sm w-full rounded-md px-1">
	<button
		class="btn btn-square font-bold btn-xs btn-info"
		onclick={() =>
			updateList([...data.list, { done: false, label: newItemLabel, id: generateId('item') }])}
	>
		+
	</button>
	<input type="text" class="grow" placeholder="New item" bind:value={newItemLabel} />
</label>
