import { createStore } from 'idb-keyval';
import type { Style } from './style';
import { Storage } from '$lib/storage';
import { styleMigrations } from './migrations';

export class StyleStorage extends Storage<Style> {
  private static _instance: StyleStorage | null = null;

  private constructor() {
    const styleStore = createStore('style-db', 'style-store');
    super(styleStore, styleMigrations);
  }

  static async getInstance(): Promise<StyleStorage> {
    if (!StyleStorage._instance) {
      StyleStorage._instance = new StyleStorage();
      await StyleStorage._instance.migrate();
    }
    return StyleStorage._instance;
  }
}
