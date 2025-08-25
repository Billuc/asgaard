<script lang="ts">
	import MyInput from '$lib/common/MyInput.svelte';
	import { fade } from 'svelte/transition';
	import type { SubQuest } from './quest';
	import { draggable, draghandle, dropzone } from '$lib/draggable';

	interface Props {
		subquest: SubQuest;
		updateSubquest?: (sq: SubQuest) => void;
		removeSubquest?: () => void;
		onDrop?: (sqId: string, dropSqId: string) => void;
		showActions?: boolean;
	}

	let {
		subquest,
		updateSubquest = () => {},
		removeSubquest = () => {},
		onDrop = () => {},
		showActions = false
	}: Props = $props();

	function dragStart(event: Event) {
		// The data we want to make available when the element is dropped
		const data = { subquestId: subquest.id };
		(event as DragEvent).dataTransfer!.setData('text/plain', JSON.stringify(data));
	}

	function drop(event: Event) {
		event.preventDefault();
		const json = (event as DragEvent).dataTransfer!.getData('text/plain');
		const { subquestId } = JSON.parse(json);
		onDrop(subquestId, subquest.id);
	}
</script>

<div
	class="flex flex-row items-center gap-1 px-1"
	role="listitem"
	{@attach draggable(dragStart)}
	{@attach dropzone(drop)}
>
	<span class="mr-1 cursor-grab text-lg leading-4 text-success" {@attach draghandle}>&#x2767;</span>
	<input
		type="checkbox"
		class="checkbox"
		checked={subquest.done}
		onchange={() => updateSubquest({ ...subquest, done: !subquest.done })}
	/>

	<MyInput
		class="input input-sm grow input-ghost px-1"
		value={subquest.title}
		oninput={(title) => updateSubquest({ ...subquest, title })}
	/>

	{#if showActions}
		<button
			class="btn btn-outline btn-xs btn-error"
			onclick={() => removeSubquest()}
			transition:fade={{ duration: 200 }}
		>
			Delete
		</button>
	{/if}
</div>
