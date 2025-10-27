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

export const DEFAULT_STYLE: Style = {
  id: '',
  name: '[Asgaard] Default',
  flatItems: false,
  borderStyle: BorderStyle.None
};
