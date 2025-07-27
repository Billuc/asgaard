<script lang="ts">
	import { EFFORTS, type Effort } from './quest';

	interface Props {
		effort: Effort;
		setEffort: (newEffort: Effort) => void;
	}

	let { effort, setEffort }: Props = $props();
	let selectColorClass = $derived(EFFORTS[effort].colorClass);
</script>

<select
	value={effort}
	onchange={(ev) => setEffort((ev.target! as HTMLSelectElement).value as Effort)}
	class={['select', 'select-sm', selectColorClass]}
>
	{#each Object.entries(EFFORTS) as eff (eff[0])}
		<option value={eff[0]} class={eff[1].colorClass}>{eff[1].text}</option>
	{/each}
</select>
