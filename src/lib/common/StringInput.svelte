<script lang="ts">
	import { debounce } from 'lodash-es';
	import { untrack } from 'svelte';

	interface Props {
		disabled?: boolean;
		value: string;
		oninput?: (v: string) => void;
		immediate?: boolean;
	}

	const { disabled = false, value, oninput = () => {}, immediate = false }: Props = $props();
	let selectionStart = $state<number | null>(null);
	let selectionEnd = $state<number | null>(null);
	let div: HTMLDivElement;

	function update(ev: Event) {
		let caretRange = document.getSelection()?.getRangeAt(0);
		selectionStart = caretRange?.startOffset ?? null;
		selectionEnd = caretRange?.endOffset ?? null;
		oninput((ev.target! as HTMLDivElement).textContent);
	}
	const updateDebounced = immediate ? update : debounce(update, 300);

	function checkKeyPress(ev: KeyboardEvent) {
		if (ev.code == 'Enter') {
			ev.preventDefault();
			ev.stopPropagation();
		}
	}

	$effect(() => {
		if (!value) return;

		const [start, end] = untrack(() => [selectionStart, selectionEnd]);

		if (start === null || end === null) return;

		requestAnimationFrame(() => {
			let range = document.createRange();
			range.setStart(div.firstChild!, start);
			range.setEnd(div.firstChild!, end);

			const sel = document.getSelection()!;
			sel.removeAllRanges();
			sel.addRange(range);
		});
	});
</script>

<div
	contenteditable={!disabled}
	class="my-input string-input wrap-break-word"
	oninput={updateDebounced}
	bind:this={div}
	onkeypress={checkKeyPress}
	role="textbox"
	tabindex={0}
>
	{value}
</div>

<style>
	@reference "../../app.css";

	.string-input {
		@apply w-full rounded-field border-none px-2 py-2;
		@apply text-xs md:text-sm lg:text-base;
	}

	.string-input[contenteditable='false'] {
		@apply opacity-40;
	}

	.my-input {
		@apply transition-colors outline-none focus:bg-base-200/50;
	}
</style>
