<script lang="ts">
	import { fade } from 'svelte/transition';

	let { children = undefined, class: additionalClasses = '' } = $props();
</script>

<td
	class={['border-r-base-content/5 not-last:border-r', additionalClasses]}
	transition:fade={{ duration: 200 }}
>
	{@render children?.()}
</td>
