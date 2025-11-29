<script lang="ts">
	import type { Snippet } from 'svelte';
	import Dialog from './Dialog.svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
	let dialogOpen = $state(false);
</script>

<button class="btn" aria-label="Settings" onclick={() => (dialogOpen = true)}>
	<span class="icon-[lucide--settings]"></span>
</button>

<Dialog open={dialogOpen} onhide={() => (dialogOpen = false)}>
	{@render children()}
</Dialog>
