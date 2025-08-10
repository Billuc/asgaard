<script lang="ts">
	import { type Theme } from './theme';

	interface Props {
		theme: Theme;
	}

	let { theme }: Props = $props();
</script>

<div
	data-theme={theme}
	class={[
		'grid grid-cols-2 place-items-center gap-0.5',
		'h-7 w-7',
		'p-1',
		'bg-base-100',
		'rounded-box',
		'shadow-md'
	]}
>
	<span class="status h-1.5 w-1.5 status-primary"></span>
	<span class="status h-1.5 w-1.5 status-secondary"></span>
	<span class="status h-1.5 w-1.5 status-accent"></span>
	<span class="status h-1.5 w-1.5 status-neutral"></span>
</div>
