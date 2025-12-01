<script lang="ts">
	import type { TableColumn, TableData } from '$lib/boards/board';
	import { debounce } from 'lodash-es';
	import MyInput from '$lib/common/MyInput.svelte';
	import { generateId } from '$lib/id_generator';
	import { moveTo, removeMatching, updateMatching } from '$lib/arrayUtils';
	import EditTable from '$lib/common/EditTable.svelte';
	import SettingsButton from '$lib/common/SettingsButton.svelte';
	import type { Column } from '$lib/common/table';
	import BoardTableSettings from './BoardTableSettings.svelte';

	interface Props {
		data: TableData;
		updateData?: (data: TableData) => void;
		showActions?: boolean;
	}

	const { data, updateData = () => {}, showActions = false }: Props = $props();
	const headerColumns = $derived(
		data.columns.reduce((acc: { [k: string]: Column }, col) => {
			acc[col.id] = { label: col.name, type: col.type };
			return acc;
		}, {})
	);
	const rowItems = $derived(
		data.rows.map((r) => ({
			item: {
				id: r.id,
				...r.cells
			}
		}))
	);

	const actionColumn: Column = { label: 'Actions', input: actions };
	let newRowItem = $state<{ id: string; [k: string]: any }>({ id: '', ...generateCells() });

	function updateTitle(newTitle: string) {
		updateData({ ...data, title: newTitle });
	}
	const debouncedUpdateTitle = debounce(updateTitle, 250);

	function generateCells() {
		return Object.fromEntries(data.columns.map((c) => [c.name, generateCellValue(c)]));
	}

	function generateCellValue(col: TableColumn) {
		switch (col.type) {
			case 'string':
				return '';
			case 'number':
				return 0;
			case 'boolean':
				return false;
		}
	}

	function newRow() {
		let { id: _, ...cells } = newRowItem;
		const newRow = { id: generateId('row'), cells: cells };
		updateData({ ...data, rows: [...data.rows, newRow] });
	}

	function updateRow(value: { id: string; [k: string]: any }) {
		const { id, ...cells } = value;

		if (id !== '') {
			const newRows = updateMatching(data.rows, (r) => r.id === id, { id, cells });
			updateData({ ...data, rows: newRows });
		} else {
			newRowItem = value;
		}
	}

	function deleteRow(id: string) {
		updateData({ ...data, rows: removeMatching(data.rows, (r) => r.id === id) });
	}

	function updateColumns(cols: TableColumn[]) {
		updateData({ ...data, columns: cols });
	}

	function updateNbColumns(nbCols: 2 | 3 | 4 | 5) {
		updateData({ ...data, nbColumns: nbCols });
	}

	function onDrop(rowId: string, dropRowId: string) {
		const rowIndex = data.rows.findIndex((r) => r.id === rowId);
		const dropRowIndex = data.rows.findIndex((r) => r.id === dropRowId);

		if (rowIndex === -1 || dropRowIndex === -1 || rowIndex === dropRowIndex) {
			return; // Invalid indices, do nothing
		}

		updateData({ ...data, rows: moveTo(data.rows, rowIndex, dropRowIndex) });
	}
</script>

<div class="card-title">
	<MyInput
		class="input input-sm grow input-ghost text-lg font-bold"
		value={data.title}
		oninput={(t) => debouncedUpdateTitle(t)}
	/>
	<SettingsButton>
		<BoardTableSettings
			columns={data.columns}
			nbColumns={data.nbColumns}
			{updateColumns}
			{updateNbColumns}
		></BoardTableSettings>
	</SettingsButton>
</div>

<EditTable
	columns={{ ...headerColumns, actions: actionColumn }}
	items={[...rowItems, { item: newRowItem }]}
	onupdate={(item) => updateRow(item)}
	nbColumns={data.nbColumns}
/>

{#snippet actions(id: string)}
	{#if id === ''}
		<button class="btn btn-xs" onclick={() => newRow()}>Create</button>
	{:else}
		<button class="btn btn-xs btn-error" onclick={() => deleteRow(id)}>Delete</button>
	{/if}
{/snippet}
