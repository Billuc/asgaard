<script lang="ts">
	let { children } = $props();
</script>

<div class="mx-auto w-full px-4 py-4 md:w-2/3 lg:w-1/2 relative h-[calc(100vh-var(--spacing)*16)]">
	{@render children()}
</div>
