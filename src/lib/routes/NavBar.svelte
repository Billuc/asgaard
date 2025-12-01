<script lang="ts">
	import { NAV_LINKS, NavLink } from './routes';
	import { asset } from '$app/paths';
	import NavLinkEl from './NavLink.svelte';
</script>

<div class="dock z-50 flex bg-base-200 md:hidden">
	<div class="max-w-fit px-2">
		<img src={asset('/favicon.svg')} width="32" height="32" alt="Asgaard logo" />
	</div>

	{#each Object.keys(NAV_LINKS) as link (link)}
		<NavLinkEl navLink={link as NavLink} isDock />
	{/each}
</div>

<div class="navbar hidden bg-base-200 shadow-sm md:flex">
	<div class="flex-1">
		<img
			src={asset('/favicon.svg')}
			width="32"
			height="32"
			alt="Asgaard logo"
			class="mr-2 ml-4 inline"
		/>
		<span class="align-middle text-xl font-black">Asgaard</span>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			{#each Object.keys(NAV_LINKS) as link (link)}
				<li>
					<NavLinkEl navLink={link as NavLink} isMenu />
				</li>
			{/each}
		</ul>
	</div>
</div>
