<script lang="ts">
	let { data } = $props();
</script>

<div>
	<h1>Boards</h1>
	<a href="/" class="btn">Back to Home</a>

	<table class="table table-zebra">
		<tbody>
			{#each data.boards as board (board.id)}
				<tr><td><a href={`/boards/board?id=${board.id}`}>{board.title}</a></td></tr>
			{/each}
		</tbody>
	</table>

	<a href="/boards/create">Create a new board</a>
</div>
