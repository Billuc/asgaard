import { questStorage } from '$lib/quests/storage';
import type { PageLoad } from './$types';
import type { Quest } from '$lib/quests/quest';
import { error } from '@sveltejs/kit';

export const ssr = false; // Disable server-side rendering because we use indexedDb

export const load: PageLoad<{ quest: Quest }> = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (!id) error(400, { message: 'An ID is required !' });

  const quest = await questStorage.get(id);
  console.log('Quest with ID ', id, quest);

  if (!quest) error(404, { message: 'Could not find a quest with this ID !' });

  return { quest: quest };
};
