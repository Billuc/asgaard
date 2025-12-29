<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Action {
		label: string;
		class?: string | string[];
		content?: Snippet | string;
		onclick?: (ev: MouseEvent) => void;
	}

	interface Props {
		openContent: Snippet;
		closeContent: Snippet;
		actions: Action[];
	}

	let { openContent, closeContent, actions }: Props = $props();
</script>

<div class="fab my-fab">
	<!-- a focusable div with tabindex is necessary to work on all browsers. role="button" is necessary for accessibility -->
	<div tabindex="0" role="button" class="btn btn-circle btn-info md:btn-lg">
		{@render openContent()}
	</div>

	<div class="fab-close">
		Close <span class="btn btn-circle btn-error md:btn-lg">{@render closeContent()}</span>
	</div>

	{#each actions as ac, i (i)}
		<div>
			{ac.label}&nbsp;
			<button class={['btn btn-circle md:btn-lg', ac.class]} onclick={(ev) => ac.onclick?.(ev)}>
				{#if typeof ac.content === 'string'}
					{ac.content}
				{:else}
					{@render ac.content?.()}
				{/if}
			</button>
		</div>
	{/each}
</div>

<style>
	@reference "../../app.css";

    .my-fab {
        @apply bottom-20 md:bottom-4;
        @apply rounded-lg;
        @apply transition-all duration-300;
    }

    .my-fab:focus-within {
        @apply bg-base-100/80 shadow-base-100/80;
        box-shadow: 0 0 25px 25px var(--tw-shadow-color);
    }

</style>
