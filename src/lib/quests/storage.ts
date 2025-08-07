import type { Quest } from './quest';
import { createStore, get, set, del, values } from 'idb-keyval';

export class QuestStorage {
  private static _instance: QuestStorage | null = null;
  private questStore = createStore('quest-db', 'quest-store');

  private constructor() {
    // Private constructor to prevent instantiation
  }

  getAll(): Promise<Quest[]> {
    const questValues = values<Quest>(this.questStore);
    return questValues;
  }

  get(id: string): Promise<Quest | undefined> {
    return get<Quest>(id, this.questStore);
  }

  upsert(quest: Quest): Promise<void> {
    return set(quest.id, quest, this.questStore);
  }

  delete(id: string): Promise<void> {
    return del(id, this.questStore);
  }

  static getInstance(): QuestStorage {
    if (!QuestStorage._instance) {
      QuestStorage._instance = new QuestStorage();
    }
    return QuestStorage._instance;
  }
}
