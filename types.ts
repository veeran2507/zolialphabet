
export interface LetterItem {
  letter: string;
  word: string;
  translation: string;
  description: string;
  imagePath: string;
  color: string;
}

export enum AppState {
  GRID = 'GRID',
  DETAIL = 'DETAIL',
  QUIZ = 'QUIZ',
  DRAW = 'DRAW'
}
