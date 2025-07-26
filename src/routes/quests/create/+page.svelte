<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateId } from '$lib/id_generator';
	import EffortSelect from '$lib/quests/EffortSelect.svelte';
	import PrioritySelect from '$lib/quests/PrioritySelect.svelte';
	import { Effort, Priority, Quest, QuestType, type SubQuest } from '$lib/quests/quest';
	import QuestTypeButtons from '$lib/quests/QuestTypeButtons.svelte';
	import { questStorage } from '$lib/quests/storage';

	let title = $state('');
	let type = $state(QuestType.MAIN);
	let subquests: SubQuest[] = $state([]);
	let step = $state(0);

	const STEPS = ['Select Type', 'Quest Title', 'Subquests'];

	async function onsubmit() {
		let quest: Quest = {
			id: generateId('quest'),
			title: title,
			type: type,
			subquests: subquests.map((sq) => ({ ...sq }))
		};

		console.log('Creating quest:', quest);

		await questStorage.upsert(quest);
		await goto('/quests', {
			state: {
				message: 'Quest created successfully!',
				quest: quest
			}
		});
	}

	function newSubquest() {
		subquests.push({
			id: generateId('subquest'),
			title: 'New subquest',
			priority: Priority.MEDIUM,
			effort: Effort.MEDIUM,
			done: false
		});
	}
</script>

<div>
	<h1>Quests</h1>
	<p>Create a new quest!</p>

	<ul class="steps mx-auto w-2/3">
		{#each STEPS as stepTitle, i (i)}
			<button
				class={'step before:transition-colors before:duration-300' +
					(i <= step ? ' step-primary' : '')}
				onclick={() => (step = Math.min(step, i))}
			>
				{stepTitle}
			</button>
		{/each}
	</ul>

	<div class="flex flex-col items-center p-8">
		{#if step == 0}
			<QuestTypeButtons
				selectType={(t) => {
					type = t;
					step++;
				}}
			></QuestTypeButtons>
		{/if}
		{#if step == 1}
			<div class="flex flex-col items-start gap-y-2">
				<label for="title" class="label"> Name of your quest </label>
				<input type="text" id="title" bind:value={title} required class="input ml-2" />
				<button type="submit" class="btn self-end" onclick={() => step++}>Next</button>
			</div>
		{/if}
		{#if step == 2}
			<table class="table table-zebra table-sm">
				<thead>
					<tr>
						<th class="w-1/2">Name</th>
						<th class="w-1/4">Priority</th>
						<th class="w-1/4">Effort</th>
					</tr>
				</thead>
				<tbody class="text-center">
					{#each subquests as subq, i (subq.id)}
						<tr>
							<td
								><input
									value={subq.title}
									onchange={(ev) => subquests.splice(i, 1, { ...subq, title: ev.target.value })}
									class="input"
								/></td
							>
							<td>
								<PrioritySelect
									priority={subq.priority}
									setPriority={(p) => subquests.splice(i, 1, { ...subq, priority: p })}
								></PrioritySelect>
							</td>
							<td>
								<EffortSelect
									effort={subq.effort}
									setEffort={(e) => subquests.splice(i, 1, { ...subq, effort: e })}
								></EffortSelect>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
			<button class="btn" onclick={newSubquest}>Create subquest</button>

			<button class="btn mt-4" onclick={onsubmit}>Create Quest</button>
		{/if}
	</div>
</div>
