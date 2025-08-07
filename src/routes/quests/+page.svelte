<script lang="ts">
	import NewQuest from '$lib/quests/NewQuest.svelte';
	import { QuestType, type Quest } from '$lib/quests/quest';
	import QuestContainer from '$lib/quests/QuestContainer.svelte';
	import { QuestStorage } from '$lib/quests/storage';

	async function load(): Promise<Quest[]> {
		return await QuestStorage.getInstance().getAll();
	}
</script>

<div>
	<a href="/" class="btn">Back to Home</a>

	<h1 class="mb-4 text-center text-3xl font-black">Quest Board</h1>
	<div class="my-4 text-center">
		<NewQuest />
	</div>

	{#await load()}
		<p class="text-center">Loading quests...</p>
	{:then quests}
		<QuestContainer type={QuestType.MAIN} {quests}></QuestContainer>
		<QuestContainer type={QuestType.SIDE} {quests}></QuestContainer>
		<QuestContainer type={QuestType.DAILY} {quests}></QuestContainer>
		<QuestContainer type={QuestType.WEEKLY} {quests}></QuestContainer>
	{/await}
</div>
