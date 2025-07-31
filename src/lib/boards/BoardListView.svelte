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

	function updateList(newList: ListItem[]) {
		updateData({ ...data, list: newList });
	}
</script>

<input
	class="card-title"
	value={data.title}
	onchange={(ev) => updateData({ ...data, title: ev.target.value })}
/>

<table class={['table', 'table-zebra', 'table-xs', 'w-fit']}>
	<tbody>
		{#each data.list as item, i (i)}
			{#if !data.hideDone || !item.done}
				<tr transition:fly>
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
						<button class="btn" onclick={() => updateList(swap(data.list, i, i - 1))}
							>Move Up</button
						>
						<button class="btn" onclick={() => updateList(swap(data.list, i, i + 1))}
							>Move Down</button
						>
					</td>
				</tr>
			{/if}
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
