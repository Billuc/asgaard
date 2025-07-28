<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateId } from '$lib/id_generator';
	import { Effort, Priority, type Quest, QuestType, type SubQuest } from '$lib/quests/quest';
	import QuestTypeButtons from '$lib/quests/QuestTypeButtons.svelte';
	import { questStorage } from '$lib/quests/storage';
	import SubquestTable from '$lib/quests/SubquestTable.svelte';

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
	<a href="/quests" class="btn">Return to quests</a>

	<div class="mx-auto w-2/3">
		<ul class="steps w-full">
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
	</div>

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
			<SubquestTable
				{subquests}
				updateAtIndex={(sq, i) => subquests.splice(i, 1, sq)}
				deleteAtIndex={(i) => subquests.splice(i, 1)}
			/>
			<button class="btn" onclick={newSubquest}>Create subquest</button>

			<button class="btn mt-4" onclick={onsubmit}>Create Quest</button>
		{/if}
	</div>
</div>
