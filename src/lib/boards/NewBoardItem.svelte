<script lang="ts">
	import { type BoardItemType, BOARD_ITEM_TYPES } from '$lib/boards/board';

	interface Props {
		createItem: (type: BoardItemType) => void;
	}

	let { createItem }: Props = $props();
</script>

<div class="dropdown dropdown-center dropdown-bottom">
	<div tabindex="0" role="button" class="btn btn-outline btn-sm btn-info">New Item</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul tabindex="0" class="dropdown-content menu z-1 w-52 rounded-box bg-base-100 p-2 shadow-sm">
		{#each Object.entries(BOARD_ITEM_TYPES) as [type, data] (type)}
			<li>
				<button onclick={() => createItem(type as BoardItemType)}>New {data}</button>
			</li>
		{/each}
	</ul>
</div>
