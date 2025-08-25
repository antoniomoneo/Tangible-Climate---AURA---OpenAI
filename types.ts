export type Language = 'en' | 'es';

export enum GameState {
  LANGUAGE_SELECTION,
  SPLASH,
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

export interface CalendarEvent {
    summary: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
}