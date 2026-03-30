import { createDatabase, type AppDatabase } from '$lib/new_storage';
import { generateId } from '$lib/id_generator';
import type { Note } from './note';

// ─── Internal DB schema ───────────────────────────────────────────────────────

type NoteDb = AppDatabase<{ notes: { id: string; createdAt: number; content: string } }>;

let _db: NoteDb | null = null;

async function getDb(): Promise<NoteDb> {
	if (!_db) {
		_db = await createDatabase('notes-db')
			.migrate({
				notes: ['+createdAt:number', '+content:string']
			})
			.open();
	}
	return _db;
}

// ─── NoteStorage ──────────────────────────────────────────────────────────────

export class NoteStorage {
	private static _instance: NoteStorage | null = null;

	private constructor(private readonly db: NoteDb) {}

	static async getInstance(): Promise<NoteStorage> {
		if (!NoteStorage._instance) {
			const db = await getDb();
			NoteStorage._instance = new NoteStorage(db);
		}
		return NoteStorage._instance;
	}

	/** Returns all notes ordered by creation date (newest first). */
	async getAll(): Promise<Note[]> {
		const records = await this.db.getStore('notes').getAll();
		return records.sort((a, b) => b.createdAt - a.createdAt);
	}

	/** Returns a single note by id, or `undefined` if not found. */
	async get(id: string): Promise<Note | undefined> {
		return this.db.getStore('notes').get(id);
	}

	/** Inserts or replaces a note. */
	async upsert(note: Note): Promise<void> {
		return this.db.getStore('notes').upsert(note);
	}

	/** Deletes a note by id. */
	async delete(id: string): Promise<void> {
		return this.db.getStore('notes').delete(id);
	}

	/** Creates a new empty note, persists it, and returns it. */
	async create(): Promise<Note> {
		const note: Note = {
			id: generateId('note'),
			createdAt: Date.now(),
			content: '# New Note'
		};
		await this.upsert(note);
		return note;
	}
}
