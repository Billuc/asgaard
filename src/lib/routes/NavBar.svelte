<script lang="ts">
	import { asHref, NAV_LINKS, NavLink, Routes, ROUTES } from './routes';
	import { page } from '$app/state';
	import ThemeController from '$lib/theme/ThemeController.svelte';

	function isActive(link: NavLink) {
		const linkForRoute = Object.entries(ROUTES).find(
			(route) => asHref(route[0] as unknown as Routes) === page.url.pathname
		)?.[1].link;
		return linkForRoute === link;
	}
</script>

<div class="dock z-50 flex bg-base-200 md:hidden">
	{#each Object.entries(NAV_LINKS) as [link, data] (link)}
		<a href={asHref(data.route)} class={{ 'dock-active': isActive(link as NavLink) }}>
			<span class="dock-label">{data.name}</span>
		</a>
	{/each}

	<div class="max-w-fit px-2">
		<ThemeController />
	</div>
</div>

<div class="navbar hidden bg-base-200 shadow-sm md:flex">
	<div class="flex-1">
		<span class="text-xl font-black">Asgaard</span>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			{#each Object.entries(NAV_LINKS) as [link, data] (link)}
				<li>
					<a href={asHref(data.route)} class={{ 'menu-active': isActive(link as NavLink) }}>
						<span>{data.name}</span>
					</a>
				</li>
			{/each}

			<li>
				<ThemeController />
			</li>
		</ul>
	</div>
</div>
