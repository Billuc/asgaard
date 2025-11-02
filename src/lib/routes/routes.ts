import { base } from '$app/paths';

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
  Workspace = 'workspace',
  Settings = 'settings'
}

export const NAV_LINKS: { [k in NavLink]: { name: string; route: Routes } } = {
  [NavLink.Home]: { name: 'Home', route: Routes.Home },
  // [NavLink.Quests]: { name: 'Quests', route: Routes.Quests },
  [NavLink.Boards]: { name: 'Boards', route: Routes.Boards },
  [NavLink.Workspace]: { name: 'Workspace', route: Routes.Workspace },
  [NavLink.Settings]: { name: 'Settings', route: Routes.Settings }
};

export const ROUTES: { [k in Routes]: { name: string; path: string; link: NavLink } } = {
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
    link: NavLink.Workspace
  },
  [Routes.Settings]: {
    name: 'Settings',
    path: '/settings',
    link: NavLink.Settings
  }
};

export function asHref(route: Routes, params: Record<string, string> = {}): string {
  let href = base + ROUTES[route].path;
  if (Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    href += `?${query}`;
  }
  return href;
}
