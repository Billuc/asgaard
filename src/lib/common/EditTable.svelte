<script lang="ts" generics="Item extends { id: string, [k: string]: any }">
	import { type Snippet } from 'svelte';
	import { debounce, cloneDeep, slice } from 'lodash-es';
	import { flip } from 'svelte/animate';

	interface Props {
		items: Item[];
		columns: { [k in keyof Item]?: string };
		inputs?: { [k in keyof Item]?: Snippet<[string, Item[k]?, ((value: Item[k]) => void)?]> };
		updateItem?: (id: string, value: Item) => void;
		nbColumns?: 3 | 4 | 5;
	}

	const { items, columns, inputs = {}, updateItem = () => {}, nbColumns = 3 }: Props = $props();
	let scrollIndex = $state(0);
	const columnsToShow = $derived(Object.keys(columns).slice(scrollIndex, scrollIndex + nbColumns));

	function doUpdate(id: string, key: keyof Item, value: any) {
		const oldItem = items.find((i) => i.id === id);

		if (!oldItem) {
			console.warn(`Could not find item with id ${id}`);
			return;
		}

		const newItem: Item = cloneDeep(oldItem);
		newItem[key] = value;

		updateItem(id, newItem);
	}

	const debouncedUpdates = $derived.by(() => {
		const debouncedFunctions = new Map<keyof Item, (id: string, value: any) => void>();

		for (const key in columns) {
			debouncedFunctions.set(
				key,
				debounce((id, value) => doUpdate(id, key, value), 300, { maxWait: 2000 })
			);
		}

		return debouncedFunctions;
	});
</script>

<div class="relative">
	<table class={['edit-table', 'table table-zebra', 'table-xs md:table-sm lg:table-md']}>
		<thead>
			<tr>
				{#each columnsToShow as c (c)}
					<th
						class="w-1/3 md:w-1/4 lg:w-1/5"
						style={`max-width: ${(100 / columnsToShow.length).toString()}%`}
						animate:flip={{ duration: 200 }}
					>
						{columns[c]}
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each items as item (item.id)}
				<tr>
					{#each columnsToShow as c (c)}
						<td
							animate:flip={{ duration: 200 }}
							class="w-1/3 md:w-1/4 lg:w-1/5"
							style={`max-width: ${(100 / columnsToShow.length).toString()}%`}
						>
							{@render tableinput(item, c)}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	{#if Object.keys(columns).length > scrollIndex + nbColumns}
		<button
			class="btn absolute top-1/2 -right-2 btn-circle font-bold btn-sm"
			onclick={() => scrollIndex++}
		>
			&gt;
		</button>
	{/if}
	{#if scrollIndex > 0}
		<button
			class="btn absolute top-1/2 -left-2 btn-circle font-bold btn-sm"
			onclick={() => scrollIndex--}
		>
			&lt;
		</button>
	{/if}
</div>

{#snippet tableinput(item: Item, c: keyof Item)}
	{#if c in inputs}
		{@render inputs[c]!(item.id, item[c], (v) => debouncedUpdates.get(c)?.(item.id, v))}
	{:else if typeof item[c] === 'string'}
		<div
			contenteditable
			class="my-input w-full max-w-full overflow-x-auto"
			oninput={(e) => debouncedUpdates.get(c)!(item.id, (e.target! as HTMLDivElement).innerText)}
		>
			{item[c]}
		</div>
	{:else if typeof item[c] === 'number'}
		<input
			type="number"
			value={item[c]}
			class={['my-input', 'input input-ghost', 'input-xs md:input-sm lg:input-md']}
			oninput={(e) =>
				debouncedUpdates.get(c)!(item.id, Number((e.target! as HTMLInputElement).value))}
		/>
	{:else if typeof item[c] === 'boolean'}
		<input
			type="checkbox"
			checked={item[c]}
			class={['checkbox checkbox-primary', 'checkbox-sm md:checkbox-sm lg:checkbox-md']}
			onchange={(e) => debouncedUpdates.get(c)!(item.id, (e.target! as HTMLInputElement).checked)}
		/>
	{/if}
{/snippet}

<style>
	@reference "../../app.css";

	table.edit-table tbody tr td {
		@apply p-1;
	}

	.edit-table div[contenteditable] {
		@apply w-full rounded-field border-none px-2 py-1;
		@apply text-xs md:text-sm lg:text-base;
	}

	.my-input {
		@apply transition-colors outline-none focus:bg-base-200/50;
	}
</style>
