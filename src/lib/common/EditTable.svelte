<script lang="ts" generics="Item extends { id: string, [k: string]: any }">
	import { debounce, cloneDeep } from 'lodash-es';
	import { flip } from 'svelte/animate';
	import type { Column, ItemData } from './table';
	import { SvelteMap } from 'svelte/reactivity';
	import StringInput from './StringInput.svelte';

	interface Props {
		items: ItemData<Item>[];
		columns: { [k: string]: Column };
		onupdate?: (value: Item) => void;
		nbColumns?: 2 | 3 | 4 | 5;
	}

	const { items, columns, onupdate = () => {}, nbColumns = 3 }: Props = $props();
	let scrollIndex = $state(0);
	const columnKeys = $derived(Object.keys(columns));
	const columnCount = $derived(Math.min(columnKeys.length, nbColumns));
	const columnsToShow = $derived(columnKeys.slice(scrollIndex, scrollIndex + columnCount));

	const classes = $derived.by(() => {
		switch (columnCount) {
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
		const debouncedFunctions = new SvelteMap<keyof Item, (id: string, value: any) => void>();

		for (const key in columns) {
			debouncedFunctions.set(
				key,
				debounce((id, value) => doUpdate(id, key, value), 400, { maxWait: 2000 })
			);
		}

		return debouncedFunctions;
	});
	let test = $state('test');
</script>

<div class="relative">
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
			<div
				class={['grid grid-cols-subgrid', 'col-span-full', 'even:bg-base-300/50']}
				animate:flip={{ duration: 300 }}
			>
				{#each columnsToShow as c (c)}
					<div animate:flip={{ duration: 300 }} class="self-center">
						{@render tableinput(item, c)}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	{#if Object.keys(columns).length > scrollIndex + nbColumns}
		<div class={['absolute', 'top-1/2 -right-2', '-translate-y-1/2']}>
			<button
				class="btn btn-circle font-bold btn-outline btn-xs btn-info md:btn-sm"
				onclick={() => scrollIndex++}
			>
				&gt;
			</button>
		</div>
	{/if}
	{#if scrollIndex > 0}
		<div class={['absolute', 'top-1/2 -left-2', '-translate-y-1/2']}>
			<button
				class="btn btn-circle font-bold btn-outline btn-xs btn-info md:btn-sm"
				onclick={() => scrollIndex--}
			>
				&lt;
			</button>
		</div>
	{/if}
</div>

{#snippet tableinput(item: ItemData<Item>, c: string)}
	{#if columns[c]?.input}
		{@render columns[c]!.input(
			item.item.id,
			item.item[c],
			(v) => debouncedUpdates.get(c)?.(item.item.id, v),
			item.disabled === true || columns[c]?.disabled === true
		)}
	{:else if columns[c]?.type !== undefined}
		{@render defaultInput(columns[c]?.type, item, c)}
	{:else}
		{@render defaultInput(typeof item.item[c], item, c)}
	{/if}
{/snippet}

{#snippet defaultInput(type: string, item: ItemData<Item>, c: string)}
	{#if type === 'number'}
		<input
			type="number"
			value={item.item[c]}
			class={['my-input', 'input input-ghost', 'input-xs md:input-sm lg:input-md']}
			oninput={(e) =>
				debouncedUpdates.get(c)!(item.item.id, Number((e.target! as HTMLInputElement).value))}
			disabled={item.disabled === true || columns[c]?.disabled === true}
		/>
	{:else if type === 'boolean'}
		<div class="px-2">
			<input
				type="checkbox"
				checked={item.item[c]}
				class={['checkbox checkbox-primary', 'checkbox-sm md:checkbox-sm lg:checkbox-md']}
				onchange={(e) =>
					debouncedUpdates.get(c)!(item.item.id, (e.target! as HTMLInputElement).checked)}
				disabled={item.disabled === true || columns[c]?.disabled === true}
			/>
		</div>
	{:else}
		<StringInput
			disabled={item.disabled === true || columns[c]?.disabled === true}
			value={item.item[c]}
			oninput={(v) => debouncedUpdates.get(c)!(item.item.id, v)}
			immediate
		/>
	{/if}
{/snippet}

<style>
	@reference "../../app.css";

	.my-input {
		@apply transition-colors outline-none focus:bg-base-200/50;
	}
</style>
