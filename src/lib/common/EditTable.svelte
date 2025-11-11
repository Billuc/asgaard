<script lang="ts" generics="Item extends { id: string, [k: string]: any }">
	import { type Snippet } from 'svelte';
	import { debounce, cloneDeep } from 'lodash-es';

	interface Props {
		items: Item[];
		columns: { [k in keyof Item]?: string };
		inputs?: { [k in keyof Item]?: Snippet<[string, Item[k]?, ((value: Item[k]) => void)?]> };
		updateItem?: (id: string, value: Item) => void;
	}

	const { items, columns, inputs = {}, updateItem = () => {} }: Props = $props();

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

<table class={['edit-table', 'table', 'table-xs md:table-sm lg:table-md']}>
	<thead>
		<tr>
			{#each Object.entries(columns) as c (c[0])}
				<th class="w-1/3 md:w-1/4 lg:w-1/5">{c[1]}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each items as item (item.id)}
			<tr>
				{#each Object.keys(columns) as c}
					<td>
						{#if c in inputs}
							{@render inputs[c]!(item.id, item[c], (v) => debouncedUpdates.get(c)?.(item.id, v))}
						{:else if typeof item[c] === 'string'}
							<div
								contenteditable
								class="my-input"
								oninput={(e) =>
									debouncedUpdates.get(c)!(item.id, (e.target! as HTMLDivElement).innerText)}
							>
								{item[c]}
							</div>
						{:else if typeof item[c] === 'number'}
							<input
								type="number"
								value={item[c]}
								class={['my-input', 'input', 'input-xs md:input-sm lg:input-md']}
								oninput={(e) =>
									debouncedUpdates.get(c)!(item.id, Number((e.target! as HTMLInputElement).value))}
							/>
						{:else if typeof item[c] === 'boolean'}
							<input
								type="checkbox"
								checked={item[c]}
								class={['checkbox checkbox-primary', 'checkbox-sm md:checkbox-sm lg:checkbox-md']}
								onchange={(e) =>
									debouncedUpdates.get(c)!(item.id, (e.target! as HTMLInputElement).checked)}
							/>
						{/if}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

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
