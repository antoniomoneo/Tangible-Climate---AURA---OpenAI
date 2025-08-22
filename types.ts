export type Language = 'en' | 'es';

export enum GameState {
  START,
  PLAYING,
  GAME_OVER,
  ERROR,
  DASHBOARD,
}

export interface Choice {
  text: string;
  nextSceneId: string;
}

export interface StorySegment {
  id: string;
  sceneDescription: string;
  image?: string;
  chartConfig?: {
    startYear: number;
    endYear: number;
  };
  choices: Choice[];
}

export interface StoryHistoryItem {
  scene: string;
  choice: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}