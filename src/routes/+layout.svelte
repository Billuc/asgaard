<script lang="ts">
	import ToastContainer from '$lib/common/ToastContainer.svelte';
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

<ToastContainer></ToastContainer>
