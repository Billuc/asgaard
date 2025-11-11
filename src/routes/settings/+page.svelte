<script lang="ts">
	import type { Style } from '$lib/styles/style';
	import { StyleStorage } from '$lib/styles/storage';
	import StyleTable from '$lib/styles/StyleTable.svelte';
	import { cloneDeep } from 'lodash-es';
	import { generateId } from '$lib/id_generator';

	let styles = $state<Style[]>([]);
	const storage = StyleStorage.getInstance();

	$effect(() => {
		storage.getAll().then((s) => (styles = s));
	});

	async function oncreate(style: Style) {
		const toCreate: Style = cloneDeep(style);
		toCreate.id = generateId('style');
		await storage.upsert(toCreate);
		styles.push(toCreate);
	}

	async function onupdate(style: Style) {
		await storage.upsert(style);
		const index = styles.findIndex((s) => s.id === style.id);
		if (index === -1) return;
		styles.splice(index, 1, style);
	}

	function ondelete(id: string) {
		storage.delete(id);
		styles = styles.filter((s) => s.id !== id);
	}
</script>

<h1 class="my-4 text-center text-3xl font-bold">Settings</h1>

<div class="px-2 md:px-4 lg:px-8">
	<h2 class="mb-2 ml-2 text-xl font-semibold">Styles</h2>
	<StyleTable {styles} createStyle={oncreate} updateStyle={onupdate} deleteStyle={ondelete} />
</div>
