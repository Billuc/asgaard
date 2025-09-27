<script lang="ts">
	interface Props {
		class?: string | string[];
		x: 'left' | 'center' | 'right';
		y: 'top' | 'center' | 'bottom';
		onclick: () => void;
		text: string;
	}

	const { class: additionalClasses, x, y, onclick, text }: Props = $props();
</script>

<div
	class={{
		'absolute z-20': true,
		'top-0': y === 'top',
		'bottom-0': y === 'bottom',
		'top-1/2 -translate-y-1/2': y === 'center',
		'left-0': x === 'left',
		'right-0': x === 'right',
		'left-1/2 -translate-x-1/2': x === 'center'
	}}
>
	<button class={['btn btn-circle btn-soft', 'border-2', additionalClasses]} {onclick}>
		{text}
	</button>
</div>
