import { resolve } from '$app/paths';
import { page } from '$app/state';
import type { Pathname } from '$app/types';

export enum Routes {
  Home,
  Quests,
  Quest,
  Boards,
  Board,
  Workspace,
  Settings
}

export enum NavLink {
  Home = 'home',
  // Quests = 'quests',
  Boards = 'boards',
  // Workspace = 'workspace',
  Settings = 'settings'
}

export const NAV_LINKS: { [k in NavLink]: { name: string; route: Routes; icon: string } } = {
  [NavLink.Home]: { name: 'Home', route: Routes.Home, icon: 'icon-[lucide--home]' },
  // [NavLink.Quests]: { name: 'Quests', route: Routes.Quests },
  [NavLink.Boards]: { name: 'Boards', route: Routes.Boards, icon: 'icon-[lucide--clipboard-list]' },
  // [NavLink.Workspace]: { name: 'Workspace', route: Routes.Workspace },
  [NavLink.Settings]: { name: 'Settings', route: Routes.Settings, icon: 'icon-[lucide--cog]' }
};

export function isActive(link: NavLink) {
  const linkForRoute = Object.values(ROUTES).find(
    (route) => route.path === page.url.pathname
  )?.link;
  return linkForRoute === link;
}

export const ROUTES: { [k in Routes]: { name: string; path: Pathname; link: NavLink } } = {
  [Routes.Home]: { name: 'Home', path: '/', link: NavLink.Home },
  [Routes.Quests]: {
    name: 'Quests',
    path: '/quests',
    link: NavLink.Home
    // link: NavLink.Quests
  },
  [Routes.Quest]: {
    name: 'Quest',
    path: '/quests/quest',
    link: NavLink.Home
    // link: NavLink.Quests
  },
  [Routes.Boards]: {
    name: 'Boards',
    path: '/boards',
    link: NavLink.Boards
  },
  [Routes.Board]: {
    name: 'Board',
    path: '/boards/board',
    link: NavLink.Boards
  },
  [Routes.Workspace]: {
    name: 'Workspace',
    path: '/workspace',
    link: NavLink.Home
    // link: NavLink.Workspace
  },
  [Routes.Settings]: {
    name: 'Settings',
    path: '/settings',
    link: NavLink.Settings
  }
};

export function asHref(route: Routes, params: Record<string, string> = {}): string {
  let href = resolve(ROUTES[route].path);
  if (Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    href += `?${query}`;
  }
  return href;
}
