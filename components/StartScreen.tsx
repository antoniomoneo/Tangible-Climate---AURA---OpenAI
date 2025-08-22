import React, { useState } from 'react';
import { locales } from '../locales';
import type { Language } from '../types';
import { GlobeIcon } from './icons';

interface StartScreenProps {
  onStart: (language: Language) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = locales[language];

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(language);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fadeIn">
      <div className="bg-gray-800 bg-opacity-75 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-2xl text-center">
        <h1 className="font-title text-5xl text-cyan-400 mb-4">{t.title}</h1>
        <p className="text-gray-300 mb-4">{t.intro}</p>
        <p className="text-gray-300 mb-8 font-semibold">{t.objective}</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-sm text-gray-400">
            <p className="mb-2 flex items-center justify-center gap-2"><GlobeIcon /> {t.selectLang}</p>
            <div className="flex justify-center gap-4">
              <button 
                type="button" 
                onClick={() => handleLanguageSelect('en')}
                className={`px-4 py-2 rounded-lg transition-colors ${language === 'en' ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                English
              </button>
              <button 
                type="button" 
                onClick={() => handleLanguageSelect('es')}
                className={`px-4 py-2 rounded-lg transition-colors ${language === 'es' ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                Español
              </button>
            </div>
          </div>
          
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
