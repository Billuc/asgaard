<script lang="ts">
	import { QUEST_TYPES, type QuestType } from './quest';

	interface Props {
		questType: QuestType;
		setQuestType: (questType: QuestType) => void;
		class?: string | string[];
	}

	let { questType, setQuestType, class: additionalClasses = [] }: Props = $props();
	let selectColorClass = $derived(QUEST_TYPES[questType].colorClass);
</script>

<select
	value={questType}
	onchange={(ev) => setQuestType((ev.target! as HTMLSelectElement).value as QuestType)}
	class={['select', 'select-sm', selectColorClass, additionalClasses]}
>
	{#each Object.entries(QUEST_TYPES) as qt (qt[0])}
		<option value={qt[0]} class={qt[1].colorClass}>{qt[1].label}</option>
	{/each}
</select>
