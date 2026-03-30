export interface Note {
	id: string;
	/** Unix timestamp (ms since epoch) stored in IndexedDB. */
	createdAt: number;
	content: string;
}
