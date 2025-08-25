import React from 'react';
import { locales } from '../locales';
import type { Language } from '../types';

interface StartScreenProps {
  onStart: () => void;
  language: Language;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart, language }) => {
  const t = locales[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fadeIn">
      <div className="bg-gray-800 bg-opacity-75 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl text-center">
        <h1 className="font-title text-5xl text-cyan-400 mb-4">{t.title}</h1>
        <p className="text-gray-300 mb-4">{t.intro}</p>
        <p className="text-gray-300 mb-8 font-semibold">{t.objective}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <button 
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg shadow-lg"
          >
            {t.start}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StartScreen;