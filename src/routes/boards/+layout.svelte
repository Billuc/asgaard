<script lang="ts">
	let { children } = $props();
</script>

<div class="relative mx-auto h-[calc(100vh-var(--spacing)*16)] w-full px-4 py-4 md:w-2/3 xl:w-1/2">
	{@render children()}
</div>
