<script lang="ts">
	import type { QuestData } from './board';
	import { questStorage } from '$lib/quests/storage';
	import QuestSelect from '$lib/quests/QuestSelect.svelte';

	interface Props {
		data: QuestData;
		updateData: (data: QuestData) => void;
	}

	let { data, updateData }: Props = $props();
</script>

{#if data.questId}
	{#await questStorage.get(data.questId)}
		<div class="h-16 w-full skeleton"></div>
	{:then quest}
		{#if quest}
			<h2>{quest.title}</h2>
		{/if}
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
