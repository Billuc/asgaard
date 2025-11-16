<script lang="ts">
	import { ASGAARD_STYLES, type Style } from './style';
	import { StyleStorage } from './storage';

	interface Props {
		style: Style;
		setStyle: (newStyle: Style) => void;
		class?: string | string[];
	}

	let { style, setStyle, class: additionalClasses = [] }: Props = $props();
	let allStyles = $state<Style[]>(ASGAARD_STYLES);

	$effect(() => {
		StyleStorage.getInstance()
			.getAll()
			.then((styles) => (allStyles = [...ASGAARD_STYLES, ...styles]));
	});

	const onStyleSelect = (ev: Event) => {
		const id = (ev.target! as HTMLSelectElement).value;
		const style = allStyles.find((s) => s.id === id);

		if (style) setStyle(style);
	};
</script>

<select
	value={style.id}
	onchange={onStyleSelect}
	class={['select select-sm', additionalClasses]}
>
	{#each allStyles as style (style.id)}
		<option value={style.id}>{style.name}</option>
	{/each}
</select>

