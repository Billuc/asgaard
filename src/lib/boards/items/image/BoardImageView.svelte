<script lang="ts">
	import { debounce } from 'lodash-es';
	import { type Image, type ImageData } from '$lib/boards/board';
	import MyInput from '$lib/common/MyInput.svelte';
	import { generateId } from '$lib/id_generator';
	import { ImageStorage } from '$lib/boards/storage';

	interface Props {
		data: ImageData;
		updateData: (newData: ImageData) => void;
	}
	interface LocalImageData {
		id: string;
		url?: string;
	}

	let { data, updateData }: Props = $props();
	let images: LocalImageData[] = $state([]);
	let selectedImage: LocalImageData | null = $state(null);
	let imageInput: HTMLInputElement;
	let imageDialog: HTMLDialogElement;

	$effect(() => {
		if (data.imageIds && data.imageIds.length > 0) {
			const imageStorage = ImageStorage.getInstance();
			const promises = data.imageIds.map((id) =>
				imageStorage.getUrl(id).then((url) => ({ id, url }))
			);
			Promise.all(promises).then((imgs) => {
				images = imgs;
			});
		}
	});

	function updateTitle(newTitle: string) {
		updateData({ ...data, title: newTitle });
	}
	const debouncedUpdateTitle = debounce(updateTitle, 250);

	async function addImage(event: Event) {
		if (!(event.target instanceof HTMLInputElement)) return;
		const files = event.target.files;

		if (!files || files.length == 0) return;

		const ids = [];
		for (const file of files) {
			const newImage: Image = {
				id: generateId('image'),
				data: file
			};
			await ImageStorage.getInstance().upsert(newImage);
			ids.push(newImage.id);
		}

		updateData({ ...data, imageIds: [...(data.imageIds || []), ...ids] });
	}

	async function deleteImage(id: string) {
		await ImageStorage.getInstance().delete(id);
		updateData({ ...data, imageIds: (data.imageIds || []).filter((imageId) => imageId !== id) });
		imageDialog.close();
	}

	function openImageDialog(image: LocalImageData) {
		selectedImage = image;
		imageDialog.showModal();
	}
</script>

<div class="card-title">
	<MyInput
		class="input input-sm grow input-ghost text-lg font-bold"
		value={data.title}
		oninput={(t) => debouncedUpdateTitle(t)}
	/>
</div>

<div class="card-actions">
	<button onclick={() => imageInput.click()} class="btn btn-xs">+ Add image(s)</button>
	<input
		type="file"
		accept="image/*"
		oninput={addImage}
		class="hidden"
		bind:this={imageInput}
		multiple
	/>
</div>

<div
	class={[
		'flex flex-row flex-nowrap',
		images.length === 1 ? 'justify-center' : 'justify-start',
		'h-36',
		'overflow-x-scroll'
	]}
>
	{#each images as image (image.id)}
		<button onclick={() => openImageDialog(image)} class="contents cursor-pointer">
			<img src={image.url} alt={data.title} class="h-full w-auto rounded-sm object-cover" />
		</button>
	{/each}
</div>

<dialog bind:this={imageDialog} class="modal">
	<div class="modal-box max-w-xl p-2">
		<form method="dialog">
			<button class="btn absolute top-1 right-1 btn-circle btn-sm">&times;</button>
		</form>

		{#if selectedImage}
			<img src={selectedImage.url} alt={data.title} class="w-full" />

			<div class="mt-2 flex flex-row justify-center gap-2">
				<button
					class="btn btn-outline btn-xs btn-error"
					onclick={() => deleteImage(selectedImage.id)}
				>
					Delete
				</button>
			</div>
		{:else}
			<p class="text-center">No image selected</p>
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
