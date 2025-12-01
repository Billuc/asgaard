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
	IMAGE = 'image',
	TABLE = 'table'
}

export const BOARD_ITEM_TYPES: { [key in BoardItemType]: { icon: string; label: string } } = {
	[BoardItemType.LIST]: { label: 'List', icon: 'icon-[lucide--list-checks]' },
	[BoardItemType.NOTE]: { label: 'Note', icon: 'icon-[lucide--notebook-text]' },
	[BoardItemType.IMAGE]: { label: 'Image', icon: 'icon-[lucide--image]' },
	[BoardItemType.TABLE]: { label: 'Table', icon: 'icon-[lucide--table]' }
};

export interface BoardItem {
	id: string;
	data: BoardItemData;
}

export type BoardItemData = ListData | NoteData | ImageData | TableData;

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
	columns: TableColumn[];
	rows: TableRow[];
	nbColumns: 2 | 3 | 4 | 5;
}

export interface TableRow {
	id: string; // required for animations
	cells: { [k: string]: TableCell };
}

export type TableCell = string | number | boolean;

export interface TableColumn {
	id: string;
	name: string;
	type: 'string' | 'number' | 'boolean';
}
