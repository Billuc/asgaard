<script lang="ts">
	import type { TableRow } from './board';
	import BoardTableCell from './BoardTableCell.svelte';
	import MyInput from '$lib/common/MyInput.svelte';
	import { enableDragDropTouch } from '@dragdroptouch/drag-drop-touch';

	let dragging: boolean = $state(false);

	interface Props {
		row: TableRow;
		nbColumns: number;
		updateRow?: (item: TableRow) => void;
		removeRow?: () => void;
		onDrop?: (itemId: string, dropItemId: string) => void;
		showActions?: boolean;
	}

	let {
		row,
		nbColumns,
		updateRow = () => {},
		removeRow = () => {},
		onDrop = () => {},
		showActions = false
	}: Props = $props();

	function dragStart(event: DragEvent) {
		// The data we want to make available when the element is dropped
		const data = { rowId: row.id };
		event.dataTransfer!.setData('text/plain', JSON.stringify(data));
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		const json = event.dataTransfer!.getData('text/plain');
		const { rowId } = JSON.parse(json);
		onDrop(rowId, row.id);
	}

	function updateCell(colIndex: number, t: string): void {
		const newCells = [...row.cells];
		newCells[colIndex] = t;
		updateRow({ ...row, cells: newCells });
	}

	$effect(() => {
		enableDragDropTouch();
	});
</script>

<tr
	draggable={dragging}
	ondrop={(event) => drop(event)}
	ondragstart={(event) => dragStart(event)}
	ondragover={(ev) => {
		ev.preventDefault();
	}}
	ondragenter={() => false}
	ondragleave={() => false}
>
	<BoardTableCell class="text-center">
		<span
			class="cursor-grab text-base"
			onpointerdown={() => (dragging = true)}
			onpointerup={() => (dragging = false)}
		>
			&equiv;
		</span>
	</BoardTableCell>

	{#each { length: nbColumns }, colIndex}
		<BoardTableCell>
			<MyInput
				class="input input-sm min-w-[60px] input-ghost focus:outline-none"
				value={row.cells[colIndex] || ''}
				oninput={(t) => updateCell(colIndex, t)}
			/>
		</BoardTableCell>
	{/each}

	{#if showActions}
		<BoardTableCell class="text-center">
			<button class="btn btn-outline btn-xs btn-error" onclick={removeRow}>Delete</button>
		</BoardTableCell>
	{/if}
</tr>
