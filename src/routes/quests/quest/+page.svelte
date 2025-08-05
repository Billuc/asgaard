<script lang="ts">
	import { QUEST_TYPES, type Quest } from '$lib/quests/quest';
	import { questStorage } from '$lib/quests/storage';
	import SubquestTable from '$lib/quests/SubquestTable.svelte';
	import { cloneDeep, debounce } from 'lodash-es';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data }: PageProps = $props();

	let quest = $state(data.quest);
	let manageMode = $state(false);
	let descTextareaRef: HTMLTextAreaElement;
	let questTypeData = $derived(QUEST_TYPES[quest.type]);
	const newLineRegex = new RegExp(/\n/g);

	const updateQuest = async (newQuest: Quest) => {
		await questStorage.upsert(cloneDeep(newQuest));
		let updatedQuest = await questStorage.get(newQuest.id);
		if (updatedQuest) quest = updatedQuest;

		console.debug('Quest updated:', $state.snapshot(quest));
	};

	const debouncedUpdateQuest = debounce(updateQuest, 250);

	function updateDescription(newDesc: string) {
		const nbOfLines = (newDesc.match(newLineRegex) || []).length + 1;
		descTextareaRef.rows = Math.min(nbOfLines, 10);

		debouncedUpdateQuest({ ...quest, description: newDesc });
	}

	async function deleteQuest() {
		await questStorage.delete(quest.id);
		goto('/quests', { state: { message: 'Quest deleted successfully' }, invalidateAll: true });
	}

	onMount(() => {
		const nbOfLines = (quest.description.match(newLineRegex) || []).length + 1;
		descTextareaRef.rows = Math.min(nbOfLines, 10);
	});
</script>

<a href="/quests" class="btn">Return to quests</a>

<div
	class={[
		'border-8',
		'border-double',
		questTypeData.borderClass,
		'rounded-box',
		'flex',
		'flex-col',
		'items-center',
		'p-4',
		'my-6',
		'relative',
		'before:content-["❦"]',
		'before:absolute',
		'before:bottom-full',
		'before:left-1/2',
		'before:rotate-180',
		questTypeData.beforeClass,
		'before:text-3xl',
		'before:-translate-x-1/2',
		'before:translate-y-0.5',
		'after:content-["❦"]',
		'after:absolute',
		'after:top-full',
		'after:left-1/2',
		questTypeData.afterClass,
		'after:text-3xl',
		'after:-translate-x-1/2',
		'after:-translate-y-0.5'
	]}
>
	<h3 class={[questTypeData.colorClass]}>{questTypeData.label}</h3>
	<input
		class="input m-2 input-xl input-ghost text-center font-bold"
		value={quest.title}
		oninput={(ev) => debouncedUpdateQuest({ ...quest, title: ev.target.value })}
	/>

	<div>
		<button class="btn btn-outline btn-sm btn-warning" onclick={() => (manageMode = !manageMode)}>
			Manage
		</button>
		{#if manageMode}
			<button class="btn btn-outline btn-sm btn-error" onclick={deleteQuest}>Delete quest</button>
		{/if}
	</div>

	<span class="mt-2 text-lg font-semibold">&#x2619; Description &#x2767;</span>

	<textarea
		class="textarea m-2 w-full resize-none textarea-ghost text-center text-base-content/80"
		oninput={(ev) => updateDescription(ev.target.value)}
		value={quest.description}
		bind:this={descTextareaRef}
	></textarea>

	<span class="text-lg font-semibold">&#x2619; What you have to do &#x2767;</span>
	<SubquestTable
		subquests={quest.subquests}
		updateSubquests={(subquests) => updateQuest({ ...quest, subquests })}
		{manageMode}
	/>

	<span class="mt-2">&#x2619; Quest Giver &#x2767;</span>
</div>
