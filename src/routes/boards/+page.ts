import type { Board } from '$lib/boards/board';
import { boardStorage } from '$lib/boards/storage';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad<{ boards: Board[] }> = async () => {
  return {
    boards: await boardStorage.getAll()
  };
};
