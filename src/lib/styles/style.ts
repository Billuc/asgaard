export interface Style {
  id: string;
  name: string;
  flatItems: boolean;
  borderStyle: BorderStyle;
}

export enum BorderStyle {
  None,
  Simple,
  Double,
  Quest
}

export const BORDER_STYLES: { [k in BorderStyle]: { label: string; className: string } } = {
  [BorderStyle.None]: { label: 'None', className: 'border-0' },
  [BorderStyle.Simple]: { label: 'Simple', className: 'border-2' },
  [BorderStyle.Double]: { label: 'Double', className: 'border-4 border-double' },
  [BorderStyle.Quest]: { label: 'Quest', className: 'border-4 border-double' }
};

export const DEFAULT_STYLE: Style = {
  id: 'style-asgaard-default',
  name: '[Asgaard] Default',
  flatItems: false,
  borderStyle: BorderStyle.None
};

export const QUEST_STYLE: Style = {
  id: 'style-asgaard-quest',
  name: '[Asgaard] Quest',
  flatItems: true,
  borderStyle: BorderStyle.Quest
};

export const ASGAARD_STYLES: Style[] = [DEFAULT_STYLE, QUEST_STYLE];
