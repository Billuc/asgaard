import { goto } from '$app/navigation';
import { updateAt } from '$lib/arrayUtils';
import { generateId } from '$lib/id_generator';
import { BoardItemType, type Board, type BoardItemData } from './board';

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
  }

  return {
    ...board,
    items: [...board.items, { id: generateId('item'), data: itemData }]
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
