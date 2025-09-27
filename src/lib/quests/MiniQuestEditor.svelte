<script lang="ts">
	import MyInput from '$lib/common/MyInput.svelte';
	import { asHref, Routes } from '$lib/routes/routes';
	import { QUEST_TYPES, type Quest } from './quest';
	import QuestTypeSelect from './QuestTypeSelect.svelte';
	import SubquestTable from './SubquestTable.svelte';

	interface Props {
		quest: Quest;
		updateQuest?: (quest: Quest) => void;
	}

	const { quest, updateQuest = () => {} }: Props = $props();

	const borderClass = $derived(QUEST_TYPES[quest.type].borderClass);
</script>

<div
	class={[
		'border-8 border-double',
		'py-2',
		'rounded-box',
		'h-64 w-48 min-w-48',
		'truncate text-center',
		'z-10',
		'quest-sheet',
		'bg-base-100',
		'inline-flex flex-col flex-nowrap',
		borderClass
	]}
>
	<div class="flex w-full items-baseline px-2">
		&#x2619;&nbsp;
		<MyInput
			value={quest.title}
			oninput={(title) => updateQuest({ ...quest, title })}
			class={['input input-ghost', 'px-1']}
		/>
		&nbsp;&#x2767;
	</div>

	{#if quest.id === ''}
		<QuestTypeSelect
			questType={quest.type}
			setQuestType={(qt) => updateQuest({ ...quest, type: qt })}
		/>
	{/if}

	<div class="overflow-y-auto">
		<SubquestTable
			subquests={quest.subquests}
			updateSubquests={(sqs) => updateQuest({ ...quest, subquests: sqs })}
			showActions={false}
		/>
	</div>

	{#if quest.id !== ''}
		<a href={asHref(Routes.Quest, { id: quest.id })} class="link">Details</a>
	{/if}
</div>
