<script lang="ts">
	import ActionsButton from '$lib/common/ActionsButton.svelte';
	import Dialog from '$lib/common/Dialog.svelte';
	import type { Style } from '$lib/styles/style';
	import StyleSelect from '$lib/styles/StyleSelect.svelte';
	import { BOARD_ITEM_TYPES, BoardItemType } from './board';

	interface Props {
		style: Style;
		onexport: () => void;
		ondelete: () => void;
		onnewitem: (type: BoardItemType) => void;
		onchangestyle: (style: Style) => void;
	}

	const { style, onexport, ondelete, onnewitem, onchangestyle }: Props = $props();
	let newItemOpen = $state(false);
	let changeStyleOpen = $state(false);

	function newItem(type: BoardItemType) {
		onnewitem(type);
		newItemOpen = false;
	}

	function changeStyle(style: Style) {
		onchangestyle(style);
		changeStyleOpen = false;
	}
</script>

<ActionsButton
	openContent={openActions}
	closeContent={closeActions}
	actions={[
		{ label: 'Export', content: exportAction, class: 'btn-info', onclick: onexport },
		{ label: 'Delete', content: deleteAction, class: 'btn-warning', onclick: ondelete },
		{
			label: 'New item',
			content: newItemAction,
			onclick: () => (newItemOpen = true)
		},
		{ label: 'Change style', content: styleAction, onclick: () => (changeStyleOpen = true) }
	]}
/>

{#snippet openActions()}
	<span class="icon-[lucide--circle-fading-plus]"></span>
{/snippet}
{#snippet closeActions()}
	<span class="icon-[lucide--minus]"></span>
{/snippet}
{#snippet exportAction()}
	<span class="icon-[lucide--arrow-down-to-line]"></span>
{/snippet}
{#snippet deleteAction()}
	<span class="icon-[lucide--trash-2]"></span>
{/snippet}
{#snippet newItemAction()}
	<span class="icon-[lucide--square-plus]"></span>
{/snippet}
{#snippet styleAction()}
	<span class="icon-[lucide--palette]"></span>
{/snippet}

<Dialog open={newItemOpen} onhide={() => (newItemOpen = false)}>
	<ul>
		{#each Object.entries(BOARD_ITEM_TYPES) as [type, data] (type)}
			<li>
				<button onclick={() => newItem(type as BoardItemType)} class="btn btn-ghost">
					<span class={data.icon}></span>
					New {data.label}
				</button>
			</li>
		{/each}
	</ul>
</Dialog>

<Dialog open={changeStyleOpen} onhide={() => (changeStyleOpen = false)}>
	<h2 class="px-2 pb-2 text-lg font-bold">Select style</h2>
	<StyleSelect {style} setStyle={changeStyle} />
</Dialog>
