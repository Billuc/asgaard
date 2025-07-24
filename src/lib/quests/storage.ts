import type { Quest } from './quest';
import { createStore, get, set, del, values } from 'idb-keyval';

export class QuestStorage {
  private questStore = createStore('quest-db', 'quest-store');

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
}

export const questStorage = new QuestStorage();
