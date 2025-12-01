<script lang="ts">
	import { THEMES, currentTheme } from './theme';
	import ThemeCard from './ThemeCard.svelte';
</script>

<div class="flex flex-row flex-wrap justify-center gap-4">
	{#each THEMES as theme (theme)}
		<ThemeCard
			{theme}
			selected={theme === $currentTheme}
			onselect={() => currentTheme.set(theme)}
		/>
	{/each}
</div>
