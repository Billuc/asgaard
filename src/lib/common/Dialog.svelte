<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		children?: Snippet;
		onopen?: () => void;
		onhide?: () => void;
	}

	const { open, children, onopen, onhide }: Props = $props();
	let dialogElement: HTMLDialogElement;

	$effect(() => {
		if (open) openModal();
		else hideModal();
	});

	const openModal = () => {
		dialogElement.showModal();
		onopen?.();
	};
	const hideModal = () => {
		dialogElement.close();
		onhide?.();
	};
</script>

<dialog bind:this={dialogElement} class="modal">
	<div class="modal-box max-w-xl p-2 pt-4 max-h-svh overflow-auto">
		<form method="dialog">
			<button class="btn absolute top-1 right-1 btn-circle btn-sm" onclick={hideModal} aria-label="Close">
				<span class="icon-[lucide--x]"></span>
			</button>
		</form>

		{@render children?.()}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button onclick={hideModal}>close</button>
	</form>
</dialog>
