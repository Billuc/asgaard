<script lang="ts">
	import type { Style } from '$lib/styles/style';
	import { StyleStorage } from '$lib/styles/storage';
	import StyleTable from '$lib/styles/StyleTable.svelte';
	import EditTable from '$lib/common/EditTable.svelte';

	let styles = $state<Style[]>([]);

	$effect(() => {
		StyleStorage.getInstance()
			.getAll()
			.then((s) => (styles = s));
	});
</script>

<h1 class="mb-4 text-center text-3xl font-bold">Settings</h1>

<div class="px-2 md:px-4 lg:px-8">
	<h2 class="mb-2 text-xl font-semibold">Styles</h2>
	<StyleTable {styles} createStyle={() => {}} updateStyle={() => {}} deleteStyle={() => {}} />

	<EditTable
		items={[
			{disabled: true, item: { id: '1', name: 'Bob', age: 22, hasSiblings: false }},
			{ item: { id: '2', name: 'Alice', age: 5, hasSiblings: true }}
		]}
		columns={{ name: { label: 'NAMEZ'}, age: {label:"AAAGE"}, hasSiblings: {label: "Siblings ?"}, id: {label:"#", disabled: true} }}
		updateItem={(i, v) => { console.log(v)}}
	/>
</div>
