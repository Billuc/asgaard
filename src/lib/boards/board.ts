import type { Quest } from '$lib/quests/quest';

export class Board {
  id: string;
  title: string;
  items: BoardItem[];

  constructor(id: string, title: string, items: BoardItem[] = []) {
    this.id = id;
    this.title = title;
    this.items = items;
  }
}

export enum BoardType {
  LIST = 'list',
  NOTE = 'note',
  QUEST = 'quest'
}

export interface BoardItem {
  id: string;
  title: string;
  type: BoardType;
  quest?: Quest; // Optional, only for QUEST type
  list?: string[]; // Optional, only for LIST type
  note?: string; // Optional, only for NOTE type
}
