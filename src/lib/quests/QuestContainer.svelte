<script lang="ts">
	import { asHref, Routes } from '$lib/routes/routes';
	import { type Quest, QUEST_TYPES, QuestType } from './quest';
	import { flip } from 'svelte/animate';
	import SubquestTable from './SubquestTable.svelte';

	const LEFT_CURL = '︵‿୨';
	const RIGHT_CURL = '୧‿︵';

	interface Props {
		type: QuestType;
		quests: Quest[];
		updateQuest: (quest: Quest) => void;
	}

	let { type, quests, updateQuest }: Props = $props();
	let questTypeData = $derived(QUEST_TYPES[type]);
	let offset = $state(0);

	let questsOfType = $derived.by(() => {
		let filteredQuests = quests.filter((q) => q.type === type);
		const nbToRotate = offset % filteredQuests.length;
		const headQuests = filteredQuests.splice(0, nbToRotate);
		filteredQuests.push(...headQuests);
		return filteredQuests;
	});
</script>

<div class="w-full">
	<p class={['font-bold', 'text-center', questTypeData.colorClass]}>
		{LEFT_CURL}
		{questTypeData.label}s {RIGHT_CURL}
	</p>

	<div
		class="relative my-8 flex w-fit max-w-full flex-row flex-nowrap items-center overflow-hidden"
	>
		{#each questsOfType as quest (quest.id)}
			<div
				class={[
					questTypeData.borderClass,
					'border-8 border-double',
					'py-2',
					'rounded-box',
					'h-64 w-48 min-w-48',
					'truncate text-center',
					'z-10',
					'quest-sheet',
					'bg-base-100',
					'inline-flex flex-col flex-nowrap'
				]}
				animate:flip={{ duration: 300 }}
			>
				<a href={asHref(Routes.Quest, { id: quest.id })} class="font-semibold">
					&#x2619;&nbsp;{quest.title}
					&nbsp;&#x2767;
				</a>

				<div class="overflow-y-auto">
					<SubquestTable
						subquests={quest.subquests}
						updateSubquests={(sqs) => updateQuest({ ...quest, subquests: sqs })}
						showActions={false}
					/>
				</div>
			</div>
		{/each}

		{#if questsOfType.length > 1}
			<button
				class={[
					'btn',
					'z-10',
					'absolute',
					'top-1/2',
					'right-0',
					'btn-circle',
					'btn-soft',
					'border-2',
					questTypeData.borderClass
				]}
				onclick={() => offset++}
			>
				&gt;
			</button>
		{/if}
	</div>
</div>

<style>
	.quest-sheet:nth-child(2) {
		scale: 0.95;
		opacity: 0.85;
		z-index: 3;
		margin-left: -1rem;
	}

	.quest-sheet:nth-child(3) {
		scale: 0.9;
		opacity: 0.7;
		z-index: 2;
		margin-left: -1.5rem;
	}

	.quest-sheet:nth-child(n + 4) {
		scale: 0.85;
		opacity: 0.5;
		z-index: 1;
		margin-left: -2rem;
	}
</style>
