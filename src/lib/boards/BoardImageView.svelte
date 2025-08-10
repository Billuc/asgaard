<script lang="ts">
	import { debounce } from 'lodash-es';
	import { type ImageData } from './board';

	interface Props {
		data: ImageData;
		updateData: (newData: ImageData) => void;
	}

	let { data, updateData }: Props = $props();
	let imageInput: HTMLInputElement;

	function updateTitle(newTitle: string) {
		updateData({ ...data, title: newTitle });
	}
	const debouncedUpdateTitle = debounce(updateTitle, 250);

	function updateImage(files: File[]) {
		if (files.length == 0) return;

		updateData({ ...data, image: files[0] });
	}
</script>

<div class="card-title">
	<input
		class="input input-sm grow input-ghost text-lg font-bold"
		value={data.title}
		oninput={(ev) => debouncedUpdateTitle(ev.target.value)}
	/>
</div>

<div>
	{#if data.image}
		<button onclick={() => imageInput.click()} class="cursor-pointer">
			<img src={URL.createObjectURL(data.image)} alt={data.title} />
		</button>
	{/if}

	<input
		type="file"
		accept="image/*"
		oninput={(ev) => updateImage(ev.target.files)}
		class={{ 'file-input': true, hidden: data.image != null }}
		bind:this={imageInput}
	/>
</div>
