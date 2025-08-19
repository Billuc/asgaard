<script lang="ts">
	import MyInput from '$lib/common/MyInput.svelte';
	import type { ListItem } from './board';
	import { enableDragDropTouch } from '@dragdroptouch/drag-drop-touch';

	interface Props {
		item: ListItem;
		updateItem?: (item: ListItem) => void;
		removeItem?: () => void;
		onDrop?: (itemId: string, dropItemId: string) => void;
	}

	let { item, updateItem = () => {}, removeItem = () => {}, onDrop = () => {} }: Props = $props();

	let dragging: boolean = $state(false);

	function dragStart(event: DragEvent) {
		// The data we want to make available when the element is dropped
		const data = { itemId: item.id };
		event.dataTransfer!.setData('text/plain', JSON.stringify(data));
	}

	function drop(event: DragEvent) {
		event.preventDefault();
		const json = event.dataTransfer!.getData('text/plain');
		const { itemId } = JSON.parse(json);
		onDrop(itemId, item.id);
	}

	$effect(() => {
		enableDragDropTouch();
	});
</script>

<div
	class="flex flex-row items-center gap-2 px-1"
	draggable={true}
	ondrop={(event) => drop(event)}
	ondragstart={(event) => dragStart(event)}
	ondragover={(ev) => {
		ev.preventDefault();
	}}
	ondragenter={() => false}
	ondragleave={() => false}
	role="listitem"
>
	<span
		class="-mt-1 cursor-grab text-lg leading-4"
		onpointerdown={() => (dragging = true)}
		onpointerup={() => (dragging = false)}
	>
		&equiv;
	</span>
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

	<button class="btn btn-outline btn-xs btn-error" onclick={() => removeItem()}>Delete</button>
</div>
