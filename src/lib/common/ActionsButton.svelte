<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		show?: boolean;
		children?: Snippet;
	}

	let { show = $bindable(), children }: Props = $props();
</script>

<button class="btn btn-outline btn-sm btn-warning" onclick={() => (show = !show)}>
	{#if show}
		Hide actions
	{:else}
		Show actions
	{/if}
</button>

{#if show}
	{@render children?.()}
{/if}
