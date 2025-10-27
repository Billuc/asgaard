<script lang="ts">
	import { onMount } from 'svelte';
	import type { NoteData } from '$lib/boards/board';
	import * as TinyMDE from 'tiny-markdown-editor';
	import './note-editor.css';

	interface Props {
		data: NoteData;
		updateData?: (data: NoteData) => void;
	}

	let { data, updateData = () => {} }: Props = $props();
	let toolbarEl: HTMLDivElement | undefined;
	let editorEl: HTMLDivElement | undefined;

	onMount(() => {
		const editor = new TinyMDE.Editor({ element: editorEl, content: data.note });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const toolbar = new TinyMDE.CommandBar({
			element: toolbarEl,
			editor: editor,
			commands: [
				'bold',
				'italic',
				'strikethrough',
				'|',
				'code',
				'blockquote',
				'|',
				'h1',
				'h2',
				'|',
				'ul',
				'ol',
				'|',
				'hr'
			]
		});
		editor.addEventListener('change', () => {
			let newNote = editor.getContent();
			updateData({ ...data, note: newNote });
		});
	});
</script>

<div class="group">
	<div bind:this={toolbarEl} class="mb-2"></div>
	<div bind:this={editorEl}></div>
</div>
