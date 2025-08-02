<script lang="ts">
	import { removeAt, mapAt, swap } from '$lib/arrayUtils';
	import { fly } from 'svelte/transition';
	import type { ListData, ListItem } from './board';
	import { flip } from 'svelte/animate';

	interface Props {
		data: ListData;
		updateData?: (data: ListData) => void;
	}

	let { data, updateData = () => {} }: Props = $props();

	let itemsToShow = $derived(data.list.filter((i) => !i.done || !data.hideDone));

	function updateList(newList: ListItem[]) {
		updateData({ ...data, list: newList });
	}
</script>

<input
	class="input input-sm input-ghost text-lg font-bold"
	value={data.title}
	onchange={(ev) => updateData({ ...data, title: ev.target.value })}
/>

<div class="flex w-full flex-col">
	{#each itemsToShow as item, i (i)}
		<div class="flex flex-row items-center gap-2" transition:fly animate:flip>
			<div>
				<button class="btn inline btn-outline btn-xs">Up</button>
				<button class="btn inline btn-outline btn-xs">Down</button>
			</div>

			<input type="checkbox" class="checkbox checkbox-primary" checked={item.done} />

			<input class="input input-sm grow input-ghost" value={item.label} />

			<button class="btn btn-xs btn-error"> Delete </button>
		</div>
	{/each}
</div>

<label class="input input-sm w-full">
	<button class="btn btn-square font-bold btn-xs btn-info">+</button>
	<input type="text" class="grow" placeholder="New item" />
</label>

<table class={['table', 'table-zebra', 'table-xs', 'w-fit']}>
	<tbody>
		{#each itemsToShow as item, i (i)}
			<tr transition:fly animate:flip>
				<td>
					<input
						type="checkbox"
						class="checkbox"
						checked={item.done}
						onchange={() => updateList(mapAt(data.list, i, (d) => ({ ...d, done: !d.done })))}
					/>
				</td>
				<td>
					<input
						class="input input-sm"
						value={item.label}
						oninput={(ev) =>
							updateList(mapAt(data.list, i, (d) => ({ ...d, label: ev.target.value })))}
					/>
				</td>
				<td>
					<button class="btn" onclick={() => updateList(removeAt(data.list, i))}> Delete </button>
					<button class="btn" onclick={() => updateList(swap(data.list, i, i - 1))}>Move Up</button>
					<button class="btn" onclick={() => updateList(swap(data.list, i, i + 1))}
						>Move Down</button
					>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<div class="card-actions">
	<button class="btn" onclick={() => updateList([...data.list, { done: false, label: '' }])}>
		New item
	</button>
	<button class="btn" onclick={() => updateList(data.list.filter((item) => !item.done))}>
		Clear completed
	</button>
	<button class="btn" onclick={() => updateData({ ...data, hideDone: !data.hideDone })}>
		{data.hideDone ? 'Show done' : 'Hide done'}
	</button>
</div>
