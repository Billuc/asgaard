<script lang="ts">
	import ToastContainer from '$lib/common/ToastContainer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

{@render children()}

<ToastContainer></ToastContainer>
