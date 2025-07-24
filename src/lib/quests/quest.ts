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

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export const PRIORITIES: { [k in Priority]: string } = {
  [Priority.LOW]: 'Low Priority',
  [Priority.MEDIUM]: 'Medium Priority',
  [Priority.HIGH]: 'High Priority'
};

export enum Effort {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXTREME = 'extreme'
}

export const EFFORTS: { [k in Effort]: string } = {
  [Effort.EASY]: 'Easy',
  [Effort.MEDIUM]: 'Medium',
  [Effort.HARD]: 'Hard',
  [Effort.EXTREME]: 'Extreme'
};

export class Quest {
  id: string;
  title: string;
  type: QuestType;
  priority: Priority;
  effort: Effort;

  constructor(id: string, title: string, type: QuestType, priority: Priority, effort: Effort) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.priority = priority;
    this.effort = effort;
  }

  get reward_coefficient(): number {
    let priorityCoefficient = 1;
    switch (this.priority) {
      case Priority.LOW:
        priorityCoefficient = 0.5;
        break;
      case Priority.MEDIUM:
        priorityCoefficient = 1;
        break;
      case Priority.HIGH:
        priorityCoefficient = 1.5;
        break;
    }

    let effortCoefficient = 1;
    switch (this.effort) {
      case Effort.EASY:
        effortCoefficient = 0.5;
        break;
      case Effort.MEDIUM:
        effortCoefficient = 1;
        break;
      case Effort.HARD:
        effortCoefficient = 1.5;
        break;
      case Effort.EXTREME:
        effortCoefficient = 2;
        break;
    }

    return priorityCoefficient * effortCoefficient;
  }
}
