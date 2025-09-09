import React, { useState, useEffect } from 'react';
// FIX: Fix import paths to be relative.
import { locales } from '../locales';
// FIX: Fix import paths to be relative.
import type { Language } from '../types';
import { AuraIcon } from './icons';
import TextToSpeechButton from './TextToSpeechButton';

interface StartScreenProps {
  onShowHub: () => void;
  language: Language;
}

const StartScreen: React.FC<StartScreenProps> = ({ onShowHub, language }) => {
  const t = locales[language];
  const [displayedFirst, setDisplayedFirst] = useState('');
  const [displayedSecond, setDisplayedSecond] = useState('');

  // FIX: Removed `as any` cast due to stricter types in `locales.ts`.
  const firstFullText = t.auraStartMessage || '';
  // FIX: Removed `as any` cast due to stricter types in `locales.ts`.
  const secondFullText = t.auraSecondMessage || '';
  const fullTextToSpeak = `${firstFullText}\n\n${secondFullText}`;

  const isFirstDone = displayedFirst.length === firstFullText.length;
  const isSecondDone = displayedSecond.length === secondFullText.length;
  const isTyping = !isFirstDone || !isSecondDone;

  useEffect(() => {
    if (firstFullText) {
      let i = 0;
      setDisplayedFirst('');
      const intervalId = setInterval(() => {
        i++;
        setDisplayedFirst(firstFullText.substring(0, i));
        if (i >= firstFullText.length) {
          clearInterval(intervalId);
        }
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [firstFullText]);

  useEffect(() => {
    if (isFirstDone && secondFullText) {
      const startTyping = setTimeout(() => {
        let i = 0;
        setDisplayedSecond('');
        const intervalId = setInterval(() => {
          i++;
          setDisplayedSecond(secondFullText.substring(0, i));
          if (i >= secondFullText.length) {
            clearInterval(intervalId);
          }
        }, 30);
        return () => clearInterval(intervalId);
      }, 700);
      return () => clearTimeout(startTyping);
    }
  }, [isFirstDone, secondFullText]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShowHub();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full animate-fadeIn">
      <div className="bg-gray-800 bg-opacity-75 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-3xl">
        <div className="flex items-start gap-4 text-left">
          <div className="flex-shrink-0 flex flex-col items-center gap-4 mt-2">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-cyan-500 flex items-center justify-center">
              <AuraIcon className="h-6 w-6 md:h-7 md:w-7 text-white" />
            </div>
            <TextToSpeechButton textToSpeak={fullTextToSpeak} language={language} />
          </div>
          <div className="bg-gray-700 p-4 rounded-lg shadow w-full min-h-[320px] md:min-h-[280px]">
            <p className="text-gray-200 whitespace-pre-wrap text-base md:text-lg leading-relaxed">
              {displayedFirst}
              {isFirstDone && '\n\n'}
              {displayedSecond}
              {isTyping && <span className="inline-block w-px h-5 bg-cyan-400 ml-1 animate-pulse" />}
            </p>
          </div>
        </div>

        {!isTyping && (
          <form onSubmit={handleSubmit} className="mt-8">
            <button 
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg shadow-lg animate-fadeIn"
              style={{ animationDelay: '0.2s' }}
            >
              {t.start}
            </button>
          </form>
        )}
      </div>
       {isTyping && (
            <button
                onClick={onShowHub}
                className="fixed bottom-6 right-6 bg-gray-800/60 hover:bg-gray-700/80 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-lg animate-fadeIn"
                aria-label={t.skipButton}
            >
                {t.skipButton}
            </button>
        )}
    </div>
  );
};

export default StartScreen;