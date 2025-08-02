<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { addToast } from '$lib/common/toast.svelte';
	import ToastContainer from '$lib/common/ToastContainer.svelte';
	import '../app.css';

	let { children } = $props();

	afterNavigate(() => {
		let pageState = page.state as { message: string };

		if (pageState.message && pageState.message !== '') {
			addToast(pageState.message);
		}
	});
</script>

<div class="mx-auto w-full px-4 md:w-2/3 lg:w-1/2">
	{@render children()}
</div>

<ToastContainer></ToastContainer>
