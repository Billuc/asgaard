export enum QuestType {
	MAIN = 'main',
	SIDE = 'side',
	DAILY = 'daily',
	WEEKLY = 'weekly'
}

export const QUEST_TYPES: {
	[k in QuestType]: {
		label: string;
		colorClass: string;
		borderClass: string;
		beforeClass: string;
		afterClass: string;
	};
} = {
	[QuestType.MAIN]: {
		label: 'Main Quest',
		colorClass: 'text-primary',
		borderClass: 'border-primary',
		beforeClass: 'before:text-primary',
		afterClass: 'after:text-primary'
	},
	[QuestType.SIDE]: {
		label: 'Side Quest',
		colorClass: 'text-secondary',
		borderClass: 'border-secondary',
		beforeClass: 'before:text-secondary',
		afterClass: 'after:text-secondary'
	},
	[QuestType.DAILY]: {
		label: 'Daily Quest',
		colorClass: 'text-accent',
		borderClass: 'border-accent',
		beforeClass: 'before:text-accent',
		afterClass: 'after:text-accent'
	},
	[QuestType.WEEKLY]: {
		label: 'Weekly Quest',
		colorClass: 'text-base-content',
		borderClass: 'border-base-content',
		beforeClass: 'before:text-base-content',
		afterClass: 'after:text-base-content'
	}
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
	done: boolean;
}

export interface Quest {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	type: QuestType;
	subquests: SubQuest[];
}
