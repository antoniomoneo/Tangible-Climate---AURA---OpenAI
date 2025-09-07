declare global {
  interface Window {
    gtag: (command: string, eventName: string, eventParams?: { [key: string]: any }) => void;
  }
}

export type Language = 'en' | 'es';

export enum GameState {
  LANGUAGE_SELECTION,
  SPLASH,
  START,
  APP_HUB,
  PLAYING,
  GAME_OVER,
  ERROR,
  DASHBOARD,
  KNOWLEDGE_BASE,
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

export type DataPoint = {
  year: number;
  anomaly: number;
};