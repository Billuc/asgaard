<script lang="ts">
	import { goto } from '$app/navigation';
	import { asHref, Routes } from '$lib/routes/routes';
	import { BoardStorage } from './storage';

	let fileInput: HTMLInputElement;

	async function importBoard(event: Event) {
		if (!(event.target instanceof HTMLInputElement)) return;
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const boardContent = await files[0].text();
		const boardData = JSON.parse(boardContent);

		if (!boardData || !boardData.id || !boardData.title) {
			alert('Invalid board data');
			return;
		}

		await BoardStorage.getInstance().upsert(boardData);

		await goto(asHref(Routes.Board, { id: boardData.id }), {
			state: { message: 'Board imported successfully' }
		});
	}
</script>

<button onclick={() => fileInput.click()} class="btn">Import Board</button>

<input
	type="file"
	accept="application/json"
	oninput={importBoard}
	class="file-input hidden"
	bind:this={fileInput}
/>
