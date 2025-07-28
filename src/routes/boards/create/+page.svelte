<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Board } from '$lib/boards/board';
	import { boardStorage } from '$lib/boards/storage';
	import { generateId } from '$lib/id_generator';

	let title = $state('');

	async function onsubmit() {
		let board: Board = {
			id: generateId('board'),
			title: title,
			items: []
		};

		console.log('Creating board:', board);

		await boardStorage.upsert(board);
		await goto(`/boards/board?id=${board.id}`, {
			state: {
				message: 'Board created successfully!'
			}
		});
	}
</script>

<div>
	<h1>Boards</h1>
	<p>Create a new board!</p>
	<a href="/boards" class="btn">Return to boards</a>

	<div class="flex flex-col items-start gap-y-2">
		<label for="title" class="label"> Title of your board</label>
		<input type="text" id="title" bind:value={title} required class="input ml-2" />
		<button type="submit" class="btn self-end" onclick={() => onsubmit()}>Create board</button>
	</div>
</div>
