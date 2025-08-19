<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'oninput'> {
		oninput?: (value: string) => void;
	}

	let { oninput = () => {}, class: additionalClasses, ...rest }: Props = $props();

	function onInput(event: Event) {
		if (!(event.target instanceof HTMLInputElement)) return;

		const input = event.target as HTMLInputElement;
		oninput(input.value);
	}
</script>

<input class={['input', additionalClasses]} oninput={onInput} {...rest} />
