export interface Board {
	id: string;
	title: string;
	items: BoardItem[];
	favorite: boolean;
}

export enum BoardItemType {
	LIST = 'list',
	NOTE = 'note',
	QUEST = 'quest',
	IMAGE = 'image'
}

export const BOARD_ITEM_TYPES: { [key in BoardItemType]: string } = {
	[BoardItemType.LIST]: 'List',
	[BoardItemType.NOTE]: 'Note',
	[BoardItemType.QUEST]: 'Quest',
	[BoardItemType.IMAGE]: 'Image'
};

export interface BoardItem {
	id: string;
	data: BoardItemData;
}

export type BoardItemData = ListData | QuestData | NoteData | ImageData;

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
	image: Blob | null;
	title: string;
}
