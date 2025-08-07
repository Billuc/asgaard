export enum Routes {
  Home,
  Quests,
  Quest,
  Boards,
  Board
}

export enum NavLink {
  Home = 'home',
  Quests = 'quests',
  Boards = 'boards'
}

export const NAV_LINKS: { [k in NavLink]: { name: string; route: Routes } } = {
  [NavLink.Home]: { name: 'Home', route: Routes.Home },
  [NavLink.Quests]: { name: 'Quests', route: Routes.Quests },
  [NavLink.Boards]: { name: 'Boards', route: Routes.Boards }
};

export const ROUTES: { [k in Routes]: { name: string; path: string; link: NavLink } } = {
  [Routes.Home]: { name: 'Home', path: '/', link: NavLink.Home },
  [Routes.Quests]: {
    name: 'Quests',
    path: '/quests',
    link: NavLink.Quests
  },
  [Routes.Quest]: {
    name: 'Quest',
    path: '/quests/quest',
    link: NavLink.Quests
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
  }
};

export function asHref(route: Routes, params: Record<string, string> = {}): string {
  let href = ROUTES[route].path;
  if (Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    href += `?${query}`;
  }
  return href;
}
