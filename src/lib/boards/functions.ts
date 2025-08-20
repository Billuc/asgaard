import { swap, updateAt } from '$lib/arrayUtils';
import { generateId } from '$lib/id_generator';
import { BoardItemType, type Board, type BoardItemData, type ListData } from './board';

export function newItem(board: Board, itemType: BoardItemType): Board {
  let itemData: BoardItemData;

  switch (itemType) {
    case BoardItemType.LIST:
      itemData = {
        type: BoardItemType.LIST,
        title: 'New list',
        hideDone: false,
        list: []
      };
      break;
    case BoardItemType.NOTE:
      itemData = { type: BoardItemType.NOTE, note: 'New note' };
      break;
    case BoardItemType.QUEST:
      itemData = { type: BoardItemType.QUEST, questId: '' };
      break;
    case BoardItemType.IMAGE:
      itemData = { type: BoardItemType.IMAGE, image: null, title: 'New image' };
      break;
    case BoardItemType.TABLE:
      itemData = {
        type: BoardItemType.TABLE,
        title: 'New table',
        rows: []
      };
      break;
    default:
      throw new Error(`Unknown item type: ${itemType}`);
  }

  return {
    ...board,
    items: [...board.items, { id: generateId('card'), data: itemData }]
  };
}

export function deleteBlock(board: Board, itemId: string): Board {
  return {
    ...board,
    items: board.items.filter((item) => item.id !== itemId)
  };
}

export function moveBlockUp(board: Board, itemId: string): Board {
  const index = board.items.findIndex((item) => item.id === itemId);

  if (index > 0) {
    const newItems = [...board.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    return { ...board, items: newItems };
  }

  return board;
}

export function moveBlockDown(board: Board, itemId: string): Board {
  const index = board.items.findIndex((item) => item.id === itemId);

  if (index < board.items.length - 1) {
    const newItems = [...board.items];
    [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
    return { ...board, items: newItems };
  }

  return board;
}

export function updateItem(board: Board, itemId: string, newData: BoardItemData): Board {
  const itemIndex = board.items.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    return {
      ...board,
      items: updateAt(board.items, itemIndex, { ...board.items[itemIndex], data: newData })
    };
  }

  return board;
}

export function listItemDown(listData: ListData, itemId: string): ListData {
  const considerDone = !listData.hideDone;
  let itemIndex = -1;
  let nextIndex = -1;

  for (const [i, item] of listData.list.entries()) {
    if (item.id === itemId && itemIndex === -1) itemIndex = i;
    if (itemIndex !== -1 && i > itemIndex && (considerDone || !item.done)) {
      nextIndex = i;
      break;
    }
  }

  if (itemIndex === -1 || nextIndex === -1) return listData;

  return {
    ...listData,
    list: swap(listData.list, itemIndex, nextIndex)
  };
}

export function listItemUp(listData: ListData, itemId: string): ListData {
  const considerDone = !listData.hideDone;
  let itemIndex = -1;
  let prevIndex = -1;

  for (const [i, item] of listData.list.entries()) {
    if (item.id === itemId) {
      itemIndex = i;
      break;
    }
    if (itemIndex === -1 && (considerDone || !item.done)) prevIndex = i;
  }

  if (itemIndex === -1 || prevIndex === -1) return listData;

  return {
    ...listData,
    list: swap(listData.list, itemIndex, prevIndex)
  };
}
