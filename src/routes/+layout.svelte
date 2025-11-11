<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { addToast } from '$lib/common/toast-state.svelte';
	import ToastContainer from '$lib/common/ToastContainer.svelte';
	import NavBar from '$lib/routes/NavBar.svelte';
	import '../app.css';
	import { enableDragDropTouch } from '@dragdroptouch/drag-drop-touch';

	let { children } = $props();

	afterNavigate(() => {
		let pageState = page.state as { message: string };

		if (pageState.message && pageState.message !== '') {
			addToast(pageState.message);
		}
	});

	$effect(() => {
		enableDragDropTouch();
	});
</script>

<NavBar></NavBar>

<div class="w-full pb-16 md:pb-0">
	{@render children()}
</div>

<ToastContainer></ToastContainer>
