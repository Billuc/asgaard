export enum QuestType {
  MAIN = 'main',
  SIDE = 'side',
  DAILY = 'daily',
  WEEKLY = 'weekly'
}

export const QUEST_TYPES: { [k in QuestType]: string } = {
  [QuestType.MAIN]: 'Main Quest',
  [QuestType.SIDE]: 'Side Quest',
  [QuestType.DAILY]: 'Daily Quest',
  [QuestType.WEEKLY]: 'Weekly Quest'
};

export class Quest {
  id: string;
  title: string;
  type: QuestType;

  constructor(id: string, title: string, type: QuestType) {
    this.id = id;
    this.title = title;
    this.type = type;
  }
}
