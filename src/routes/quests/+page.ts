import type { Quest } from '$lib/quests/quest';
import { questStorage } from '$lib/quests/storage';
import type { PageLoad } from './$types';

export const ssr = false; // Disable sertver-side rendering because we use indexedDb

export const load: PageLoad<{ quests: Quest[] }> = async () => {
  return {
    quests: await questStorage.getAll()
  };
};
