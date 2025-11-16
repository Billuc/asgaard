<script lang="ts">
	import type { TableData } from '$lib/boards/board';
	import { debounce } from 'lodash-es';
	import MyInput from '$lib/common/MyInput.svelte';
	import { generateId } from '$lib/id_generator';
	import { mapAt, removeAt, updateAt, moveTo } from '$lib/arrayUtils';
	import BoardTableHead from './BoardTableHead.svelte';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import BoardTableRow from './BoardTableRow.svelte';
	import EditTable from '$lib/common/EditTable.svelte';

	interface Props {
		data: TableData;
		updateData?: (data: TableData) => void;
		showActions?: boolean;
	}

	const { data, updateData = () => {}, showActions = false }: Props = $props();
	const headers = $derived(data.rows[0]?.cells || []);
	const headerColumns = $derived(
		headers.reduce((acc: any, curr, i) => {
			acc[i.toString()] = { label: curr };
			return acc;
		}, {})
	);
	const nbColumns = $derived(headers.length);
	const rows = $derived(data.rows.slice(1));
	const rowItems = $derived(
		rows.map((r) => ({
			item: r.cells.reduce(
				(acc: any, curr, i) => {
					acc[i.toString()] = curr;
					return acc;
				},
				{ id: r.id }
			)
		}))
	);

	function updateTitle(newTitle: string) {
		updateData({ ...data, title: newTitle });
	}
	const debouncedUpdateTitle = debounce(updateTitle, 250);

	function newRow() {
		const newRow = { id: generateId('row'), cells: [] };
		updateData({ ...data, rows: [...data.rows, newRow] });
	}

	function newColumn() {
		updateData({
			...data,
			rows: mapAt(data.rows, 0, (row) => ({ ...row, cells: [...row.cells, ''] }))
		});
	}

	function updateCell(rowIndex: number, colIndex: number, value: string) {
		const newRows = [...data.rows];
		newRows[rowIndex].cells[colIndex] = value;
		updateData({ ...data, rows: newRows });
	}

	function deleteRow(rowIndex: number) {
		updateData({ ...data, rows: removeAt(data.rows, rowIndex) });
	}

	function deleteColumn(colIndex: number) {
		updateData({
			...data,
			rows: data.rows.map((row) => ({
				...row,
				cells: removeAt(row.cells, colIndex)
			}))
		});
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
</div>

<EditTable columns={headerColumns} items={rowItems} />

<div class="overflow-x-auto">
	<table class="table-pin-rows table table-auto table-xs">
		{#if data.rows.length > 0}
			<thead>
				<tr>
					<BoardTableHead class="text-center">
						<span class="text-base">&equiv;</span>
					</BoardTableHead>
					{#each { length: nbColumns }, i}
						<BoardTableHead class="relative">
							<MyInput
								class="input input-sm input-ghost focus:outline-none"
								value={headers[i] || ''}
								oninput={(t) => updateCell(0, i, t)}
							/>

							{#if showActions}
								<button
									class="btn absolute top-0 right-0 btn-circle h-4 w-4 btn-xs"
									onclick={() => deleteColumn(i)}
									transition:fade={{ duration: 200 }}
								>
									&times;
								</button>
							{/if}
						</BoardTableHead>
					{/each}
					{#if showActions}
						<BoardTableHead class="text-center">
							<button class="btn btn-block opacity-60 btn-ghost btn-sm" onclick={() => newColumn()}>
								+ New col
							</button>
						</BoardTableHead>
					{/if}
				</tr>
			</thead>
		{/if}
		<tbody>
			{#each rows as row, rowIndex (row.id)}
				<div class="contents" animate:flip transition:fly>
					<BoardTableRow
						{row}
						{nbColumns}
						removeRow={() => deleteRow(rowIndex + 1)}
						updateRow={(value) =>
							updateData({ ...data, rows: updateAt(data.rows, rowIndex + 1, value) })}
						{onDrop}
						{showActions}
					/>
				</div>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan={nbColumns + (showActions ? 2 : 1)} class="text-center">
					<button class="btn btn-block opacity-60 btn-ghost btn-sm" onclick={() => newRow()}>
						+ New row
					</button>
				</td>
			</tr>
		</tfoot>
	</table>
</div>
