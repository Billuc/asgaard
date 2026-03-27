import { openDB, type IDBPDatabase } from 'idb';

// ─── Valid field types ────────────────────────────────────────────────────────

/** Supported type annotations for add-column ops. */
type ValidType = 'string' | 'number' | 'boolean' | 'string[]' | 'number[]';

/** Maps a ValidType annotation to its TypeScript type. */
type TypeMap = {
	string: string;
	number: number;
	boolean: boolean;
	'string[]': string[];
	'number[]': number[];
};

// ─── Op string grammar ────────────────────────────────────────────────────────

/**
 * Add-column op. Syntax: `"+fieldName:type"`.
 * The type annotation is **required** — `"+field"` alone is a TypeScript error.
 */
export type AddOp = `+${string}:${ValidType}`;

/** Remove-column op. Syntax: `"-fieldName"`. */
export type RemoveOp = `-${string}`;

/** A single schema operation on one store. */
export type Op = AddOp | RemoveOp;

// ─── Type-level schema computation ───────────────────────────────────────────

type Simplify<T> = { [K in keyof T]: T[K] };

/** Every new store implicitly starts with `{ id: string }`. */
type BaseSchema = { id: string };

/** A migration step: store names mapped to their op arrays. */
type AnyStep = Readonly<Record<string, readonly Op[]>>;

// Extracts the field name from any op string.
type FieldName<O extends string> = O extends `+${infer F}:${ValidType}`
	? F
	: O extends `-${infer F}`
		? F
		: never;

// Resolves the TypeScript type from an add-op annotation.
type FieldTSType<O extends string> = O extends `+${string}:${infer T}`
	? T extends ValidType
		? TypeMap[T]
		: never
	: never;

// Applies a single op to a schema object type.
type ApplyOp<Schema extends object, O extends string> = O extends AddOp
	? Simplify<Omit<Schema, FieldName<O>> & Record<FieldName<O>, FieldTSType<O>>>
	: O extends `-${infer F}`
		? Omit<Schema, F>
		: Schema;

// Applies a list of ops sequentially to a schema object type.
type ApplyOps<Schema extends object, Ops extends readonly string[]> = Ops extends readonly []
	? Schema
	: Ops extends readonly [infer First extends string, ...infer Rest extends readonly string[]]
		? ApplyOps<ApplyOp<Schema, First>, Rest>
		: Schema;

/**
 * Applies one migration step to the current schema map.
 * - Stores mentioned in the step have their ops applied.
 * - Stores appearing for the first time start from `BaseSchema`.
 * - Stores not mentioned in the step are left unchanged.
 */
type ApplyStep<Schemas extends Record<string, object>, Step extends AnyStep> = Simplify<{
	[K in keyof Schemas | keyof Step]: K extends keyof Step
		? Simplify<ApplyOps<K extends keyof Schemas ? Schemas[K] : BaseSchema, Step[K & keyof Step]>>
		: K extends keyof Schemas
			? Schemas[K]
			: never;
}>;

// ─── Runtime helpers ──────────────────────────────────────────────────────────

interface InternalStep {
	ops: AnyStep;
	transforms?: Record<string, (data: any) => any>;
}

/** Returns the sane zero-value for a ValidType annotation string. */
function typeDefault(type: string): unknown {
	if (type === 'number') return 0;
	if (type === 'boolean') return false;
	if (type.endsWith('[]')) return [];
	return ''; // string
}

/** Parses field→default pairs for all add-ops in an op array. */
function addDefaults(ops: readonly string[]): { field: string; value: unknown }[] {
	return ops
		.map((op) => op.match(/^\+([^:]+):(.+)$/))
		.filter((m): m is RegExpMatchArray => m !== null)
		.map((m) => ({ field: m[1], value: typeDefault(m[2]) }));
}

/** Parses field names for all remove-ops in an op array. */
function removedFields(ops: readonly string[]): string[] {
	return ops.filter((op) => op.startsWith('-')).map((op) => op.slice(1));
}

// ─── CollectionStore ──────────────────────────────────────────────────────────

/**
 * Typed CRUD operations for one entity type backed by a single IDB object store.
 * Obtain instances via `AppDatabase.getStore('storeName')`.
 */
export class CollectionStore<T extends { id: string }> {
	readonly #db: IDBPDatabase;
	readonly #storeName: string;

	constructor(db: IDBPDatabase, storeName: string) {
		this.#db = db;
		this.#storeName = storeName;
	}

	/** Returns all records in the store. */
	getAll(): Promise<T[]> {
		return this.#db.getAll(this.#storeName);
	}

	/** Returns a single record by id, or `undefined` if not found. */
	get(id: string): Promise<T | undefined> {
		return this.#db.get(this.#storeName, id);
	}

	/** Inserts or replaces a record. The `id` field is used as the IDB key. */
	async upsert(data: T): Promise<void> {
		await this.#db.put(this.#storeName, data);
	}

	/** Deletes a record by id. */
	delete(id: string): Promise<void> {
		return this.#db.delete(this.#storeName, id);
	}
}

// ─── AppDatabase ──────────────────────────────────────────────────────────────

/**
 * The opened database. Use `getStore` to obtain a typed `CollectionStore`
 * for each entity type.
 */
export class AppDatabase<TSchemas extends Record<string, object>> {
	readonly #db: IDBPDatabase;

	constructor(db: IDBPDatabase) {
		this.#db = db;
	}

	/**
	 * Returns a fully-typed `CollectionStore` for the named object store.
	 * The store type is inferred from the `.migrate()` steps on the builder.
	 *
	 * @example
	 * const boards = db.getStore('boards');
	 * // CollectionStore<{ id: string; title: string; tags: string[] }>
	 */
	getStore<K extends keyof TSchemas & string>(
		name: K
	): CollectionStore<TSchemas[K] & { id: string }> {
		return new CollectionStore(this.#db, name);
	}

	/** The underlying `IDBPDatabase` for advanced operations. */
	get raw(): IDBPDatabase {
		return this.#db;
	}
}

// ─── DatabaseBuilder ──────────────────────────────────────────────────────────

/**
 * Fluent builder for opening a versioned IndexedDB database.
 *
 * Create one with `createDatabase(name)`, chain `.migrate()` calls —
 * one per schema version — then await `.open()`.
 *
 * The IDB version is derived automatically: it equals the number of
 * `.migrate()` calls. Adding a new step always increments the version.
 */
export class DatabaseBuilder<TSchemas extends Record<string, object> = {}> {
	readonly #name: string;
	readonly #steps: InternalStep[];

	private constructor(name: string, steps: InternalStep[]) {
		this.#name = name;
		this.#steps = steps;
	}

	/** @internal Use `createDatabase(name)` instead. */
	static _create(name: string): DatabaseBuilder {
		return new DatabaseBuilder(name, []);
	}

	/**
	 * Adds one migration step, incrementing the IDB schema version by 1.
	 *
	 * **`ops`** — map of store names → field operations:
	 *
	 * | String              | TypeScript effect                 |
	 * |---------------------|-----------------------------------|
	 * | `"+field:string"`   | add / replace field as `string`   |
	 * | `"+field:number"`   | add / replace field as `number`   |
	 * | `"+field:boolean"`  | add / replace field as `boolean`  |
	 * | `"+field:string[]"` | add / replace field as `string[]` |
	 * | `"+field:number[]"` | add / replace field as `number[]` |
	 * | `"-field"`          | remove field from the type        |
	 *
	 * The type annotation is **required** on add-ops; `"+field"` alone is a TypeScript error.
	 * A store appearing for the first time is created automatically.
	 *
	 * New fields are automatically backfilled with sane defaults (0, false, [], '')
	 * and removed fields are deleted from all existing records.
	 *
	 * **`transforms`** — optional per-store transform. Receives the already-patched
	 * post-step record (defaults applied, removed fields gone) and returns the same
	 * type. Use it to overwrite a default with a computed value, normalise data,
	 * or derive one field from another.
	 */
	migrate<const U extends AnyStep>(
		ops: U,
		transforms?: {
			[K in keyof U]?: (
				data: ApplyStep<TSchemas, U>[K & keyof ApplyStep<TSchemas, U>]
			) => ApplyStep<TSchemas, U>[K & keyof ApplyStep<TSchemas, U>];
		}
	): DatabaseBuilder<ApplyStep<TSchemas, U>> {
		return new DatabaseBuilder(this.#name, [
			...this.#steps,
			{ ops, transforms: transforms as Record<string, (data: any) => any> | undefined }
		]) as unknown as DatabaseBuilder<ApplyStep<TSchemas, U>>;
	}

	/**
	 * Opens (or upgrades) the IndexedDB database.
	 *
	 * - Object stores are created the first time their name appears in a step.
	 * - Data transforms run inside the `upgradeneeded` transaction (atomic).
	 * - IDB version = number of `.migrate()` calls.
	 */
	async open(): Promise<AppDatabase<TSchemas>> {
		const steps = this.#steps;
		const dbVersion = Math.max(1, steps.length);

		// Track which step first introduces each store so we create it exactly once.
		const storeFirstStep = new Map<string, number>();
		for (let i = 0; i < steps.length; i++) {
			for (const storeName of Object.keys(steps[i].ops)) {
				if (!storeFirstStep.has(storeName)) storeFirstStep.set(storeName, i);
			}
		}

		const db = await openDB(this.#name, dbVersion, {
			async upgrade(db, oldVersion, newVersion, tx) {
				const target = newVersion ?? dbVersion;
				for (let i = oldVersion; i < target; i++) {
					const step = steps[i];
					for (const storeName of Object.keys(step.ops)) {
						// Create the store the first time it appears in the migration chain.
						if (storeFirstStep.get(storeName) === i && !db.objectStoreNames.contains(storeName)) {
							db.createObjectStore(storeName, { keyPath: 'id' });
						}
						// Auto-backfill defaults, remove stale fields, then run optional transform.
						if (db.objectStoreNames.contains(storeName)) {
							const defaults = addDefaults(step.ops[storeName] as readonly string[]);
							const removals = removedFields(step.ops[storeName] as readonly string[]);
							const transform = step.transforms?.[storeName];
							if (defaults.length > 0 || removals.length > 0 || transform) {
								const store = tx.objectStore(storeName);
								const records: any[] = await store.getAll();
								await Promise.all(
									records.map((r) => {
										let patched = { ...r };
										for (const { field, value } of defaults) {
											if (!(field in patched)) patched[field] = value;
										}
										for (const field of removals) {
											delete patched[field];
										}
										if (transform) patched = transform(patched);
										return store.put(patched);
									})
								);
							}
						}
					}
				}
			}
		});

		return new AppDatabase(db) as AppDatabase<TSchemas>;
	}
}

/**
 * Creates a new `DatabaseBuilder` for the named IndexedDB database.
 * Chain `.migrate()` calls then await `.open()` to get a typed `AppDatabase`.
 */
export function createDatabase(name: string): DatabaseBuilder {
	return DatabaseBuilder._create(name);
}

// ─── Example ──────────────────────────────────────────────────────────────────
//
// import { createDatabase } from '$lib/new_storage';
// import { nanoid } from 'nanoid';
//
// const db = await createDatabase('asgaard-db')
// 	// Version 1 — create 'boards' and 'styles' stores with their initial columns.
// 	.migrate({
// 		boards: ['+title:string', '+archived:boolean'],
// 		styles: ['+name:string', '+color:string']
// 	})

// 	// Version 2 — evolve 'boards': add 'tags' (auto-backfilled []), drop 'archived'.
// 	.migrate({ boards: ['+tags:string[]', '-archived'] })

// 	// Version 3 — add 'slug', derived from 'title' (transform receives post-step record).
// 	.migrate(
// 		{ boards: ['+slug:string'] },
// 		{ boards: (r) => ({ ...r, slug: r.title.toLowerCase().replace(/\s+/g, '-') }) }
// 		//                          ^ r.slug is '' (auto-backfilled), overwritten here
// 	)

// 	.open();
//
// // getStore infers the final type automatically:
// const boards = db.getStore('boards');
// // CollectionStore<{ id: string; title: string; tags: string[]; slug: string }>
// //   'archived' is gone from v2, 'tags' and 'slug' added in v2/v3.
//
// const id = `board:${nanoid()}`; // type-prefixed key lives in the object
// await boards.upsert({ id, title: 'Sprint 1', tags: ['feature'], slug: 'sprint-1' });
//
// const all = await boards.getAll();
// //    ^ { id: string; title: string; tags: string[]; slug: string }[]
//
// const one = await boards.get(id);
// //    ^ { id: string; title: string; tags: string[]; slug: string } | undefined
//
// await boards.delete(id);
//
// ── Type error examples ───────────────────────────────────────────────────────
//
// .migrate({ boards: ['+title'] })          // ✗ missing type annotation → TS error
// .migrate({ boards: ['+title:Date'] })     // ✗ unsupported type → TS error
// boards.upsert({ id, title: 42, tags: [] }) // ✗ title must be string → TS error
