<script lang="ts">
	import type { Board } from '$lib/boards/board';
	import { BoardStorage } from '$lib/boards/storage';

	async function getBoards(): Promise<Board[]> {
		return await BoardStorage.getInstance().getAll();
	}
</script>

<div>
	<h1>Boards</h1>
	<a href="/" class="btn">Back to Home</a>

	<table class="table table-zebra">
		<tbody>
			{#await getBoards()}
				{#each [1, 2, 3] as i (i)}
					<tr>
						<td>
							<div class="h-3 w-32 skeleton bg-base-content/50"></div>
						</td>
					</tr>
				{/each}
			{:then boards}
				{#each boards as board (board.id)}
					<tr><td><a href={`/boards/board?id=${board.id}`}>{board.title}</a></td></tr>
				{/each}
			{/await}
		</tbody>
	</table>

	<a href="/boards/create" class="btn">Create a new board</a>
</div>
