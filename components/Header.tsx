import React from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { DashboardIcon, AuraIcon, InfoIcon, TangibleDataLogo, QuestionMarkIcon, CalendarIcon } from './icons';

interface HeaderProps {
  onDashboardClick: () => void;
  onChatClick: () => void;
  onAboutClick: () => void;
  onInstructionsClick: () => void;
  onCalendarClick: () => void;
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ onDashboardClick, onChatClick, onAboutClick, onInstructionsClick, onCalendarClick, language }) => {
  const t = locales[language];
  
  return (
    <header className="w-full py-4 px-4 md:px-6 bg-gray-800/50 border-b border-gray-700 rounded-t-lg flex items-center justify-between gap-2 md:gap-4">
      <a href="https://www.tangibledata.xyz" target="_blank" rel="noopener noreferrer" aria-label="Tangible Data Website" className="flex-shrink-0">
        <TangibleDataLogo className="h-6 text-white hover:text-cyan-400 transition-colors" />
      </a>
      <nav className="flex items-center justify-end flex-nowrap gap-1 md:gap-2">
        <button
          onClick={onDashboardClick}
          title={t.headerDashboardButton}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:px-4 rounded-lg transition-colors"
        >
          <DashboardIcon />
          <span className="hidden md:inline">{t.headerDashboardButton}</span>
        </button>
         <button
          onClick={onChatClick}
          title={t.headerChatButton}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:px-4 rounded-lg transition-colors"
        >
          <AuraIcon className="h-5 w-5" />
          <span className="hidden md:inline">{t.headerChatButton}</span>
        </button>
        <button
          onClick={onInstructionsClick}
          title={t.headerInstructionsButton}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:px-4 rounded-lg transition-colors"
        >
          <QuestionMarkIcon />
          <span className="hidden md:inline">{t.headerInstructionsButton}</span>
        </button>
        <button
          onClick={onCalendarClick}
          title={t.headerCalendarButton}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:px-4 rounded-lg transition-colors"
        >
          <CalendarIcon />
          <span className="hidden md:inline">{t.headerCalendarButton}</span>
        </button>
         <button
          onClick={onAboutClick}
          title={t.headerAboutButton}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold p-2 md:px-4 rounded-lg transition-colors"
        >
          <InfoIcon />
          <span className="hidden md:inline">{t.headerAboutButton}</span>
        </button>
      </nav>
    </header>
  );
};

export default Header;