<script lang="ts">
	import { type Quest } from '$lib/quests/quest';
	import { QuestStorage } from '$lib/quests/storage';
	import { page } from '$app/state';
	import QuestPage from '$lib/quests/QuestPage.svelte';

	async function load(): Promise<Quest> {
		const id = page.url.searchParams.get('id');

		if (!id) throw new Error('An ID is required !');

		const quest = await QuestStorage.getInstance().get(id);
		console.log('Quest with ID ', id, quest);

		if (!quest) throw new Error('Could not find a quest with this ID !');

		return quest;
	}
</script>

<svelte:head>
	<title>Asgaard - Quest</title>
</svelte:head>

<a href="/quests" class="btn">Return to quests</a>

{#await load()}
	<p class="text-center">Loading quest...</p>
{:then quest}
	<QuestPage {quest}></QuestPage>
{:catch error}
	<p class="text-error">Error: {error.message}</p>
{/await}
