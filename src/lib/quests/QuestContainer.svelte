<script lang="ts">
	import { type Quest, QUEST_TYPES, QuestType } from './quest';

	const COLORS: { [k in QuestType]: string } = {
		[QuestType.MAIN]: 'text-primary',
		[QuestType.SIDE]: 'text-secondary',
		[QuestType.DAILY]: 'text-accent',
		[QuestType.WEEKLY]: 'text-base-content'
	};
	const LEFT_CURL = '︵‿୨';
	const RIGHT_CURL = '୧‿︵';

	let { type, quests }: { type: QuestType; quests: Quest[] } = $props();
	let color = $derived(COLORS[type]);

	let questsOfType = $derived(quests.filter((q) => q.type === type));
</script>

<div>
	<p class={'font-bold ' + color}>{LEFT_CURL} {QUEST_TYPES[type].label}s {RIGHT_CURL}</p>

	<div
		class="relative h-20 overflow-clip before:absolute before:top-0 before:left-0 before:h-full before:w-full before:bg-gradient-to-b before:from-transparent before:via-transparent before:to-base-100 before:content-['']"
	>
		{#each questsOfType as quest (quest.id)}
			<p>{quest.title}</p>
		{/each}
	</div>
</div>
