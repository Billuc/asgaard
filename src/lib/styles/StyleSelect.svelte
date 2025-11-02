<script lang="ts">
	import { type Style } from './style';
	import { StyleStorage } from './storage';

	interface Props {
		style: Style;
		setStyle: (newStyle: Style) => void;
		class?: string | string[];
	}

	let { style, setStyle, class: additionalClasses = [] }: Props = $props();
	let allStyles = $state<Style[]>([]);

	$effect(() => {
		StyleStorage.getInstance()
			.getAll()
			.then((styles) => (allStyles = styles));
	});

	const onStyleSelect = async (ev: Event) => {
		const id = (ev.target! as HTMLSelectElement).value;
		const style = await StyleStorage.getInstance().get(id);

		if (style) setStyle(style);
	};
</script>

<select
	value={style.id}
	onchange={onStyleSelect}
	class={['select', 'select-sm', additionalClasses]}
>
	{#each allStyles as style (style.id)}
		<option value={style.id}>{style.name}</option>
	{/each}
</select>
