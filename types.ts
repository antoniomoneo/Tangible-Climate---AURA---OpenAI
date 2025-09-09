export type Language = 'en' | 'es';

export enum GameState {
  LANGUAGE_SELECTION = 'LANGUAGE_SELECTION',
  SPLASH = 'SPLASH',
  START = 'START',
  APP_HUB = 'APP_HUB',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  DASHBOARD = 'DASHBOARD',
  KNOWLEDGE_BASE = 'KNOWLEDGE_BASE',
  AR_MODE = 'AR_MODE',
  ERROR = 'ERROR',
}

export interface Choice {
  text: string;
  nextSceneId: string;
}

export interface StorySegment {
  id: string;
  sceneDescription: string;
  choices: Choice[];
  image?: string;
  chartConfig?: {
    startYear: number;
    endYear: number;
  };
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
    start: Date;
    end: Date;
    description?: string;
    location?: string;
}

export interface GlossaryTerm {
  name: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

export interface DataPoint {
  year: number;
  anomaly: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export type GlossaryViewMode = 'LIST' | 'MIND_MAP' | 'QUIZ';

export interface MindMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'category' | 'term';
  termData?: GlossaryTerm;
}

export interface MindMapLink {
  source: string;
  target: string;
  type: 'category' | 'related';
}