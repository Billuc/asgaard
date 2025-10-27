export interface Board {
	id: string;
	title: string;
	items: BoardItem[];
	favorite: boolean;
	styleId: string;
}

export enum BoardItemType {
	LIST = 'list',
	NOTE = 'note',
	QUEST = 'quest',
	IMAGE = 'image',
	TABLE = 'table'
}

export const BOARD_ITEM_TYPES: { [key in BoardItemType]: string } = {
	[BoardItemType.LIST]: 'List',
	[BoardItemType.NOTE]: 'Note',
	[BoardItemType.QUEST]: 'Quest',
	[BoardItemType.IMAGE]: 'Image',
	[BoardItemType.TABLE]: 'Table'
};

export interface BoardItem {
	id: string;
	data: BoardItemData;
}

export type BoardItemData = ListData | QuestData | NoteData | ImageData | TableData;

export interface ListData {
	type: BoardItemType.LIST;
	title: string;
	hideDone: boolean;
	list: ListItem[];
}

export interface ListItem {
	id: string; // required for animations
	done: boolean;
	label: string;
}

export interface QuestData {
	type: BoardItemType.QUEST;
	questId: string;
}

export interface NoteData {
	type: BoardItemType.NOTE;
	note: string;
}

export interface ImageData {
	type: BoardItemType.IMAGE;
	imageIds: string[];
	title: string;
}

export interface Image {
	id: string;
	data: Blob;
}

export interface TableData {
	type: BoardItemType.TABLE;
	title: string;
	rows: TableRow[];
}

export interface TableRow {
	id: string; // required for animations
	cells: string[];
}
