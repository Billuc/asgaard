import type { Workspace } from './workspace';

export class WorkspaceStorage {
  private static _instance: WorkspaceStorage | null = null;
  private static readonly STORAGE_KEY = 'workspace';

  private constructor() {
    // Private constructor to prevent instantiation
  }

  get(): Workspace | undefined {
    const workspaceData = sessionStorage.getItem(WorkspaceStorage.STORAGE_KEY);
    if (workspaceData) {
      return JSON.parse(workspaceData) as Workspace;
    }
  }

  upsert(workspace: Workspace): void {
    sessionStorage.setItem(WorkspaceStorage.STORAGE_KEY, JSON.stringify(workspace));
  }

  delete(): void {
    sessionStorage.removeItem(WorkspaceStorage.STORAGE_KEY);
  }

  static getInstance(): WorkspaceStorage {
    if (!WorkspaceStorage._instance) {
      WorkspaceStorage._instance = new WorkspaceStorage();
    }
    return WorkspaceStorage._instance;
  }
}
