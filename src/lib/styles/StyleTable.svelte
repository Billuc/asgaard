<script lang="ts">
	import { BoardItemType } from '$lib/boards/board';
	import BoardBorder from '$lib/boards/BoardBorder.svelte';
	import BoardItem from '$lib/boards/items/BoardItem.svelte';
	import BoardListView from '$lib/boards/items/list/BoardListView.svelte';
	import Dialog from '$lib/common/Dialog.svelte';
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

	const preview = (style: Style) => {
		styleToPreview = style;
	};
</script>

<div class="overflow-x-auto">
	<table class="table table-xs">
		<thead>
			<tr>
				<th>Name</th>
				<th>Flat Items</th>
				<th>Border</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each ASGAARD_STYLES as style (style.id)}
				<tr>
					<td>
						<MyInput class="input-xs" value={style.name} disabled />
					</td>
					<td>
						<input
							type="checkbox"
							class="checkbox checkbox-sm"
							checked={style.flatItems}
							disabled
						/>
					</td>
					<td>
						<BorderStyleSelect
							borderStyle={style.borderStyle}
							setBorderStyle={() => {}}
							class="select-xs"
						/>
					</td>
					<td>
						<button class="btn btn-xs" onclick={() => preview(style)}>Preview</button>
					</td>
				</tr>
			{/each}
			{#each styles as style (style.id)}
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td>
						<button class="btn">Preview</button>
					</td>
				</tr>
			{/each}

			<tr>
				<td>
					<MyInput class="input-xs" value={newStyle.name} oninput={(v) => (newStyle.name = v)} />
				</td>
				<td>
					<input type="checkbox" class="checkbox checkbox-sm" bind:checked={newStyle.flatItems} />
				</td>
				<td>
					<BorderStyleSelect
						borderStyle={newStyle.borderStyle}
						setBorderStyle={(bs) => (newStyle.borderStyle = bs)}
					/>
				</td>
				<td>
					<button class="btn btn-xs" onclick={() => createStyle(newStyle)}>Create</button>
				</td>
			</tr>
		</tbody>
	</table>
</div>

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
