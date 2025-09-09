import React from 'react';
import { AuraIcon } from './icons';
import type { Language } from '../types';
import { locales } from '../locales';

interface AuraChatButtonProps {
  onClick: () => void;
  language: Language;
}

const AuraChatButton: React.FC<AuraChatButtonProps> = ({ onClick, language }) => {
  const t = locales[language];
  // FIX: Removed `as string` cast as it's no longer needed with stricter locale types.
  const tooltipText = t.appHubChatTitle;

  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <button
        onClick={onClick}
        className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-cyan-400 focus:ring-opacity-50"
        aria-label={tooltipText}
      >
        {/* Pulse animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping group-hover:animate-none"></span>
        
        {/* Icon */}
        <AuraIcon className="w-8 h-8 text-white z-10" />
      </button>
      
      {/* Tooltip */}
      <div className="absolute bottom-1/2 translate-y-1/2 right-full mr-4 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
        {tooltipText}
        <div className="absolute top-1/2 -translate-y-1/2 right-[-5px] w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-gray-800"></div>
      </div>
    </div>
  );
};

export default AuraChatButton;