import { AppDefinition } from '../types';

interface AppHandlers {
  onStartGame: () => void;
  onOpenDashboard: () => void;
  onOpenCalendar: () => void;
  onOpenChat: () => void;
  onOpenInstructions: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenJoinUs: () => void;
  onOpenScenarioLab: () => void;
  onOpenGlossary: () => void;
  onOpenARMode: () => void;
  onOpenVRMode: () => void;
  onOpenCrazyViz: () => void;
  onOpenClimateQuest: () => void;
  onOpenCredits: () => void;
}

// These iconUrl paths are treated as keys by the AppHubScreen component.
export const getAppHubApps = (handlers: AppHandlers): AppDefinition[] => [
  {
    id: 'data-explorer',
    titleKey: 'appHubDataExplorerTitle',
    iconUrl: '/icons/compass-icon.svg',
    action: handlers.onStartGame,
    enabled: true,
  },
  {
    id: 'ask-aura',
    titleKey: 'appHubChatTitle',
    iconUrl: '/icons/chat-bubble-icon.svg',
    action: handlers.onOpenChat,
    enabled: true,
  },
  {
    id: 'climate-quest',
    titleKey: 'appHubQuestTitle',
    iconUrl: '/icons/identification-icon.svg',
    action: handlers.onOpenClimateQuest,
    enabled: true,
  },
  {
    id: 'scenario-lab',
    titleKey: 'appHubScenarioLabTitle',
    iconUrl: '/icons/light-bulb-icon.svg',
    action: handlers.onOpenScenarioLab,
    enabled: true,
  },
  {
    id: 'glossary',
    titleKey: 'appHubGlossaryTitle',
    iconUrl: '/icons/book-open-icon.svg',
    action: handlers.onOpenGlossary,
    enabled: true,
  },
  {
    id: 'knowledge-base',
    titleKey: 'appHubKnowledgeBaseTitle',
    iconUrl: '/icons/database-icon.svg',
    action: handlers.onOpenKnowledgeBase,
    enabled: true,
  },
  {
    id: 'ar-mode',
    titleKey: 'appHubARTitle',
    iconUrl: '/icons/viewfinder-icon.svg',
    action: handlers.onOpenARMode,
    enabled: true,
  },
  {
    id: 'vr-mode',
    titleKey: 'appHubVRTitle',
    iconUrl: '/icons/vr-headset-icon.svg',
    action: handlers.onOpenVRMode,
    enabled: true,
  },
  {
    id: 'generative-art',
    titleKey: 'appHubCrazyVizTitle',
    iconUrl: '/icons/swirl-icon.svg',
    action: handlers.onOpenCrazyViz,
    enabled: true,
  },
  {
    id: 'full-dashboard',
    titleKey: 'appHubDashboardTitle',
    iconUrl: '/icons/dashboard-icon.svg',
    action: handlers.onOpenDashboard,
    enabled: true,
  },
  {
    id: 'calendar',
    titleKey: 'appHubCalendarTitle',
    iconUrl: '/icons/calendar-icon.svg',
    action: handlers.onOpenCalendar,
    enabled: true,
  },
  {
    id: 'credits',
    titleKey: 'appHubCreditsTitle',
    iconUrl: '/icons/star-icon.svg',
    action: handlers.onOpenCredits,
    enabled: true,
  },
  {
    id: 'join-us',
    titleKey: 'appHubJoinUsTitle',
    iconUrl: '/icons/users-icon.svg',
    action: handlers.onOpenJoinUs,
    enabled: true,
  },
  {
    id: 'instructions',
    titleKey: 'appHubInstructionsTitle',
    iconUrl: '/icons/question-mark-icon.svg',
    action: handlers.onOpenInstructions,
    enabled: true,
  },
];