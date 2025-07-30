<script lang="ts">
	import type { ListData } from './board';

	interface Props {
		data: ListData;
		updateData?: (data: ListData) => void;
	}

	let { data, updateData = () => {} }: Props = $props();
</script>

<div class="card bg-base-300">
	<div class="card-body">
		<input
			class="card-title"
			value={data.title}
			onchange={(ev) => updateData({ ...data, title: ev.target.value })}
		/>

		<table class={['table', 'table-zebra', 'table-xs', 'w-fit']}>
			<tbody>
				{#each data.list as item, i (i)}
					<tr>
						<td><input type="checkbox" class="checkbox" /></td>
						<td><input class="input input-sm" value={item.label} /></td>
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="card-actions">
			<button
				class="btn"
				onclick={() =>
					updateData({
						...data,
						list: [...data.list, { done: false, label: '' }]
					})}
			>
				New item
			</button>
		</div>
	</div>
</div>
