<script lang="ts">
	import { cloneDeep } from 'lodash-es';
	import type { Quest } from './quest';
	import { QuestType } from './quest';
	import QuestContainer from './QuestContainer.svelte';
	import { QuestStorage } from './storage';
	import { updateMatching } from '$lib/arrayUtils';
	import { generateId } from '$lib/id_generator';

	interface Props {
		quests: Quest[];
	}

	let { quests }: Props = $props();
	let questStorage = QuestStorage.getInstance();

	const updateQuest = async (newQuest: Quest) => {
		await questStorage.upsert(cloneDeep(newQuest));
		let updatedQuest = await questStorage.get(newQuest.id);
		if (updatedQuest)
			quests = updateMatching(quests, (q) => q.id === updatedQuest.id, updatedQuest);

		console.debug('Quest updated:', updatedQuest);
	};

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
		quests = [newQuest, ...quests];
	}
</script>

<div class="rounded-box bg-accent/15 px-2 py-2 shadow-2xl md:px-8 md:py-4">
	<QuestContainer
		type={QuestType.MAIN}
		{quests}
		{updateQuest}
		createQuest={() => createQuest(QuestType.MAIN)}
	></QuestContainer>

	<QuestContainer
		type={QuestType.SIDE}
		{quests}
		{updateQuest}
		createQuest={() => createQuest(QuestType.SIDE)}
	></QuestContainer>
</div>
