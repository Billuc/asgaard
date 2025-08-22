<script lang="ts">
	import NewQuest from '$lib/quests/NewQuest.svelte';
	import type { Quest } from '$lib/quests/quest';
	import QuestsPage from '$lib/quests/QuestsPage.svelte';
	import { QuestStorage } from '$lib/quests/storage';

	async function load(): Promise<Quest[]> {
		return await QuestStorage.getInstance().getAll();
	}
</script>

<svelte:head>
	<title>Asgaard - Quest Board</title>
</svelte:head>

<div>
	<h1 class="mb-4 text-center text-3xl font-black">Quest Board</h1>
	<div class="my-4 text-center">
		<NewQuest />
	</div>

	{#await load()}
		<p class="text-center">Loading quests...</p>
	{:then quests}
		<QuestsPage {quests} />
	{/await}
</div>
