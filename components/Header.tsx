import React from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { DashboardIcon, AuraIcon, InfoIcon, CalendarIcon, TangibleDataLogo } from './icons';

interface HeaderProps {
  onDashboardClick: () => void;
  onChatClick: () => void;
  onAboutClick: () => void;
  onCalendarClick: () => void;
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ onDashboardClick, onChatClick, onAboutClick, onCalendarClick, language }) => {
  const t = locales[language];
  return (
    <header className="w-full py-3 px-4 md:py-4 md:px-6 bg-gray-800/50 border-b border-gray-700 rounded-t-lg flex items-center justify-between">
      <a href="https://www.tangibledata.xyz" target="_blank" rel="noopener noreferrer" aria-label="Tangible Data Website">
        <TangibleDataLogo className="h-6 text-white hover:text-cyan-400 transition-colors" />
      </a>
      <nav className="flex items-center gap-2">
        <button
          onClick={onDashboardClick}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:py-2 md:px-4 rounded-lg transition-colors"
          aria-label={t.headerDashboardButton}
        >
          <DashboardIcon />
          <span className="hidden md:inline">{t.headerDashboardButton}</span>
        </button>
        <button
          onClick={onCalendarClick}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:py-2 md:px-4 rounded-lg transition-colors"
          aria-label={t.headerCalendarButton}
        >
          <CalendarIcon />
          <span className="hidden md:inline">{t.headerCalendarButton}</span>
        </button>
         <button
          onClick={onChatClick}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:py-2 md:px-4 rounded-lg transition-colors"
          aria-label={t.headerChatButton}
        >
          <AuraIcon className="h-5 w-5" />
          <span className="hidden md:inline">{t.headerChatButton}</span>
        </button>
         <button
          onClick={onAboutClick}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:py-2 md:px-4 rounded-lg transition-colors"
          aria-label={t.headerAboutButton}
        >
          <InfoIcon />
          <span className="hidden md:inline">{t.headerAboutButton}</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;