<script lang="ts">
	import { asHref, NAV_LINKS, ROUTES } from './routes';
	import { page } from '$app/state';

	let linkForRoute = $derived.by(() => {
		return Object.values(ROUTES).find((route) => route.path === page.url.pathname)?.link;
	});
</script>

<div class="dock z-50 flex bg-base-200 md:hidden">
	{#each Object.entries(NAV_LINKS) as [link, data] (link)}
		<a href={asHref(data.route)} class={{ 'dock-active': linkForRoute === link }}>
			<span class="dock-label">{data.name}</span>
		</a>
	{/each}
</div>

<div class="mb-4 navbar hidden bg-base-200 shadow-sm md:flex">
	<div class="flex-1">
		<span class="text-xl font-black">Asgaard</span>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			{#each Object.entries(NAV_LINKS) as [link, data] (link)}
				<li>
					<a href={asHref(data.route)} class={{ 'dock-active': linkForRoute === link }}>
						<span class="dock-label">{data.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
