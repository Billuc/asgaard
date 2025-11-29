import { MigrationPipeline, type StorageValue } from '../storage';

export const boardMigrations = new MigrationPipeline(migrationZero).next(to_v2);

type BoardV1 = {
		id: string;
		title: string;
		items: any[];
		favorite: boolean;
		styleId: string;
	};

function migrationZero(data: StorageValue<any>) {
    if (data.version) return data.data as BoardV1;
	return data as BoardV1;
}

function to_v2(data: StorageValue<BoardV1>) {
    return {
        ...data.data,
        items: data.data.items.map(i => {
            if (i.data.type !== 'table') return i;

            const columns = i.data.rows.length == 0 ? [] : i.data.rows[0].cells.map((c, i) => ({
                id: `col-${i}`,
                name: c,
                type: "string",
            }));
            const rows = i.data.rows.slice(1).map((r) => ({
                id: r.id,
                cells: r.cells.reduce((acc, curr, i) => {
                    acc[columns[i].name] = curr;
                    return acc;
                }, {}),
            }));

            return {
                ...i,
                data: {
                    ...i.data,
                    columns,
                    rows,
                }
            };
        }),
    }
}

