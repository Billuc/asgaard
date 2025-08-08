<script lang="ts">
	import { removeAt, swap, updateAt } from '$lib/arrayUtils';
	import { flip } from 'svelte/animate';
	import EffortSelect from './EffortSelect.svelte';
	import PrioritySelect from './PrioritySelect.svelte';
	import { Effort, Priority, type SubQuest } from './quest';
	import { fly, slide } from 'svelte/transition';
	import { generateId } from '$lib/id_generator';
	import { linear } from 'svelte/easing';

	interface Props {
		subquests: SubQuest[];
		updateSubquests?: (subquests: SubQuest[]) => void;
		showActions: boolean;
	}

	let { showActions, subquests, updateSubquests = () => {} }: Props = $props();

	let newSubqName = $state('');

	function newSubquest() {
		const newSubq = {
			id: generateId('subquest'),
			title: newSubqName,
			priority: Priority.MEDIUM,
			effort: Effort.MEDIUM,
			done: false
		};

		updateSubquests([...subquests, newSubq]);
	}
</script>

<div class={['w-full', 'px-2', 'my-2']}>
	{#each subquests as subq, i (subq.id)}
		<div
			class={[
				'flex',
				'flex-row',
				'gap-1',
				'items-center',
				'before:content-["❧"]',
				'before:text-success',
				'before:mr-2'
			]}
			animate:flip={{ duration: 300 }}
			transition:fly
		>
			<input
				type="checkbox"
				checked={subq.done}
				class="checkbox"
				onchange={() => updateSubquests(updateAt(subquests, i, { ...subq, done: !subq.done }))}
			/>
			<input
				value={subq.title}
				oninput={(ev) =>
					updateSubquests(
						updateAt(subquests, i, { ...subq, title: (ev.target! as HTMLInputElement).value })
					)}
				class="input input-sm grow"
			/>
			{#if !showActions}
				<div
					class="flex flex-row gap-1"
					in:slide={{ duration: 150, axis: 'x', easing: linear }}
					out:slide={{ duration: 250, axis: 'x', easing: linear }}
				>
					<PrioritySelect
						priority={subq.priority}
						setPriority={(p) => updateSubquests(updateAt(subquests, i, { ...subq, priority: p }))}
						class="flex-1/3"
					></PrioritySelect>
					<EffortSelect
						effort={subq.effort}
						setEffort={(e) => updateSubquests(updateAt(subquests, i, { ...subq, effort: e }))}
						class="flex-1/4"
					></EffortSelect>
				</div>
			{:else}
				<div
					class="flex flex-row gap-1"
					in:slide={{ duration: 250, axis: 'x', easing: linear }}
					out:slide={{ duration: 150, axis: 'x', easing: linear }}
				>
					<button
						class="btn btn-outline btn-xs"
						onclick={() => updateSubquests(swap(subquests, i, i - 1))}
					>
						Up
					</button>
					<button
						class="btn btn-outline btn-xs"
						onclick={() => updateSubquests(swap(subquests, i, i + 1))}
					>
						Down
					</button>
					<button
						class="btn btn-outline btn-xs btn-error"
						onclick={() => updateSubquests(removeAt(subquests, i))}
					>
						Delete
					</button>
				</div>
			{/if}
		</div>
	{/each}

	<div
		class={[
			'flex',
			'flex-row',
			'gap-1',
			'items-center',
			'before:content-["❧"]',
			'before:text-base-content/30',
			'before:mr-2'
		]}
	>
		<button class="btn btn-square btn-xs btn-info" onclick={newSubquest}>+</button>
		<input class="input input-sm grow" bind:value={newSubqName} />
		<div class="flex-1/3"></div>
		<div class="flex-1/3"></div>
	</div>
</div>
