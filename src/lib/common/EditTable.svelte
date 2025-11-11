<script lang="ts" generics="Item extends { id: string, [k: string]: any }">
	import { type Snippet } from 'svelte';
	import { debounce, cloneDeep } from 'lodash-es';
	import { flip } from 'svelte/animate';

	interface Column {
		label: string;
		input?: Snippet<[string, any?, ((value: any) => void)?]>;
		disabled?: boolean;
	}

	interface ItemData {
		item: Item;
		disabled?: boolean;
	}

	interface Props {
		items: ItemData[];
		columns: { [k: string]: Column };
		onupdate?: (value: Item) => void;
		nbColumns?: 2 | 3 | 4 | 5;
	}

	const { items, columns, onupdate = () => {}, nbColumns = 3 }: Props = $props();
	let scrollIndex = $state(0);
	const columnsToShow = $derived(Object.keys(columns).slice(scrollIndex, scrollIndex + nbColumns));

	const classes = $derived.by(() => {
		switch (columnsToShow.length) {
			case 2:
				return {
					grid: 'grid-cols-2'
				};
			case 3:
				return {
					grid: 'grid-cols-3'
				};
			case 4:
				return {
					grid: 'grid-cols-4'
				};
			case 5:
				return {
					grid: 'grid-cols-5'
				};
			default:
				return {
					grid: 'grid-cols-1'
				};
		}
	});

	function doUpdate(id: string, key: keyof Item, value: any) {
		const indexToUpdate = items.findIndex((i) => i.item.id === id);

		if (indexToUpdate === -1) {
			console.warn(`Could not find item with id ${id}`);
			return;
		}

		const newItem = cloneDeep(items[indexToUpdate].item);
		newItem[key] = value;
		onupdate(newItem);
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

<div class="relative px-2">
	<div class={['edit-table', 'grid', classes.grid]}>
		<div
			class={[
				'grid grid-cols-subgrid',
				'col-span-full',
				'even:bg-base-300/30',
				'border-b border-b-base-content/10'
			]}
		>
			{#each columnsToShow as c (c)}
				<div
					animate:flip={{ duration: 300 }}
					class={['px-2 py-1', 'text-sm md:text-base', 'font-bold text-base-content/60']}
				>
					{columns[c]?.label}
				</div>
			{/each}
		</div>
		{#each items as item (item.item.id)}
			<div class={['grid grid-cols-subgrid', 'col-span-full', 'even:bg-base-300/50']}>
				{#each columnsToShow as c (c)}
					<div animate:flip={{ duration: 300 }} class="self-center px-2 py-1">
						{@render tableinput(item, c)}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	{#if Object.keys(columns).length > scrollIndex + nbColumns}
		<button
			class="btn absolute top-1/2 -right-2 btn-circle font-bold btn-outline btn-sm btn-info"
			onclick={() => scrollIndex++}
		>
			&gt;
		</button>
	{/if}
	{#if scrollIndex > 0}
		<button
			class="btn absolute top-1/2 -left-2 btn-circle font-bold btn-outline btn-sm btn-info"
			onclick={() => scrollIndex--}
		>
			&lt;
		</button>
	{/if}
</div>

{#snippet tableinput(item: ItemData, c: string)}
	{#if columns[c]?.input}
		{@render columns[c]!.input(item.item.id, item.item[c], (v) =>
			debouncedUpdates.get(c)?.(item.item.id, v)
		)}
	{:else if typeof item.item[c] === 'string'}
		<div
			contenteditable={item.disabled !== true && columns[c]?.disabled !== true}
			class="my-input string-input"
			oninput={(e) =>
				debouncedUpdates.get(c)!(item.item.id, (e.target! as HTMLDivElement).innerText)}
		>
			{item.item[c]}
		</div>
	{:else if typeof item.item[c] === 'number'}
		<input
			type="number"
			value={item.item[c]}
			class={['my-input', 'input input-ghost', 'input-xs md:input-sm lg:input-md']}
			oninput={(e) =>
				debouncedUpdates.get(c)!(item.item.id, Number((e.target! as HTMLInputElement).value))}
			disabled={item.disabled === true || columns[c]?.disabled === true}
		/>
	{:else if typeof item.item[c] === 'boolean'}
		<input
			type="checkbox"
			checked={item.item[c]}
			class={['checkbox checkbox-primary', 'checkbox-sm md:checkbox-sm lg:checkbox-md']}
			onchange={(e) =>
				debouncedUpdates.get(c)!(item.item.id, (e.target! as HTMLInputElement).checked)}
			disabled={item.disabled === true || columns[c]?.disabled === true}
		/>
	{/if}
{/snippet}

<style>
	@reference "../../app.css";

	.edit-table .string-input {
		@apply w-full rounded-field border-none px-2 py-1;
		@apply text-xs md:text-sm lg:text-base;
	}

	.edit-table .string-input[contenteditable='false'] {
		@apply opacity-40;
	}

	.my-input {
		@apply transition-colors outline-none focus:bg-base-200/50;
	}
</style>
