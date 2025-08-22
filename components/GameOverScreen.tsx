import React from 'react';
import type { StorySegment, Language } from '../types';
import { locales } from '../locales';

interface GameOverScreenProps {
  finalScene: StorySegment;
  onRestart: () => void;
  language: Language;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ finalScene, onRestart, language }) => {
  const t = locales[language];
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fadeIn p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-3xl">
        <h1 className="font-title text-6xl text-cyan-400 mb-4">{t.gameOverTitle}</h1>
        
        <div className="my-6">
          <img src={finalScene.image} alt="Final Scene" className="w-full aspect-video object-contain rounded-lg shadow-lg mx-auto border-2 border-gray-600" />
        </div>

        <p className="text-gray-300 text-lg leading-relaxed mb-8">{finalScene.sceneDescription}</p>

        <button 
          onClick={onRestart}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg shadow-lg"
        >
          {t.gameOverRestart}
        </button>
      </div>
    </div>
  );
};

export default GameOverScreen;