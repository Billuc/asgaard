import { createStore, get, set, del, values } from 'idb-keyval';
import type { Board, Image } from './board';

export class BoardStorage {
  private static _instance: BoardStorage | null = null;
  private boardStore = createStore('board-db', 'board-store');

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

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

  static getInstance(): BoardStorage {
    if (!BoardStorage._instance) {
      BoardStorage._instance = new BoardStorage();
    }
    return BoardStorage._instance;
  }
}

export class ImageStorage {
  private static _instance: ImageStorage | null = null;
  private imageStore = createStore('image-db', 'image-store');

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  async getUrl(id: string): Promise<string | undefined> {
    const image = await get<Image>(id, this.imageStore);
    if (image) {
      return URL.createObjectURL(image.data);
    }
    return undefined;
  }

  upsert(image: Image): Promise<void> {
    return set(image.id, image, this.imageStore);
  }

  delete(id: string): Promise<void> {
    return del(id, this.imageStore);
  }

  static getInstance(): ImageStorage {
    if (!ImageStorage._instance) {
      ImageStorage._instance = new ImageStorage();
    }
    return ImageStorage._instance;
  }
}
