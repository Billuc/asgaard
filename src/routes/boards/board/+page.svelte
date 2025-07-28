<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div>
	<a href="/boards" class="btn">Return to boards</a>
	<input class="input input-xl input-ghost" value={data.board.title} />

	{#each data.board.items as item, i (item.id)}
		<div>{item.title}</div>
	{/each}
</div>
