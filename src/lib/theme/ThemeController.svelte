<script lang="ts">
	import { Theme, THEMES } from './theme';
	import ThemeBox from './ThemeBox.svelte';
	import { currentTheme } from './theme';
	import { capitalize } from 'lodash-es';

	let themeState: Theme = $state(Theme.Light);

	$effect(() => {
		const unsub = currentTheme.subscribe((newTheme: Theme) => {
			themeState = newTheme;
			document.body.setAttribute('data-theme', themeState);
		});

		return unsub;
	});
</script>

<div class="dropdown dropdown-end dropdown-top py-0.5 md:dropdown-bottom">
	<div tabindex="0" role="button">
		<ThemeBox theme={themeState} />
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<ul
		tabindex="0"
		class="dropdown-content z-50 max-h-52 overflow-scroll rounded-box bg-base-300 p-2 shadow-2xl"
	>
		{#each THEMES as theme (theme)}
			<li>
				<button onclick={() => currentTheme.set(theme)} class="flex w-full justify-between py-1">
					<span class="mr-2">{capitalize(theme)}</span>
					<ThemeBox {theme} />
				</button>
			</li>
		{/each}
	</ul>
</div>
