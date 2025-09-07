import React from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { ChartBarIcon, CompassIcon, CalendarIcon, DashboardIcon, AuraIcon, InfoIcon, QuestionMarkIcon } from './icons';

interface AppHubScreenProps {
  onStartGame: () => void;
  onOpenDashboard: () => void;
  onOpenCalendar: () => void;
  onOpenChat: () => void;
  onOpenAbout: () => void;
  onOpenInstructions: () => void;
  language: Language;
}

const AppHubScreen: React.FC<AppHubScreenProps> = ({ onStartGame, onOpenDashboard, onOpenCalendar, onOpenChat, onOpenAbout, onOpenInstructions, language }) => {
  const t = locales[language];

  const apps = [
    {
      title: t.appHubDataExplorationTitle,
      description: t.appHubDataExplorationDesc,
      icon: <ChartBarIcon />,
      action: onStartGame,
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
      title: t.appHubChatTitle,
      description: t.appHubChatDesc,
      icon: <AuraIcon className="h-5 w-5" />,
      action: onOpenChat,
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
      title: t.appHubAboutTitle,
      description: t.appHubAboutDesc,
      icon: <InfoIcon />,
      action: onOpenAbout,
      enabled: true,
    },
    {
      title: t.appHubDataTourTitle,
      description: t.appHubDataTourDesc,
      icon: <CompassIcon />,
      action: () => {},
      enabled: false,
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fadeIn p-4">
      <div className="w-full max-w-4xl">
        <h1 className="font-title text-4xl md:text-5xl text-cyan-400 mb-4">{t.appHubTitle}</h1>
        <p className="text-gray-300 text-lg mb-8">{t.appHubSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </div>
    </div>
  );
};

export default AppHubScreen;