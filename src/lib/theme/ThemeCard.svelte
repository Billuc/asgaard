<script lang="ts">
	import { capitalize } from 'lodash-es';
	import { type Theme } from './theme';

	interface Props {
		theme: Theme;
		selected?: boolean;
		onselect: () => void;
	}

	let { theme, selected = false, onselect }: Props = $props();
</script>

<button
	data-theme={theme}
	class={[
		'grid grid-cols-4 place-items-center gap-1',
		'px-4 py-2',
		'bg-base-100',
		'rounded-box',
		'transition-shadow duration-300',
		'shadow-sm shadow-primary hover:shadow-lg',
		'cursor-pointer',
		selected ? 'ring-2 ring-accent' : ''
	]}
	onclick={onselect}
>
	<span class="col-span-4 w-24 truncate font-bold" title={theme}>{capitalize(theme)}</span>
	<div class="h-3 w-3 rounded-field bg-primary"></div>
	<div class="h-3 w-3 rounded-field bg-secondary"></div>
	<div class="h-3 w-3 rounded-field bg-accent"></div>
	<div class="h-3 w-3 rounded-field bg-neutral"></div>
</button>
