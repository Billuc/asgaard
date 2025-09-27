<script lang="ts">
	import type { Board } from '$lib/boards/board';
	import BoardRow from '$lib/boards/BoardRow.svelte';
	import { BoardStorage } from '$lib/boards/storage';
	import FloatingButton from '$lib/common/FloatingButton.svelte';
	import { generateId } from '$lib/id_generator';
	import MiniQuestEditor from '$lib/quests/MiniQuestEditor.svelte';
	import { QuestType, type Quest } from '$lib/quests/quest';
	import { QuestStorage } from '$lib/quests/storage';
	import { cloneDeep } from 'lodash-es';

	async function getFavoriteBoards(): Promise<Board[]> {
		const boards = await BoardStorage.getInstance().getAll();
		return boards.filter((board) => board.favorite);
	}

	const NEW_QUEST: Quest = {
		id: '',
		title: 'New Quest',
		description: '',
		completed: false,
		subquests: [],
		type: QuestType.MAIN
	};

	let newQuest = $state(NEW_QUEST);

	const saveQuest = async () => {
		const quest: Quest = cloneDeep(newQuest);
		quest.id = generateId('quest');
		await QuestStorage.getInstance().upsert(quest);
		newQuest = NEW_QUEST;
	};
</script>

<svelte:head>
	<title>Asgaard - Home</title>
</svelte:head>

<div class="container mx-auto">
	<h1 class="text-center text-2xl font-black">Asgaard</h1>

	<p class="text-center">Welcome to Asgaard, the ultimate quest management system!</p>

	<div class="relative">
		<div class="pl-4">
			<MiniQuestEditor quest={newQuest} updateQuest={(q) => (newQuest = q)} />
		</div>

		<FloatingButton x="left" y="center" text="✓" onclick={saveQuest} class="border-primary" />
	</div>

	<div class="my-4 text-lg">Your favorite boards</div>

	<div class="list">
		{#await getFavoriteBoards()}
			<p>Loading favorites...</p>
		{:then favoriteBoards}
			{#each favoriteBoards as board (board.id)}
				<BoardRow {board}></BoardRow>
			{/each}
		{/await}
	</div>
</div>
