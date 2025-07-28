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

	<div class="relative">
		<div
			class={[
				'h-28',
				'overflow-y-auto',
				'py-4',
				'before:absolute',
				'before:top-0',
				'before:left-0',
				'before:h-full',
				'before:w-full',
				'before:bg-gradient-to-b',
				'before:from-base-100',
				'before:via-transparent',
				'before:to-base-100',
				"before:content-['']",
				'before:pointer-events-none'
			]}
		>
			{#each questsOfType as quest (quest.id)}
				<a href={`/quests/quest?id=${quest.id}`} class="block">
					{quest.title}
				</a>
			{/each}
		</div>
	</div>
</div>
