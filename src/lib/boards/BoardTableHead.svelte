<script lang="ts">
	let { children = undefined, class: additionalClasses = '' } = $props();
</script>

<th class={['border-r-base-content/5 not-last:border-r', additionalClasses]}>
	{@render children?.()}
</th>
