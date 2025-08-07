<script lang="ts">
	import { QuestStorage } from './storage';

	interface Props {
		questId?: string;
		updateQuestId?: (id: string) => void;
	}

	let { questId, updateQuestId = () => {} }: Props = $props();
</script>

{#await QuestStorage.getInstance().getAll()}
	<div class="h-10 w-80 skeleton"></div>
{:then quests}
	<select class="select" onchange={(e) => updateQuestId(e.target.value)}>
		<option value="" selected={!questId} disabled>Select a quest</option>
		{#each quests as quest (quest.id)}
			<option value={quest.id} selected={quest.id === questId}>
				{quest.title}
			</option>
		{/each}
	</select>
{/await}
