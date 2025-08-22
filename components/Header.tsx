import React from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { DashboardIcon, AuraIcon, InfoIcon, TangibleDataLogo } from './icons';

interface HeaderProps {
  onDashboardClick: () => void;
  onChatClick: () => void;
  onAboutClick: () => void;
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ onDashboardClick, onChatClick, onAboutClick, language }) => {
  const t = locales[language];
  return (
    <header className="w-full py-4 px-6 bg-gray-800/50 border-b border-gray-700 rounded-t-lg flex items-center justify-between">
      <a href="https://www.tangibledata.xyz" target="_blank" rel="noopener noreferrer" aria-label="Tangible Data Website">
        <TangibleDataLogo className="h-6 text-white hover:text-cyan-400 transition-colors" />
      </a>
      <nav className="flex items-center gap-2">
        <button
          onClick={onDashboardClick}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <DashboardIcon />
          {t.headerDashboardButton}
        </button>
         <button
          onClick={onChatClick}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <AuraIcon className="h-5 w-5" />
          {t.headerChatButton}
        </button>
         <button
          onClick={onAboutClick}
          className="flex items-center gap-2 bg-gray-700 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <InfoIcon />
          {t.headerAboutButton}
        </button>
      </nav>
    </header>
  );
};

export default Header;