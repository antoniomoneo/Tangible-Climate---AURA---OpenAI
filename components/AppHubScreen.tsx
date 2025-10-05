import React from 'react';
// FIX: Fix import paths to be relative.
import type { Language, AppDefinition } from '../types';
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
  ViewfinderIcon,
  StarIcon,
  IdentificationIcon,
  SwirlIcon,
  InfoIcon,
  VRHeadsetIcon,
} from './icons';

interface AppHubScreenProps {
  apps: AppDefinition[];
  language: Language;
}

const iconMap: { [key: string]: React.ReactNode } = {
  ChatBubbleIcon: <ChatBubbleIcon />,
  CompassIcon: <CompassIcon />,
  IdentificationIcon: <IdentificationIcon />,
  SwirlIcon: <SwirlIcon />,
  LightBulbIcon: <LightBulbIcon />,
  DatabaseIcon: <DatabaseIcon />,
  BookOpenIcon: <BookOpenIcon />,
  ViewfinderIcon: <ViewfinderIcon />,
  VRHeadsetIcon: <VRHeadsetIcon />,
  AcademicCapIcon: <AcademicCapIcon />,
  StarIcon: <StarIcon />,
  DashboardIcon: <DashboardIcon />,
  CalendarIcon: <CalendarIcon />,
  QuestionMarkIcon: <QuestionMarkIcon />,
  UsersIcon: <UsersIcon />,
  InfoIcon: <InfoIcon />,
};

const getIconByName = (iconUrl: string): React.ReactNode => {
    const iconName = iconUrl.split('/').pop()?.replace('.svg', '');
    const formattedName = iconName ? iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-(\w)/g, (_, c) => c.toUpperCase()) + 'Icon' : '';
    return iconMap[formattedName] || <QuestionMarkIcon />;
};

const AppHubScreen: React.FC<AppHubScreenProps> = ({ apps, language }) => {
  const t = locales[language];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center animate-fadeIn">
      <div className="w-full max-w-5xl">
        <h1 className="font-title text-4xl md:text-5xl text-cyan-400 mb-4">{t.appHubTitle}</h1>
        <p className="text-gray-300 text-lg mb-8">{t.appHubSubtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map((app) => (
            <button
              key={app.id}
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
                  {getIconByName(app.iconUrl)}
                </div>
                <h2 className="text-xl font-bold text-white">{t[app.titleKey]}</h2>
              </div>
              <p className="text-gray-400 text-sm">{t[`${app.titleKey.replace('Title', 'Desc')}` as keyof typeof t]}</p>
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