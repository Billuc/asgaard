<script lang="ts">
	import { cloneDeep } from 'lodash-es';
	import type { Board } from './board';
	import { BoardStorage } from './storage';
	import { asHref, Routes } from '$lib/routes/routes';

	interface Props {
		board: Board;
	}

	let { board: initialBoard }: Props = $props();
	let board = $state(initialBoard);

	async function toggleFavorite() {
		let updatedBoard = cloneDeep(board);
		updatedBoard.favorite = !updatedBoard.favorite;

		await BoardStorage.getInstance().upsert(updatedBoard);
		board = updatedBoard;
	}
</script>

<div class="list-row bg-base-300 hover:bg-base-200">
	<a href={asHref(Routes.Board, { id: board.id })}>
		<div class="avatar avatar-placeholder">
			<div class="w-6 rounded-md bg-base-content">
				<span class="text-lg text-base-100">{board.title.charAt(0).toUpperCase()}</span>
			</div>
		</div>
	</a>
	<a href={asHref(Routes.Board, { id: board.id })}>
		{board.title}
	</a>
	<div>
		<label class="swap">
			<input type="checkbox" checked={board.favorite} onchange={() => toggleFavorite()} />
			<span class="swap-off text-xl leading-6 text-warning">&#x2730;</span>
			<span class="swap-on text-xl leading-6 text-warning">&#x2605;</span>
		</label>
	</div>
</div>
