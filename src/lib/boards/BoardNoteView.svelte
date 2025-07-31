<script lang="ts">
	import { onMount } from 'svelte';
	import type { NoteData } from './board';
	import * as TinyMDE from 'tiny-markdown-editor';
	import './note-editor.css';

	interface Props {
		data: NoteData;
		updateData?: (data: NoteData) => void;
	}

	let { data, updateData = () => {} }: Props = $props();
	let editorEl: HTMLDivElement | undefined;

	onMount(() => {
		const editor = new TinyMDE.Editor({ element: editorEl, content: data.note });
		editor.addEventListener('change', () => {
			let newNote = editor.getContent();
			updateData({ ...data, note: newNote });
		});
	});
</script>

<div bind:this={editorEl}></div>
