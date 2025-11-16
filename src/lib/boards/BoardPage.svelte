<script lang="ts">
	import { cloneDeep, debounce } from 'lodash-es';
	import type { Board } from './board';
	import { BoardStorage } from './storage';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import BoardItem from './items/BoardItem.svelte';
	import { goto } from '$app/navigation';
	import { deleteBlock, moveBlockDown, moveBlockUp, newItem, updateItem } from './functions';
	import MyInput from '$lib/common/MyInput.svelte';
	import { asHref, Routes } from '$lib/routes/routes';
	import BoardBorder from './BoardBorder.svelte';
	import { ASGAARD_STYLES, DEFAULT_STYLE, type Style } from '$lib/styles/style';
	import { StyleStorage } from '$lib/styles/storage';
	import BoardActions from './BoardActions.svelte';

	interface Props {
		board: Board;
	}

	const { board: initialBoard }: Props = $props();
	let style = $state(DEFAULT_STYLE);
	let showActions = $state(false);
	let board = $state(initialBoard);
	const boardStorage = BoardStorage.getInstance();

	$effect(() => {
		StyleStorage.getInstance()
			.get(board.styleId)
			.then((s) => {
				if (s) {
					style = s;
				} else {
					const asgaardStyle = ASGAARD_STYLES.find((s) => s.id === board.styleId);

					if (asgaardStyle) {
						style = asgaardStyle;
					}
				}
			})
			.catch(() => {});
	});

	const updateBoard = async (newBoard: Board) => {
		await boardStorage.upsert(cloneDeep(newBoard));
		let updatedBoard = await boardStorage.get(newBoard.id);
		if (updatedBoard) board = updatedBoard;

		console.debug('Board updated:', $state.snapshot(board));
	};
	const debouncedUpdateBoard = debounce(updateBoard, 250);

	async function deleteBoard() {
		if (!confirm(`Here be dragons ! This board will be deleted permanently !`)) return;

		await boardStorage.delete(board.id);
		goto(asHref(Routes.Boards), { state: { message: 'Board deleted successfully' } });
	}

	function exportBoard() {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(board));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute('href', dataStr);
		downloadAnchorNode.setAttribute('download', `${board.title}.json`);
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}

	function setStyle(newStyle: Style) {
		updateBoard({ ...board, styleId: newStyle.id }).then(() => {
			style = newStyle;
		});
	}
</script>

<BoardActions
	{style}
	onexport={exportBoard}
	ondelete={deleteBoard}
	onnewitem={(type) => updateBoard(newItem(board, type))}
	onchangestyle={setStyle}
/>

<div class="pt-px">
	<BoardBorder boardStyle={style}>
		<div class="text-center">
			<MyInput
				class="input-xl input-ghost text-center font-bold"
				value={board.title}
				oninput={(title) => debouncedUpdateBoard({ ...board, title })}
			/>
		</div>

		<div>
			{#each board.items as item (item.id)}
				<div animate:flip={{ duration: 300 }} transition:fly>
					<BoardItem
						data={item.data}
						{style}
						moveBlockUp={() => updateBoard(moveBlockUp(board, item.id))}
						moveBlockDown={() => updateBoard(moveBlockDown(board, item.id))}
						deleteBlock={() => updateBoard(deleteBlock(board, item.id))}
						updateData={(d) => updateBoard(updateItem(board, item.id, d))}
						{showActions}
					></BoardItem>
				</div>
			{/each}
		</div>
	</BoardBorder>
</div>
