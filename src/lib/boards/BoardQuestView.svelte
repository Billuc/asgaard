<script lang="ts">
	import type { QuestData } from './board';
	import { questStorage } from '$lib/quests/storage';
	import { type Quest } from '$lib/quests/quest';
	import QuestSelect from '$lib/quests/QuestSelect.svelte';

	interface Props {
		data: QuestData;
		updateData: (data: QuestData) => void;
	}

	let { data, updateData }: Props = $props();
</script>

<div class="card bg-base-300">
	{#if data.questId}
		{#await questStorage.get(data.questId)}
			<div class="h-16 w-full skeleton"></div>
		{:then quest}
			{#if quest}
				<div class="card-body">
					<h2>{quest.title}</h2>
				</div>
			{/if}
		{/await}
	{:else}
		<div class="card-actions">
			<QuestSelect
				questId={data.questId}
				updateQuestId={(id) => {
					updateData({ ...data, questId: id });
				}}
			></QuestSelect>
			<div class="divider divider-horizontal text-xs">OR</div>
			<button class="btn">New quest</button>
		</div>
	{/if}
</div>
