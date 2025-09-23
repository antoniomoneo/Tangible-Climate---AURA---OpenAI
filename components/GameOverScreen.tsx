import React from 'react';
// FIX: Fix import paths to be relative.
import type { StorySegment, Language } from '../types';
// FIX: Fix import paths to be relative.
import { locales } from '../locales';
import TextToSpeechButton from './TextToSpeechButton';
import { IdentificationIcon } from './icons';

interface GameOverScreenProps {
  finalScene: StorySegment;
  onRestart: () => void;
  language: Language;
  onOpenQuest: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ finalScene, onRestart, language, onOpenQuest }) => {
  const t = locales[language];
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center animate-fadeIn">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-3xl">
        <h1 className="font-title text-6xl text-cyan-400 mb-4">{t.gameOverTitle}</h1>
        
        <div className="my-6">
          <img src={finalScene.image} alt="Final Scene" className="w-full aspect-video object-contain rounded-lg shadow-lg mx-auto border-2 border-gray-600" />
        </div>
        
        <div className="flex justify-end mb-2">
            <TextToSpeechButton textToSpeak={finalScene.sceneDescription} language={language} />
        </div>
        <p className="text-gray-300 text-lg leading-relaxed mb-8">{finalScene.sceneDescription}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onRestart}
            className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-lg"
          >
            {t.gameOverRestart}
          </button>
           <button 
              onClick={onOpenQuest}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <IdentificationIcon className="h-5 w-5" />
              {t.appHubQuestTitle}
            </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;