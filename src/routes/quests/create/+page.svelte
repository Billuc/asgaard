<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateId } from '$lib/id_generator';
	import { Quest, QUEST_TYPES, QuestType } from '$lib/quests/quest';
	import { questStorage } from '$lib/quests/storage';

	let title = $state('');
	let type = $state(QuestType.MAIN);

	async function onsubmit(event: Event) {
		event.preventDefault();

		let quest: Quest = {
			id: generateId('quest'),
			title: title,
			type: type
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
</script>

<div>
	<h1>Quests</h1>
	<p>Create a new quest!</p>

	<form {onsubmit}>
		<div>
			<label for="title">Title:</label>
			<input type="text" id="title" bind:value={title} required />
		</div>

		<div>
			<label for="type">Type:</label>
			<select id="type" bind:value={type}>
				{#each Object.entries(QUEST_TYPES) as questType (questType[0])}
					<option value={questType[0]}>{questType[1]}</option>
				{/each}
			</select>
		</div>

		<button type="submit" class="btn">Create Quest</button>
	</form>
</div>
