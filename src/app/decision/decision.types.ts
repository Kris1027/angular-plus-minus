export type Kind = 'plus' | 'minus';

export type DecisionItem = {
  readonly id: string;
  readonly text: string;
  readonly createdAt: number;
};

export type DecisionState = {
  readonly topic: string;
  readonly pluses: ReadonlyArray<DecisionItem>;
  readonly minuses: ReadonlyArray<DecisionItem>;
};

export type Verdict = 'plus' | 'minus' | 'tie' | 'empty';

export const STORAGE_KEY = 'plus-minus:v1';

export const EMPTY_STATE: DecisionState = {
  topic: '',
  pluses: [],
  minuses: [],
};
