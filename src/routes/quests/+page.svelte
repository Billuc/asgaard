<script lang="ts">
	import { QuestType } from '$lib/quests/quest';
	import QuestContainer from '$lib/quests/QuestContainer.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div>
	<h1>Quests</h1>
	<p>Welcome to the quests page!</p>
	<p>Here you can find various quests to embark on.</p>

	<a href="/" class="btn">Back to Home</a>

	<QuestContainer type={QuestType.MAIN} quests={data.quests}></QuestContainer>
	<QuestContainer type={QuestType.SIDE} quests={data.quests}></QuestContainer>
	<QuestContainer type={QuestType.DAILY} quests={data.quests}></QuestContainer>
	<QuestContainer type={QuestType.WEEKLY} quests={data.quests}></QuestContainer>

	<a href="/quests/create" class="btn"> Create New Quest </a>
</div>
