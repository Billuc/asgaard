<script lang="ts">
	import { PRIORITIES, type Priority } from './quest';

	interface Props {
		priority: Priority;
		setPriority: (newPrio: Priority) => void;
		class?: string | string[];
	}

	let { priority, setPriority, class: additionalClasses = [] }: Props = $props();
	let selectColorClass = $derived(PRIORITIES[priority].colorClass);
</script>

<select
	value={priority}
	onchange={(ev) => setPriority((ev.target! as HTMLSelectElement).value as Priority)}
	class={['select', 'select-sm', selectColorClass, additionalClasses]}
>
	{#each Object.entries(PRIORITIES) as prio (prio[0])}
		<option value={prio[0]} class={prio[1].colorClass}>{prio[1].text}</option>
	{/each}
</select>
