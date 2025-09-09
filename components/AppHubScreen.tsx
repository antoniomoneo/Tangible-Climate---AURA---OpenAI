import React from 'react';
// FIX: Fix import paths to be relative.
import type { Language } from '../types';
// FIX: Fix import paths to be relative.
import { locales } from '../locales';
import { 
  CalendarIcon, 
  DashboardIcon, 
  QuestionMarkIcon,
  BookOpenIcon,
  DatabaseIcon,
  LightBulbIcon,
  UsersIcon,
  ChatBubbleIcon,
  AcademicCapIcon,
  CompassIcon,
  ViewfinderIcon
} from './icons';

interface AppHubScreenProps {
  onStartGame: () => void;
  onOpenDashboard: () => void;
  onOpenCalendar: () => void;
  onOpenChat: () => void;
  onOpenInstructions: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenEducationalPack: () => void;
  onOpenJoinUs: () => void;
  onOpenScenarioLab: () => void;
  onOpenGlossary: () => void;
  onOpenARMode: () => void;
  language: Language;
}

const AppHubScreen: React.FC<AppHubScreenProps> = ({ onStartGame, onOpenDashboard, onOpenCalendar, onOpenChat, onOpenInstructions, onOpenKnowledgeBase, onOpenEducationalPack, onOpenJoinUs, onOpenScenarioLab, onOpenGlossary, onOpenARMode, language }) => {
  const t = locales[language];

  const apps = [
    {
      title: t.appHubChatTitle,
      description: t.appHubChatDesc,
      icon: <ChatBubbleIcon />,
      action: onOpenChat,
      enabled: true,
    },
    {
      title: t.appHubDataExplorerTitle,
      description: t.appHubDataExplorerDesc,
      icon: <CompassIcon />,
      action: onStartGame,
      enabled: true,
    },
    {
      title: t.appHubScenarioLabTitle,
      description: t.appHubScenarioLabDesc,
      icon: <LightBulbIcon />,
      action: onOpenScenarioLab,
      enabled: true,
    },
    {
      title: t.appHubKnowledgeBaseTitle,
      description: t.appHubKnowledgeBaseDesc,
      icon: <DatabaseIcon />,
      action: onOpenKnowledgeBase,
      enabled: true,
    },
    {
      title: t.appHubGlossaryTitle,
      description: t.appHubGlossaryDesc,
      icon: <BookOpenIcon />,
      action: onOpenGlossary,
      enabled: true,
    },
    {
      title: t.appHubARTitle,
      description: t.appHubARDesc,
      icon: <ViewfinderIcon />,
      action: onOpenARMode,
      enabled: true,
    },
    {
      title: t.appHubEducationalPackTitle,
      description: t.appHubEducationalPackDesc,
      icon: <AcademicCapIcon />,
      action: onOpenEducationalPack,
      enabled: true,
    },
    {
      title: t.appHubDashboardTitle,
      description: t.appHubDashboardDesc,
      icon: <DashboardIcon />,
      action: onOpenDashboard,
      enabled: true,
    },
    {
      title: t.appHubCalendarTitle,
      description: t.appHubCalendarDesc,
      icon: <CalendarIcon />,
      action: onOpenCalendar,
      enabled: true,
    },
    {
      title: t.appHubInstructionsTitle,
      description: t.appHubInstructionsDesc,
      icon: <QuestionMarkIcon />,
      action: onOpenInstructions,
      enabled: true,
    },
    {
      title: t.appHubJoinUsTitle,
      description: t.appHubJoinUsDesc,
      icon: <UsersIcon />,
      action: onOpenJoinUs,
      enabled: true,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center animate-fadeIn">
      <div className="w-full max-w-5xl">
        <h1 className="font-title text-4xl md:text-5xl text-cyan-400 mb-4">{t.appHubTitle}</h1>
        <p className="text-gray-300 text-lg mb-8">{t.appHubSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app, index) => (
            <button
              key={index}
              onClick={app.action}
              disabled={!app.enabled}
              className={`group relative text-left bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 ${
                app.enabled
                  ? 'hover:border-cyan-500 hover:bg-gray-700/50 hover:-translate-y-1'
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gray-700 rounded-md mr-4 text-cyan-400">
                  {app.icon}
                </div>
                <h2 className="text-xl font-bold text-white">{app.title}</h2>
              </div>
              <p className="text-gray-400 text-sm">{app.description}</p>
              {!app.enabled && (
                <div className="absolute top-2 right-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
                  {t.appHubComingSoon}
                </div>
              )}
            </button>
          ))}
            <a
              href="mailto:hello@tangibledata.xyz"
              className="group relative flex flex-col items-center justify-center text-center bg-gray-800/50 p-6 rounded-lg shadow-lg border-2 border-dashed border-gray-600 transition-all duration-300 hover:border-cyan-500 hover:bg-gray-700/50 hover:-translate-y-1"
            >
              <h2 className="text-lg font-bold text-white mb-2">{t.appHubAddYourAppTitle}</h2>
              <p className="text-gray-400 text-sm group-hover:text-cyan-400 transition-colors">{t.appHubAddYourAppDesc}</p>
            </a>
        </div>
      </div>
    </div>
  );
};

export default AppHubScreen;