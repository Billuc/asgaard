import { boardStorage } from '$lib/boards/storage';
import type { PageLoad } from './$types';
import type { Board } from '$lib/boards/board';
import { error } from '@sveltejs/kit';

export const ssr = false; // Disable server-side rendering because we use indexedDb

export const load: PageLoad<{ board: Board }> = async ({ url }) => {
  const id = url.searchParams.get('id');

  if (!id) error(400, { message: 'An ID is required !' });

  const board = await boardStorage.get(id);
  console.log('Board with ID ', id, board);

  if (!board) error(404, { message: 'Could not find a board with this ID !' });

  return { board: board };
};
