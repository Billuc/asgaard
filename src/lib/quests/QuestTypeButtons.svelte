<script lang="ts">
	import { QUEST_TYPES, QuestType } from './quest';

	let { selectType }: { selectType: (type: QuestType) => void } = $props();
</script>

<div class="grid grid-cols-2">
	{#each Object.entries(QUEST_TYPES) as questType (questType[0])}
		<button
			class={'btn ' + questType[1].colorClass}
			onclick={() => selectType(questType[0] as QuestType)}
		>
			{questType[1].label}
		</button>
	{/each}
</div>
