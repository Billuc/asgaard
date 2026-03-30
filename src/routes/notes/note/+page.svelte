<script lang="ts">
	import { NoteStorage } from '$lib/notes/storage';
	import type { Note } from '$lib/notes/note';
	import { page } from '$app/state';
	import NotePage from '$lib/notes/NotePage.svelte';

	async function getNote(): Promise<Note> {
		const id = page.url.searchParams.get('id');
		if (!id) throw new Error('An ID is required!');

		const storage = await NoteStorage.getInstance();
		const note = await storage.get(id);

		if (!note) throw new Error('Could not find a note with this ID!');
		return note;
	}
</script>

<svelte:head>
	<title>Asgaard - Note</title>
</svelte:head>

{#await getNote()}
	<p class="p-4">Loading note…</p>
{:then note}
	<NotePage {note} />
{:catch error}
	<p class="text-error p-4">{error.message}</p>
{/await}
