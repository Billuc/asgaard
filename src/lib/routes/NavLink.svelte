<script lang="ts">
	import { asHref, NAV_LINKS, NavLink, isActive } from './routes';

	interface Props {
		navLink: NavLink;
		isMenu?: boolean;
		isDock?: boolean;
	}

	const { navLink, isMenu, isDock }: Props = $props();

	const linkData = $derived(NAV_LINKS[navLink]);
	const active = $derived(isActive(navLink));
</script>

<a
	href={asHref(linkData.route)}
	class={{ 'menu-active': isMenu && active, 'dock-active': isDock && active }}
>
	<span class={[linkData.icon, 'text-lg']}></span>
	<span class={{ 'dock-label': isDock }}>{linkData.name}</span>
</a>
