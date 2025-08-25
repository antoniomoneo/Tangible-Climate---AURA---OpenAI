import React from 'react';
import { GlobeIcon, TangibleDataLogo } from './icons';
import type { Language } from '../types';

interface LanguageSelectionScreenProps {
  onSelect: (language: Language) => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen animate-fadeIn">
      <div className="bg-gray-800 bg-opacity-75 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md text-center">
        <TangibleDataLogo className="h-8 mx-auto mb-6 text-white" />
        <h1 className="font-title text-2xl text-cyan-400 mb-6 flex items-center justify-center gap-3">
            <GlobeIcon /> 
            Select Language / Seleccione Idioma
        </h1>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            type="button" 
            onClick={() => onSelect('en')}
            className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg shadow-lg'
          >
            English
          </button>
          <button 
            type="button" 
            onClick={() => onSelect('es')}
            className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg shadow-lg'
          >
            Español
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;