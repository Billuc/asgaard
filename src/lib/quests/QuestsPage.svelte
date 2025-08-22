<script lang="ts">
	import { cloneDeep } from 'lodash-es';
	import type { Quest } from './quest';
	import { QuestType } from './quest';
	import QuestContainer from './QuestContainer.svelte';
	import { QuestStorage } from './storage';
	import { updateMatching } from '$lib/arrayUtils';

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
</script>

<QuestContainer type={QuestType.MAIN} {quests} {updateQuest}></QuestContainer>
<QuestContainer type={QuestType.SIDE} {quests} {updateQuest}></QuestContainer>
<QuestContainer type={QuestType.DAILY} {quests} {updateQuest}></QuestContainer>
<QuestContainer type={QuestType.WEEKLY} {quests} {updateQuest}></QuestContainer>
