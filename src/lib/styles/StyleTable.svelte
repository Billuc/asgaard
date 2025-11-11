<script lang="ts">
	import { BoardItemType } from '$lib/boards/board';
	import BoardBorder from '$lib/boards/BoardBorder.svelte';
	import BoardItem from '$lib/boards/items/BoardItem.svelte';
	import Dialog from '$lib/common/Dialog.svelte';
	import EditTable from '$lib/common/EditTable.svelte';
	import MyInput from '$lib/common/MyInput.svelte';
	import BorderStyleSelect from './BorderStyleSelect.svelte';
	import { BorderStyle, type Style, ASGAARD_STYLES } from './style';

	interface Props {
		styles: Style[];
		createStyle: (style: Style) => void;
		updateStyle: (style: Style) => void;
		deleteStyle: (style: Style) => void;
	}

	const { styles, createStyle, updateStyle, deleteStyle }: Props = $props();

	let newStyle = $state<Style>({
		id: '',
		name: 'New Style',
		flatItems: false,
		borderStyle: BorderStyle.None
	});
	let styleToPreview = $state<Style | null>(null);
	let showDialog = $derived(styleToPreview !== null);

	let styleItems = $derived([
		...ASGAARD_STYLES.map((s) => ({ disabled: true, item: s })),
		...styles.map((s) => ({ disabled: false, item: s })),
		{ disabled: false, item: newStyle }
	]);
	const columns = {
		name: { label: 'Name' },
		flatItems: { label: 'Flat Items' },
		borderStyle: { label: 'Border', input: inputBorder },
		actions: { label: 'Actions', input: actions }
	};

	const preview = (id: string) => {
		if (id === '') {
			styleToPreview = newStyle;
			return;
		}

		const asgaardStyle = ASGAARD_STYLES.find((s) => s.id === id);
		if (asgaardStyle) {
			styleToPreview = asgaardStyle;
			return;
		}

		styleToPreview = styles.find((s) => s.id === id) ?? null;
	};

	const ondelete = (id: string) => {
		const toDelete = styles.find((s) => s.id === id);
		if (!toDelete) return;
		deleteStyle(toDelete);
	};

	const onupdate = (item: Style) => {
		if (item.id === '') {
			newStyle = item;
			return;
		}

		updateStyle(item);
	};
</script>

<EditTable items={styleItems} {columns} {onupdate} />

{#snippet inputBorder(id: string, value?: BorderStyle, update?: (value: BorderStyle) => void)}
	<BorderStyleSelect
		borderStyle={value ?? BorderStyle.None}
		setBorderStyle={(bs) => update?.(bs)}
	/>
{/snippet}

{#snippet actions(id: string)}
	<button class="btn btn-xs" onclick={() => preview(id)}>Preview</button>

	{#if id === ''}
		<button class="btn btn-xs" onclick={() => createStyle(newStyle)}>Create</button>
	{:else if !ASGAARD_STYLES.find((s) => s.id === id)}
		<button class="btn btn-sm" onclick={() => ondelete(id)}>Delete</button>
	{/if}
{/snippet}

<Dialog open={showDialog} onhide={() => (styleToPreview = null)}>
	<div class="mx-2 my-4">
		{#if styleToPreview}
			<BoardBorder boardStyle={styleToPreview}>
				<h2 class="mb-4 text-center text-2xl font-semibold">Board</h2>
				<BoardItem
					data={{
						hideDone: false,
						title: 'List',
						type: BoardItemType.LIST,
						list: [
							{ id: '1', done: false, label: '#1' },
							{ id: '2', done: true, label: '#2' }
						]
					}}
					style={styleToPreview}
					showActions={false}
					updateData={() => {}}
					moveBlockUp={() => {}}
					moveBlockDown={() => {}}
					deleteBlock={() => {}}
				/>
			</BoardBorder>
		{:else}
			Select a style
		{/if}
	</div>
</Dialog>
