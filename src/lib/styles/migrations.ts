import { MigrationPipeline, type StorageValue } from '../storage';

export const styleMigrations = new MigrationPipeline(migrationZero);

interface StyleV1 {
  id: string;
  name: string;
  flatItems: boolean;
  borderStyle: BorderStyleV1;
}

enum BorderStyleV1 {
  None,
  Simple,
  Double,
  Quest
}

function migrationZero(data: StorageValue<any>) {
    if (data.version) return data.data as any;
    return data as unknown as any;
}
