<script lang="ts">
	import { updateMatching, removeMatching, moveTo } from '$lib/arrayUtils';
	import { flip } from 'svelte/animate';
	import type { SubQuest } from './quest';
	import { fly } from 'svelte/transition';
	import { generateId } from '$lib/id_generator';
	import SubquestItem from './SubquestItem.svelte';

	interface Props {
		subquests: SubQuest[];
		updateSubquests?: (subquests: SubQuest[]) => void;
		showActions: boolean;
	}

	let { showActions, subquests, updateSubquests = () => {} }: Props = $props();

	let newSubqName = $state('');

	function newSubquest() {
		if (newSubqName === '') return;

		const newSubq = {
			id: generateId('subquest'),
			title: newSubqName,
			done: false
		};

		updateSubquests([...subquests, newSubq]);
		newSubqName = '';
	}

	function inputKeyPress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			newSubquest();
		}
	}

	function onDrop(itemId: string, dropItemId: string) {
		const itemIndex = subquests.findIndex((i) => i.id === itemId);
		const dropItemIndex = subquests.findIndex((i) => i.id === dropItemId);
		if (itemIndex === -1 || dropItemIndex === -1 || itemIndex === dropItemIndex) {
			return; // Invalid indices, do nothing
		}

		updateSubquests(moveTo(subquests, itemIndex, dropItemIndex));
	}
</script>

<div class={['w-full', 'px-2', 'my-2']}>
	{#each subquests as subq (subq.id)}
		<div transition:fly animate:flip={{ duration: 300 }}>
			<SubquestItem
				subquest={subq}
				updateSubquest={(value) =>
					updateSubquests(updateMatching(subquests, (d) => d.id === subq.id, value))}
				removeSubquest={() => updateSubquests(removeMatching(subquests, (i) => i.id === subq.id))}
				{onDrop}
				{showActions}
			/>
		</div>
	{/each}

	<div class={['flex', 'flex-row', 'gap-1', 'items-center', 'px-1']}>
		<span class=" text-lg leading-4 text-base-content/30">&#x2767;</span>

		<label class="input input-sm w-full rounded-md px-1">
			<button class="btn btn-square font-bold btn-xs btn-info" onclick={() => newSubquest()}>
				+
			</button>
			<input
				type="text"
				class="grow"
				placeholder="New subquest"
				bind:value={newSubqName}
				onkeypress={inputKeyPress}
			/>
		</label>
	</div>
</div>
