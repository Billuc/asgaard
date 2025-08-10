/*! 🌼 daisyUI 5.0.46 */

import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export enum Theme {
	Light = 'light',
	Dark = 'dark',
	// Cupcake = 'cupcake', //
	Bumblebee = 'bumblebee', //
	Emerald = 'emerald',
	// Corporate = 'corporate', //
	Synthwave = 'synthwave',
	// Retro = 'retro', //
	// Cyberpunk = 'cyberpunk', //
	Valentine = 'valentine',
	Halloween = 'halloween',
	Garden = 'garden', //
	Forest = 'forest',
	// Aqua = 'aqua', //
	// Lofi = 'lofi', //
	// Pastel = 'pastel',
	Fantasy = 'fantasy',
	// Wireframe = 'wireframe', //
	// Black = 'black', //
	// Luxury = 'luxury', //
	Dracula = 'dracula',
	Cmyk = 'cmyk',
	Autumn = 'autumn',
	// Business = 'business',
	// Acid = 'acid', //
	Lemonade = 'lemonade',
	Night = 'night',
	// Coffee = 'coffee', //
	Winter = 'winter', //
	Dim = 'dim',
	// Nord = 'nord', //
	Sunset = 'sunset'
	// Caramellatte = 'caramellatte', //
	// Abyss = 'abyss'
	// Silk = 'silk'
}

export const THEMES = Object.values(Theme);
const LIGHT_THEME: Theme = Theme.Light;
const DARK_THEME: Theme = Theme.Dark;

class ThemeStore {
	private static _instance: ThemeStore | null = null;
	private readonly THEME_KEY = 'asgaard-theme';

	private constructor() { }

	getTheme(): Theme {
		const themeStr = localStorage.getItem(this.THEME_KEY);

		if (!themeStr) {
			return this.prefersDark() ? DARK_THEME : LIGHT_THEME;
		}

		if (THEMES.includes(themeStr as Theme)) return themeStr as Theme;

		return this.prefersDark() ? DARK_THEME : LIGHT_THEME;
	}

	private prefersDark(): boolean {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	setTheme(newTheme: Theme) {
		localStorage.setItem(this.THEME_KEY, newTheme);
	}

	static getInstance(): ThemeStore {
		if (ThemeStore._instance == null) {
			ThemeStore._instance = new ThemeStore();
		}
		return ThemeStore._instance;
	}
}

export const currentTheme = writable(
	(browser && ThemeStore.getInstance().getTheme()) || LIGHT_THEME
);
currentTheme.subscribe((val: Theme) => {
	if (browser) {
		ThemeStore.getInstance().setTheme(val);
		return val;
	}
});
