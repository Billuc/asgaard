<script lang="ts">
	import { WorkspaceStorage } from '$lib/workspace/storage';
	import type { Workspace } from '$lib/workspace/workspace';
	import WorkspacePage from '$lib/workspace/WorkspacePage.svelte';

	const workspaceStorage = WorkspaceStorage.getInstance();
	let workspace: Workspace | undefined = $state();

	$effect(() => {
		let sessionWorkspace = workspaceStorage.get();

		if (!sessionWorkspace) {
			sessionWorkspace = {
				questIds: []
			};
			workspaceStorage.upsert(sessionWorkspace);
		}

		workspace = sessionWorkspace;
	});
</script>

<div class="full-page relative">
	{#if workspace}
		<WorkspacePage {workspace} />
	{:else}
		<p class="mt-16 text-center text-lg font-semibold">
			Preparing your workspace
			<span class="loading loading-sm loading-dots"></span>
		</p>
	{/if}
</div>

<style>
	.full-page {
		min-height: calc(100vh - 4rem);
	}

	@media (width >= 48rem) {
		.full-page {
			min-height: calc(100vh - 4rem - 1px);
		}
	}
</style>
