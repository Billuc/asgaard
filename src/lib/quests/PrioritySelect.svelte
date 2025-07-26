<script lang="ts">
	import { PRIORITIES, type Priority } from './quest';

	interface Props {
		priority: Priority;
		setPriority: (newPrio: Priority) => void;
	}

	let { priority, setPriority }: Props = $props();
	let selectColorClass = $derived(PRIORITIES[priority].colorClass);
</script>

<select
	value={priority}
	onchange={(ev) => setPriority(ev.target.value)}
	class={'select ' + selectColorClass}
>
	{#each Object.entries(PRIORITIES) as prio (prio[0])}
		<option value={prio[0]} class={prio[1].colorClass}>{prio[1].text}</option>
	{/each}
</select>
