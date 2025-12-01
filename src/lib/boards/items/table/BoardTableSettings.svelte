<script lang="ts">
	import EditTable from '$lib/common/EditTable.svelte';
	import type { TableColumn } from '$lib/boards/board';
	import type { Column } from '$lib/common/table';
	import { generateId } from '$lib/id_generator';
	import { removeMatching, updateMatching } from '$lib/arrayUtils';

	interface Props {
		columns: TableColumn[];
		nbColumns: 2 | 3 | 4 | 5;
		updateColumns: (c: TableColumn[]) => void;
		updateNbColumns: (n: 2 | 3 | 4 | 5) => void;
	}

	const { columns, nbColumns = 3, updateColumns, updateNbColumns }: Props = $props();

	const columnItems = $derived(
		columns.map((c) => ({
			item: c
		}))
	);
	let newColumn = $state<TableColumn>({ id: '', name: '', type: 'string' });

	const columnsForTable: { [k: string]: Column } = {
		name: { label: 'Name' },
		type: { label: 'Type', input: typeSelect },
		actions: { label: 'Actions', input: actions }
	};

	function createColumn() {
		const toInsert = { id: generateId('column'), name: newColumn.name, type: newColumn.type };
		updateColumns([...columns, toInsert]);
	}

	function deleteColumn(id: string) {
		updateColumns(removeMatching(columns, (c) => c.id === id));
	}

	function updateOneCol(col: TableColumn) {
		updateColumns(updateMatching(columns, (c) => c.id === col.id, col));
	}
</script>

<div>
	<h2 class="mb-2 ml-2 text-lg font-bold">Number of columns displayed</h2>

	<select
		class="select select-sm"
		value={nbColumns}
		onchange={(ev) => updateNbColumns(Number(ev.target.value))}
	>
		{#each [2, 3, 4, 5] as i (i)}
			<option selected={i == nbColumns} value={i}>{i}</option>
		{/each}
	</select>

	<h2 class="my-2 ml-2 text-lg font-bold">Columns</h2>

	<EditTable
		items={[...columnItems, { item: newColumn }]}
		columns={columnsForTable}
		onupdate={updateOneCol}
	></EditTable>
</div>

{#snippet typeSelect(
	_id: string,
	value?: 'string' | 'number' | 'boolean',
	updateValue?: (v: 'string' | 'number' | 'boolean') => void
)}
	<select
		class="select select-ghost select-xs"
		{value}
		onchange={(ev) => updateValue?.(ev.target.value)}
	>
		{#each ['string', 'number', 'boolean'] as opt (opt)}
			<option selected={value === opt} value={opt}>{opt}</option>
		{/each}
	</select>
{/snippet}

{#snippet actions(id: string)}
	{#if id === ''}
		<button class="btn btn-xs" onclick={() => createColumn()}>Create</button>
	{:else}
		<button class="btn btn-xs btn-error" onclick={() => deleteColumn(id)}>Delete</button>
	{/if}
{/snippet}
