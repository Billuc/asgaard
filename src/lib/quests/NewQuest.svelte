<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateId } from '$lib/id_generator';
	import { QUEST_TYPES, QuestType, type Quest } from './quest';
	import { questStorage } from './storage';

	async function createQuest(type: QuestType) {
		const newQuest: Quest = {
			id: generateId('quest'),
			completed: false,
			description: '',
			subquests: [],
			title: 'New Quest',
			type: type
		};
		await questStorage.upsert(newQuest);
		goto(`/quests/quest?id=${newQuest.id}`, { state: { message: 'New quest created!' } });
	}
</script>

<div class="dropdown dropdown-center dropdown-bottom">
	<div tabindex="0" role="button" class="btn m-1">Create a new quest</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul tabindex="0" class="dropdown-content menu z-1 w-52 rounded-box bg-base-100 p-2 shadow-sm">
		{#each Object.entries(QUEST_TYPES) as [type, data] (type)}
			<li>
				<a onclick={() => createQuest(type as QuestType)} class={[data.colorClass]}>{data.label}</a>
			</li>
		{/each}
	</ul>
</div>
