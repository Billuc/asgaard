<script lang="ts">
	import { NoteStorage } from '$lib/notes/storage';
	import type { Note } from '$lib/notes/note';
	import { asHref, Routes } from '$lib/routes/routes';
	import FloatingButton from '$lib/common/FloatingButton.svelte';
	import { goto } from '$app/navigation';

	async function getNotes(): Promise<Note[]> {
		const storage = await NoteStorage.getInstance();
		return storage.getAll();
	}

	async function createNote() {
		const storage = await NoteStorage.getInstance();
		const note = await storage.create();
		goto(asHref(Routes.Note, { id: note.id }));
	}

	let notesPromise = $state(getNotes());
</script>

<svelte:head>
	<title>Asgaard - Notes</title>
</svelte:head>

<div class="container mx-auto px-8 pt-4">
	<h1 class="mb-4 text-2xl font-black">Notes</h1>

	{#await notesPromise}
		<p>Loading notes…</p>
	{:then notes}
		{#if notes.length === 0}
			<p class="text-base-content/50">No notes yet. Create your first one!</p>
		{:else}
			<div class="list">
				{#each notes as note (note.id)}
					<a
						class="list-row hover:bg-base-200 cursor-pointer rounded-lg"
						href={asHref(Routes.Note, { id: note.id })}
					>
						<div class="list-col-grow">
							<p class="line-clamp-1 text-sm font-medium">
								{note.content.split('\n')[0].replace(/^#+\s*/, '') || 'Untitled'}
							</p>
							<p class="text-base-content/50 text-xs">
								{new Date(note.createdAt).toLocaleString()}
							</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{:catch error}
		<p class="text-error">{error.message}</p>
	{/await}
</div>

<FloatingButton x="right" y="bottom" text="+ New note" onclick={createNote} />
