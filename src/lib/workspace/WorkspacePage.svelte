<script lang="ts">
	import type { Workspace } from './workspace';

	interface Props {
		workspace: Workspace;
	}

	let { workspace }: Props = $props();
</script>

<div class={['bg-amber-200', 'absolute top-0 right-0 bottom-0 left-0']}>
	<ul>
		{#each workspace.questIds as questId (questId)}
			<li>{questId}</li>
		{/each}
	</ul>
</div>
