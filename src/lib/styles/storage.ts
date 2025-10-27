import { createStore, get, set, del, values } from 'idb-keyval';
import type { Style } from './style';

export class StyleStorage {
  private static _instance: StyleStorage | null = null;
  private styleStore = createStore('style-db', 'style-store');

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  getAll(): Promise<Style[]> {
    const styles = values<Style>(this.styleStore);
    return styles;
  }

  get(id: string): Promise<Style | undefined> {
    return get<Style>(id, this.styleStore);
  }

  upsert(style: Style): Promise<void> {
    return set(style.id, style, this.styleStore);
  }

  delete(id: string): Promise<void> {
    return del(id, this.styleStore);
  }

  static getInstance(): StyleStorage {
    if (!StyleStorage._instance) {
      StyleStorage._instance = new StyleStorage();
    }
    return StyleStorage._instance;
  }
}
