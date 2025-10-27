<script lang="ts">
	import { BorderStyle, type Style } from '$lib/styles/style';
	import type { Snippet } from 'svelte';

	interface Props {
		boardStyle: Style;
		children: Snippet;
	}

	const { boardStyle, children }: Props = $props();
</script>

<div
	class={{
		'relative rounded-box': true,
		'border-0': boardStyle.borderStyle == BorderStyle.None,
		'border-2 p-2': boardStyle.borderStyle == BorderStyle.Simple,
		'border-4 border-double p-2':
			boardStyle.borderStyle == BorderStyle.Double || boardStyle.borderStyle == BorderStyle.Quest,
		'my-8': boardStyle.borderStyle == BorderStyle.Quest,
		"before:absolute before:-top-9 before:left-1/2 before:-translate-x-1/2 before:rotate-90 before:text-4xl before:content-['☙']":
			boardStyle.borderStyle == BorderStyle.Quest,
		"after:absolute after:-bottom-9 after:left-1/2 after:-translate-x-1/2 after:rotate-90 after:text-4xl after:content-['❧']":
			boardStyle.borderStyle == BorderStyle.Quest
	}}
>
	{@render children?.()}
</div>
