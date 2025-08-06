<script lang="ts">
	import NewQuest from '$lib/quests/NewQuest.svelte';
	import { QuestType } from '$lib/quests/quest';
	import QuestContainer from '$lib/quests/QuestContainer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div>
	<a href="/" class="btn">Back to Home</a>

	<h1 class="mb-4 text-center text-3xl font-black">Quest Board</h1>
	<div class="my-4 text-center">
		<NewQuest />
	</div>

	<QuestContainer type={QuestType.MAIN} quests={data.quests}></QuestContainer>
	<QuestContainer type={QuestType.SIDE} quests={data.quests}></QuestContainer>
	<QuestContainer type={QuestType.DAILY} quests={data.quests}></QuestContainer>
	<QuestContainer type={QuestType.WEEKLY} quests={data.quests}></QuestContainer>
</div>
