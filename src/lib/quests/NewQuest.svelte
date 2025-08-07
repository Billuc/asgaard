<script lang="ts">
	import { goto } from '$app/navigation';
	import { generateId } from '$lib/id_generator';
	import { asHref, Routes } from '$lib/routes/routes';
	import { QUEST_TYPES, QuestType, type Quest } from './quest';
	import { QuestStorage } from './storage';

	async function createQuest(type: QuestType) {
		const newQuest: Quest = {
			id: generateId('quest'),
			completed: false,
			description: '',
			subquests: [],
			title: 'New Quest',
			type: type
		};
		await QuestStorage.getInstance().upsert(newQuest);
		goto(asHref(Routes.Quest, { id: newQuest.id }), { state: { message: 'New quest created!' } });
	}
</script>

<div class="dropdown dropdown-center dropdown-bottom">
	<div tabindex="0" role="button" class="btn m-1">Create a new quest</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul tabindex="0" class="dropdown-content menu z-1 w-52 rounded-box bg-base-100 p-2 shadow-sm">
		{#each Object.entries(QUEST_TYPES) as [type, data] (type)}
			<li>
				<button onclick={() => createQuest(type as QuestType)} class={[data.colorClass]}>
					{data.label}
				</button>
			</li>
		{/each}
	</ul>
</div>
