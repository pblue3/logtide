import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'dark';

function getInitialTheme(): Theme {
  return 'dark';
}

function createThemeStore() {
  const { subscribe, set } = writable<Theme>('dark');

  function applyTheme() {
    if (browser) {
      const root = document.documentElement;
      root.classList.add('dark');
    }
  }

  if (browser) {
    applyTheme();
  }

  return {
    subscribe,
    set: () => {
      set('dark');
    },
  };
}

export const themeStore = createThemeStore();
