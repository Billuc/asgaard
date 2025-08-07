<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { addToast } from '$lib/common/toast.svelte';
	import ToastContainer from '$lib/common/ToastContainer.svelte';
	import NavBar from '$lib/routes/NavBar.svelte';
	import '../app.css';

	let { children } = $props();

	afterNavigate(() => {
		let pageState = page.state as { message: string };

		if (pageState.message && pageState.message !== '') {
			addToast(pageState.message);
		}
	});
</script>

<svelte:head>
	<meta name="viewport" content="viewport-fit=cover" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<NavBar></NavBar>

<div class="mx-auto mt-4 mb-20 w-full px-4 md:mb-4 md:w-2/3 lg:w-1/2">
	{@render children()}
</div>

<ToastContainer></ToastContainer>
