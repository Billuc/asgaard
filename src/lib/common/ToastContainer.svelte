<script lang="ts">
	import { removeToast, toastStore } from './toast.svelte';
	import Toast from './Toast.svelte';

	let messageStore = toastStore;
</script>

<div class="toast-top toast-center toast z-50">
	<div class="stack">
		{#each messageStore.messages as message (message.id)}
			<Toast
				message={message.message}
				timeout={message.timeout}
				remove={() => removeToast(message.id)}
			/>
		{/each}
	</div>
</div>
