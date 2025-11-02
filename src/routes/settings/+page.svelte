<script lang="ts">
	import type { Style } from '$lib/styles/style';
	import { StyleStorage } from '$lib/styles/storage';
	import StyleTable from '$lib/styles/StyleTable.svelte';

	let styles = $state<Style[]>([]);

	$effect(() => {
		StyleStorage.getInstance()
			.getAll()
			.then((s) => (styles = s));
	});
</script>

<h1 class="mb-4 text-center text-3xl font-bold">Settings</h1>

<div class="px-4">
	<h2 class="mb-2 text-xl font-semibold">Styles</h2>
	<StyleTable {styles} createStyle={() => {}} updateStyle={() => {}} deleteStyle={() => {}} />
</div>
