export interface Board {
  id: string;
  title: string;
  items: BoardItem[];
}

export enum BoardType {
  LIST = 'list',
  NOTE = 'note',
  QUEST = 'quest'
}

export interface BoardItem {
  id: string;
  data: BoardItemData;
}

export type BoardItemData = ListData | QuestData | NoteData;

export interface ListData {
  type: BoardType.LIST;
  title: string;
  hideDone: boolean;
  list: ListItem[];
}

export interface ListItem {
  done: boolean;
  label: string;
}

export interface QuestData {
  type: BoardType.QUEST;
  questId: string;
}

export interface NoteData {
  type: BoardType.NOTE;
  note: string;
}
