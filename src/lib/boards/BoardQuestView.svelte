<script lang="ts">
	import type { QuestData } from './board';
	import { QuestStorage } from '$lib/quests/storage';
	import QuestSelect from '$lib/quests/QuestSelect.svelte';
	import type { Quest } from '$lib/quests/quest';

	interface Props {
		manageMode: boolean;
		data: QuestData;
		updateData: (data: QuestData) => void;
	}

	let { data, updateData }: Props = $props();

	async function load(): Promise<Quest> {
		let quest = await QuestStorage.getInstance().get(data.questId);
		if (!quest) {
			throw new Error('Could not find a quest with this ID!');
		}
		return quest;
	}
</script>

{#if data.questId}
	{#await load()}
		<div class="h-16 w-full skeleton"></div>
	{:then quest}
		<h2>{quest.title}</h2>
	{:catch error}
		<p class="text-error">Error: {error.message}</p>
	{/await}
{:else}
	<QuestSelect
		questId={data.questId}
		updateQuestId={(id) => {
			updateData({ ...data, questId: id });
		}}
	></QuestSelect>
	<div class="divider divider-horizontal text-xs">OR</div>
	<button class="btn">New quest</button>
{/if}
