<script lang="ts">
	import { QUEST_TYPES } from '$lib/quests/quest';
	import SubquestTable from '$lib/quests/SubquestTable.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let questTypeData = $derived(QUEST_TYPES[data.quest.type]);
</script>

<div>
	<h3 class={questTypeData.colorClass}>{questTypeData.label}</h3>
	<a href="/quests" class="btn">Return to quests</a>
	<input class="input input-xl input-ghost" value={data.quest.title} />

	<SubquestTable subquests={data.quest.subquests} updateAtIndex={(sq, i) => {}} />
</div>
