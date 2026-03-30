<script lang="ts">
	import { untrack } from 'svelte';
	import { onMount } from 'svelte';
	import { Editor, CommandBar } from 'tiny-markdown-editor';
	import { debounce } from 'lodash-es';
	import { NoteStorage } from './storage';
	import type { Note } from './note';
	import { text } from '@sveltejs/kit';
	import { preventDefault, stopPropagation } from 'svelte/legacy';

	interface Props {
		note: Note;
	}

	const { note: initialNote }: Props = $props();
	// untrack: intentionally capture only the initial prop value as local mutable state.
	let note: Note = $state(untrack(() => ({ ...initialNote })));

	const createdAt = $derived(new Date(note.createdAt));

	async function saveContent(content: string) {
		const storage = await NoteStorage.getInstance();
		const updated = { ...note, content };
		await storage.upsert(updated);
		note = updated;
	}

	const debouncedSave = debounce(saveContent, 400);

	let toolbarEl: HTMLDivElement;
	let editorEl: HTMLDivElement;

	onMount(() => {
		const editor = new Editor({ element: editorEl, content: note.content, customInlineGrammar: {
            checkbox: {
                regexp: /\[([ xX])\] /,
                replacement: "<span class='TMMark_TMCheckbox' onclick='toggleCheckbox'>[$1]</span> ",
            }
        } });
		new CommandBar({ element: toolbarEl, editor, commands: ['bold', 'italic', 'strikethrough', '|', 'code', '|', 'h1', 'h2', '|', 'ul', 'ol', {
            name: 'tasklist',
            title: 'Task List',
            action: editor => {
                const selection = editor.getSelection();
                if (selection === null) return;
                const newLines = [...editor.lines];
                const remove = /- \[[ xX]\] /.test(newLines[selection.row]);
                newLines[selection.row] = remove ? newLines[selection.row].slice(6) : `- [ ] ${newLines[selection.row]}`;
                editor.setContent(newLines.join('\n'));
                editor.setSelection({ row: selection.row, col: selection.col + (remove ? -6 : 6) });
            },
            innerHTML: `<span class="icon-[lucide--list-checks]"></span>`,
        }, '|', 'blockquote', 'hr', '|', 'insertLink', 'insertImage'] });
		editor.addEventListener('change', ({ content }) => {
            addCheckboxHandlers();
            debouncedSave(content)
        });

		return () => {
			debouncedSave.cancel();
		};
	});
    
    function addCheckboxHandlers() {
        const checkboxes = document.querySelectorAll('.TMMark_TMCheckbox');

        checkboxes.forEach((checkboxEl) => {
            const checkbox = checkboxEl as HTMLSpanElement;
            checkbox.removeEventListener('click', toggleCheckbox);
            checkbox.addEventListener('click', toggleCheckbox);
        });
    }

    function toggleCheckbox(ev: MouseEvent) {
        ev.preventDefault();
        const span = ev.target as HTMLSpanElement;
        const checked = span.textContent?.toLowerCase() === '[x]';
        span.textContent = checked ? '[ ]' : '[x]';
        // Trigger change event to save the updated content
        span.dispatchEvent(new Event('change'));
    }
</script>

<div class="mx-auto flex max-w-3xl flex-col gap-4 p-4">
	<div class="text-base-content/50 text-sm">
		Created on {createdAt.toLocaleDateString()} at {createdAt.toLocaleTimeString()}
	</div>

	<div class="rounded-lg border">
		<div bind:this={toolbarEl} class="toolbar-wrapper"></div>
		<div bind:this={editorEl} class="editor-wrapper prose min-h-64 p-2"></div>
	</div>
</div>

<style>
	/* ── Toolbar ─────────────────────────────────────────────────── */
	:global(.TMCommandBar) {
		background-color: var(--color-base-200);
		border-color: var(--color-base-200);
		border-bottom: 1px solid var(--color-base-300);
		border-radius: var(--radius-box, 0.5rem) var(--radius-box, 0.5rem) 0 0;
		height: auto;
		padding: 4px 8px;
		flex-wrap: wrap;
		overflow: visible;
	}

	:global(.TMCommandButton) {
		color: var(--color-base-content);
		fill: var(--color-base-content);
		border-radius: var(--radius-field, 0.375rem);
		width: 28px;
		height: 28px;
		padding: 4px;
	}

	:global(.TMCommandButton_Inactive) {
		background-color: transparent;
	}

	:global(.TMCommandButton_Active) {
		color: var(--color-primary);
		fill: var(--color-primary);
		background-color: color-mix(in oklch, var(--color-primary) 15%, transparent);
	}

	:global(.TMCommandButton_Disabled) {
		color: color-mix(in oklch, var(--color-base-content) 30%, transparent);
		fill: color-mix(in oklch, var(--color-base-content) 30%, transparent);
	}

	@media (hover: hover) {
		:global(.TMCommandButton_Active:hover),
		:global(.TMCommandButton_Inactive:hover),
		:global(.TMCommandButton_Disabled:hover) {
			background-color: color-mix(in oklch, var(--color-primary) 15%, transparent);
			color: var(--color-primary);
			fill: var(--color-primary);
		}
	}

	:global(.TMCommandDivider) {
		border-left-color: var(--color-base-300);
		border-right-color: transparent;
		margin: 4px;
	}

	/* ── Editor body ─────────────────────────────────────────────── */
	:global(.TinyMDE) {
		background-color: transparent;
		color: var(--color-base-content);
		font-size: 1rem;
		line-height: 1.75;
		outline: none;
		padding: 0;
		caret-color: var(--color-primary);
	}

	/* Inline code & code blocks */
	:global(.TMFencedCodeBacktick),
	:global(.TMFencedCodeTilde),
	:global(.TMIndentedCode),
	:global(.TMCode) {
		background-color: var(--color-base-300);
		border-color: var(--color-base-300);
		font-family: ui-monospace, monospace;
	}

	:global(.TMCodeFenceBacktickOpen),
	:global(.TMCodeFenceTildeOpen) {
		border-bottom-color: var(--color-base-300);
		font-family: ui-monospace, monospace;
	}

	:global(.TMCodeFenceBacktickClose),
	:global(.TMCodeFenceTildeClose) {
		border-top-color: var(--color-base-300);
		font-family: ui-monospace, monospace;
	}

	/* Heading marks */
	:global(.TMMark_TMH1),
	:global(.TMMark_TMH2) {
		color: var(--color-primary);
	}

	/* List markers */
	:global(.TMMark_TMUL),
	:global(.TMMark_TMOL) {
		color: var(--color-primary);
	}

	/* Syntax marks (e.g. ** around bold) */
	:global(.TMMark) {
		color: color-mix(in oklch, var(--color-base-content) 35%, transparent);
	}

	/* Blockquote */
	:global(.TMBlockquote) {
		border-left-color: color-mix(in oklch, var(--color-primary) 50%, transparent);
	}

	/* Links */
	:global(.TMLinkDestination),
	:global(.TMAutolink) {
		color: var(--color-primary);
	}

	:global(.TMLinkLabel_Valid),
	:global(.TMLinkLabel_Definition) {
		color: var(--color-success);
	}

	:global(.TMLinkLabel_Invalid) {
		color: var(--color-error);
	}

	/* HTML */
	:global(.TMHTML),
	:global(.TMHTMLBlock) {
		color: var(--color-secondary);
	}

    :global(.TMMark_TMCheckbox) {
        cursor: pointer;
        font-weight: bold;
    }
</style>
