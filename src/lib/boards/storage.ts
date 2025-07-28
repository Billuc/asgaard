import { createStore, get, set, del, values } from 'idb-keyval';
import type { Board } from './board';

export class BoardStorage {
  private boardStore = createStore('board-db', 'board-store');

  getAll(): Promise<Board[]> {
    const boardValues = values<Board>(this.boardStore);
    return boardValues;
  }

  get(id: string): Promise<Board | undefined> {
    return get<Board>(id, this.boardStore);
  }

  upsert(board: Board): Promise<void> {
    return set(board.id, board, this.boardStore);
  }

  delete(id: string): Promise<void> {
    return del(id, this.boardStore);
  }
}

export const boardStorage = new BoardStorage();
