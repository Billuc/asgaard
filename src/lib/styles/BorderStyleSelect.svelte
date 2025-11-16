<script lang="ts">
	import { type BorderStyle, BORDER_STYLES } from './style';

	interface Props {
		borderStyle: BorderStyle;
		setBorderStyle: (newStyle: BorderStyle) => void;
		class?: string | string[];
		disabled?: boolean;
	}

	let { borderStyle, setBorderStyle, class: additionalClasses = [], disabled }: Props = $props();
	let selected = $state(borderStyle.toString());

	const onSelect = async (ev: Event) => {
		const value = (ev.target! as HTMLSelectElement).value;
		setBorderStyle(Number(value) as BorderStyle);
	};
</script>

<select bind:value={selected} onchange={onSelect} class={['select', 'select-sm', additionalClasses]} {disabled}>
	{#each Object.entries(BORDER_STYLES) as style (style[0])}
		<option value={style[0]} class={style[1].className}>{style[1].label}</option>
	{/each}
</select>
