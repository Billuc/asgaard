<script lang="ts">
	import { removeAt, swap, updateAt } from '$lib/arrayUtils';
	import { flip } from 'svelte/animate';
	import EffortSelect from './EffortSelect.svelte';
	import PrioritySelect from './PrioritySelect.svelte';
	import type { SubQuest } from './quest';
	import { fly } from 'svelte/transition';

	interface Props {
		subquests: SubQuest[];
		updateSubquests?: (subquests: SubQuest[]) => void;
	}

	let { subquests, updateSubquests = () => {} }: Props = $props();
</script>

<table class="table table-zebra table-xs md:table-sm">
	<thead>
		<tr>
			<th class="w-1/12">Done</th>
			<th class="w-5/12">Name</th>
			<th class="w-2/12">Priority</th>
			<th class="w-2/12">Effort</th>
			<th class="w-2/12">Actions</th>
		</tr>
	</thead>
	<tbody class="text-center">
		{#each subquests as subq, i (subq.id)}
			<tr animate:flip={{ duration: 300 }} transition:fly>
				<td>
					<input
						type="checkbox"
						checked={subq.done}
						class="checkbox"
						onchange={() => updateSubquests(updateAt(subquests, i, { ...subq, done: !subq.done }))}
					/>
				</td>
				<td>
					<input
						value={subq.title}
						onchange={(ev) =>
							updateSubquests(
								updateAt(subquests, i, { ...subq, title: (ev.target! as HTMLInputElement).value })
							)}
						class="input input-sm"
					/>
				</td>
				<td>
					<PrioritySelect
						priority={subq.priority}
						setPriority={(p) => updateSubquests(updateAt(subquests, i, { ...subq, priority: p }))}
					></PrioritySelect>
				</td>
				<td>
					<EffortSelect
						effort={subq.effort}
						setEffort={(e) => updateSubquests(updateAt(subquests, i, { ...subq, effort: e }))}
					></EffortSelect>
				</td>
				<td>
					<button
						class="btn btn-sm btn-error"
						onclick={() => updateSubquests(removeAt(subquests, i))}>Delete</button
					>
					<button class="btn" onclick={() => updateSubquests(swap(subquests, i, i - 1))}>
						Move Up
					</button>
					<button class="btn" onclick={() => updateSubquests(swap(subquests, i, i + 1))}>
						Move Down
					</button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
