<script lang="ts">
	import { Effort, Priority, QUEST_TYPES, type Quest } from '$lib/quests/quest';
	import { questStorage } from '$lib/quests/storage';
	import SubquestTable from '$lib/quests/SubquestTable.svelte';
	import { cloneDeep, debounce } from 'lodash-es';
	import type { PageProps } from './$types';
	import { generateId } from '$lib/id_generator';

	let { data }: PageProps = $props();

	let quest = $state(data.quest);
	let questTypeData = $derived(QUEST_TYPES[quest.type]);

	const updateQuest = async (newQuest: Quest) => {
		await questStorage.upsert(cloneDeep(newQuest));
		let updatedQuest = await questStorage.get(newQuest.id);
		if (updatedQuest) quest = updatedQuest;

		console.debug('Quest updated:', $state.snapshot(quest));
	};

	const debouncedUpdateQuest = debounce(updateQuest, 250);

	async function newSubquest() {
		let subquests = [...quest.subquests];
		subquests.push({
			id: generateId('subquest'),
			title: 'New subquest',
			priority: Priority.MEDIUM,
			effort: Effort.MEDIUM,
			done: false
		});

		await updateQuest({ ...quest, subquests });
	}
</script>

<div>
	<h3 class={questTypeData.colorClass}>{questTypeData.label}</h3>
	<a href="/quests" class="btn">Return to quests</a>
	<input
		class="input input-xl input-ghost"
		value={quest.title}
		oninput={(ev) => debouncedUpdateQuest({ ...quest, title: ev.target.value })}
	/>
	<div>
		<textarea
			class="textarea w-full resize-none textarea-ghost text-base-content/70"
			oninput={(ev) => debouncedUpdateQuest({ ...quest, description: ev.target.value })}
			value={quest.description}
		></textarea>
	</div>

	{#if quest.subquests.length > 0}
		<h3>Subquests</h3>
		<SubquestTable
			subquests={quest.subquests}
			updateSubquests={(subquests) => updateQuest({ ...quest, subquests })}
		/>
	{/if}

	<div>
		<button class="btn" onclick={() => newSubquest()}>Add Subquest</button>
	</div>
</div>
