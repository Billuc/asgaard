<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { addToast } from '$lib/common/toast.svelte';
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

<div class="mx-auto w-full px-4 pt-4 pb-20 md:w-2/3 md:pb-4 lg:w-1/2">
	{@render children()}
</div>

<ToastContainer></ToastContainer>
