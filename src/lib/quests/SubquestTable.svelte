<script lang="ts">
	import EffortSelect from './EffortSelect.svelte';
	import PrioritySelect from './PrioritySelect.svelte';
	import type { SubQuest } from './quest';

	interface Props {
		subquests: SubQuest[];
		updateAtIndex: (sq: SubQuest, index: number) => void;
	}

	let { subquests, updateAtIndex }: Props = $props();
</script>

<table class="table table-zebra table-sm">
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
			<tr>
				<td>
					<input type="checkbox" checked={subq.done} class="checkbox" />
				</td>
				<td>
					<input
						value={subq.title}
						onchange={(ev) =>
							updateAtIndex({ ...subq, title: (ev.target! as HTMLInputElement).value }, i)}
						class="input input-sm"
					/>
				</td>
				<td>
					<PrioritySelect
						priority={subq.priority}
						setPriority={(p) => updateAtIndex({ ...subq, priority: p }, i)}
					></PrioritySelect>
				</td>
				<td>
					<EffortSelect
						effort={subq.effort}
						setEffort={(e) => updateAtIndex({ ...subq, effort: e }, i)}
					></EffortSelect>
				</td>
				<td></td>
			</tr>
		{/each}
	</tbody>
</table>
