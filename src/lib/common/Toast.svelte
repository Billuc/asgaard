<script lang="ts">
	import { slide } from 'svelte/transition';

	let { message, timeout, remove }: { message: string; timeout: number; remove: () => void } =
		$props();

	$effect(() => {
		const timeoutId = setTimeout(() => {
			remove();
		}, timeout);

		return () => clearTimeout(timeoutId);
	});
</script>

<div class="alert alert-info" transition:slide|global>
	<span>{message}</span>
	<button class="btn btn-ghost btn-xs" onclick={() => remove()}>Close</button>
</div>
