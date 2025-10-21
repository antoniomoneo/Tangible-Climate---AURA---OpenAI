// FIX: Changed import to bring React into scope for JSX type augmentation.
import React from 'react';

// FIX: Moved global JSX augmentation here to ensure it's applied project-wide,
// resolving errors where standard HTML elements were not recognized by TypeScript.
// This adds A-Frame element types without overwriting the default React types.
declare global {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-sky': any;
      'a-camera': any;
      'a-cursor': any;
      'a-plane': any;
      'a-text': any;
      'a-animation': any;
      'a-image': any;
    }
  }
}

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
  VR_MODE = 'VR_MODE',
  ERROR = 'ERROR',
}

export interface AppDefinition {
  id: string;
  titleKey: string; // Changed from keyof typeof locales.en to break circular dependency
  iconUrl: string; // Path to an image asset for VR
  action: () => void;
  enabled: boolean;
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