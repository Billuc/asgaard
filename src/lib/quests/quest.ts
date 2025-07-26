export enum QuestType {
	MAIN = 'main',
	SIDE = 'side',
	DAILY = 'daily',
	WEEKLY = 'weekly'
}

export const QUEST_TYPES: { [k in QuestType]: { label: string; colorClass: string } } = {
	[QuestType.MAIN]: { label: 'Main Quest', colorClass: 'text-primary' },
	[QuestType.SIDE]: { label: 'Side Quest', colorClass: 'text-secondary' },
	[QuestType.DAILY]: { label: 'Daily Quest', colorClass: 'text-accent' },
	[QuestType.WEEKLY]: { label: 'Weekly Quest', colorClass: 'text-base-content' }
};

export enum Priority {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high'
}

export const PRIORITIES: { [k in Priority]: { text: string; colorClass: string } } = {
	[Priority.LOW]: { text: 'Low Priority', colorClass: 'text-yellow-500' },
	[Priority.MEDIUM]: { text: 'Medium Priority', colorClass: 'text-orange-500' },
	[Priority.HIGH]: { text: 'High Priority', colorClass: 'text-red-500' }
};

export enum Effort {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
	EXTREME = 'extreme'
}

export const EFFORTS: { [k in Effort]: { text: string; colorClass: string } } = {
	[Effort.EASY]: { text: 'Easy', colorClass: 'text-green-500' },
	[Effort.MEDIUM]: { text: 'Medium', colorClass: 'text-yellow-500' },
	[Effort.HARD]: { text: 'Hard', colorClass: 'text-orange-500' },
	[Effort.EXTREME]: { text: 'Extreme', colorClass: 'text-red-500' }
};

export interface SubQuest {
	id: string;
	title: string;
	priority: Priority;
	effort: Effort;
	done: boolean;
}

export function rewardCoefficient(subquest: SubQuest): number {
	let priorityCoefficient = 1;
	switch (subquest.priority) {
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
	switch (subquest.effort) {
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

export class Quest {
	id: string;
	title: string;
	type: QuestType;
	subquests: SubQuest[];

	constructor(id: string, title: string, type: QuestType, subquests: SubQuest[]) {
		this.id = id;
		this.title = title;
		this.type = type;
		this.subquests = subquests;
	}
}
