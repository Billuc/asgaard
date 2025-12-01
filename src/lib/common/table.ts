import type { Snippet } from 'svelte';

export interface Column {
  label: string;
  type?: 'string' | 'number' | 'boolean';
  input?: Snippet<[string, any?, ((value: any) => void)?, boolean?]>;
  disabled?: boolean;
}

export interface ItemData<Item extends { id: string }> {
  item: Item;
  disabled?: boolean;
}
