import { get, set, setMany, del, values, type UseStore } from 'idb-keyval';

export interface StorageValue<T> {
	version: number;
	data: T;
}

export class Storage<T extends { id: string }> {
	store: UseStore;
	migrations: MigrationPipeline<T>;

	protected constructor(store: UseStore, migrations: MigrationPipeline<T>) {
		this.store = store;
		this.migrations = migrations;
	}

    get version(): number {
        return this.migrations.version + 1;
    }

	async getAll(): Promise<T[]> {
		const vals = await values<StorageValue<T>>(this.store);
		return vals.map((v) => v.data);
	}

	async get(id: string): Promise<T | undefined> {
		const val = await get<StorageValue<T>>(id, this.store);
		return val?.data;
	}

	upsert(data: T): Promise<void> {
		const value: StorageValue<T> = { version: this.version, data: data };
		return set(data.id, value, this.store);
	}

	delete(id: string): Promise<void> {
		return del(id, this.store);
	}

	getAllWithVersions(): Promise<StorageValue<T>[]> {
		return values<StorageValue<T>>(this.store);
	}

	setValues(data: T[]): Promise<void> {
		const vals: [string, StorageValue<T>][] = data.map((d) => [
			d.id,
			{ version: this.version, data: d }
		]);
		return setMany(vals, this.store);
	}

	async migrate(): Promise<void> {
		const valuesWithVersions = (await this.getAllWithVersions()) as StorageValue<any>[];
		const newValues = valuesWithVersions.map((v) => this.migrations.run(v));
		await this.setValues(newValues);
	}
}

export type Migration<T> = (data: any) => T[];

export class MigrationPipeline<T> {
	private migrationFn: (data: StorageValue<any>) => T;
    private _version: number;

	constructor(migrationFn: (data: StorageValue<any>) => T, version: number = 0) {
		this.migrationFn = migrationFn;
        this._version = version;
	}

	next<U>(nextMigrationFn: (data: StorageValue<T>) => U): MigrationPipeline<U> {
		return new MigrationPipeline((data: StorageValue<T>) => {
            if (data.version && data.version > this._version) return data.data as U;

			const t = this.migrationFn(data);
			return nextMigrationFn({ version: data.version, data: t });
		}, this._version + 1);
	}

	run(data: StorageValue<any>): T {
		return this.migrationFn(data);
	}

    get version(): number {
        return this._version;
    }
}
