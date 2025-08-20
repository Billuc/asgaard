<script lang="ts">
	import { type BoardItemType, BOARD_ITEM_TYPES } from '$lib/boards/board';

	interface Props {
		createItem: (type: BoardItemType) => void;
	}

	let { createItem }: Props = $props();
	let dropdown: HTMLDetailsElement;

	function create(type: BoardItemType) {
		createItem(type);
		dropdown.open = false;
	}
</script>

<details class="dropdown dropdown-center dropdown-bottom" bind:this={dropdown}>
	<summary class="btn btn-outline btn-sm btn-info">New Card</summary>

	<ul class="dropdown-content menu z-1 w-52 rounded-box bg-base-200 p-2 shadow-sm">
		{#each Object.entries(BOARD_ITEM_TYPES) as [type, data] (type)}
			<li>
				<button onclick={() => create(type as BoardItemType)}>New {data}</button>
			</li>
		{/each}
	</ul>
</details>
