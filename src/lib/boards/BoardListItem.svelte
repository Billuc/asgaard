<script lang="ts">
	import MyInput from '$lib/common/MyInput.svelte';
	import { fade } from 'svelte/transition';
	import type { ListItem } from './board';
	import { draggable, draghandle, dropzone } from '$lib/draggable';

	interface Props {
		item: ListItem;
		updateItem?: (item: ListItem) => void;
		removeItem?: () => void;
		onDrop?: (itemId: string, dropItemId: string) => void;
		showActions?: boolean;
	}

	let {
		item,
		updateItem = () => {},
		removeItem = () => {},
		onDrop = () => {},
		showActions = false
	}: Props = $props();

	function dragStart(event: Event) {
		// The data we want to make available when the element is dropped
		const data = { itemId: item.id };
		(event as DragEvent).dataTransfer!.setData('text/plain', JSON.stringify(data));
	}

	function drop(event: Event) {
		event.preventDefault();
		const json = (event as DragEvent).dataTransfer!.getData('text/plain');
		const { itemId } = JSON.parse(json);
		onDrop(itemId, item.id);
	}
</script>

<div
	class="flex flex-row items-center gap-2 px-1"
	role="listitem"
	{@attach draggable(dragStart)}
	{@attach dropzone(drop)}
>
	<span class="-mt-1 cursor-grab text-lg leading-4" {@attach draghandle}>&equiv;</span>
	<input
		type="checkbox"
		class="checkbox checkbox-primary"
		checked={item.done}
		onchange={() => updateItem({ ...item, done: !item.done })}
	/>

	<MyInput
		class="input input-sm grow input-ghost"
		value={item.label}
		oninput={(label) => updateItem({ ...item, label })}
	/>

	{#if showActions}
		<button
			class="btn btn-outline btn-xs btn-error"
			onclick={() => removeItem()}
			transition:fade={{ duration: 200 }}
		>
			Delete
		</button>
	{/if}
</div>
