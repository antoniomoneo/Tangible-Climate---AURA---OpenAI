import React, { useState, useEffect } from 'react';
import { TangibleDataLogo } from './icons';
// FIX: Fix import paths to be relative.
import type { Language } from '../types';
// FIX: Fix import paths to be relative.
import { locales } from '../locales';

interface SplashScreenProps {
  onFinished: () => void;
  language: Language;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished, language }) => {
  const [phase, setPhase] = useState(0); // 0: logo, 1: title, 2: photo
  const t = locales[language];
  const sculpturePhotoUrl = 'https://lh3.googleusercontent.com/pw/AP1GczNObISJaRfsLaSCUXQjDcFTJkR9gs2mwNlptiMQ-r9r3AM9X0Pb_siZ1NqzgMRPAjtVFfzB3IjcTbZI7kH4EXrNhVaNFoFy_kTSnOSWU-aaPt_PP7ddtee4-WU3SOaM3WqWgPni-6HEEBPlAQXTFIY0IA=w1670-h988-s-no?authuser=0';

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase(1); // Show title
    }, 2500);

    const timer2 = setTimeout(() => {
      setPhase(2); // Show photo
    }, 5500);

    const timer3 = setTimeout(() => {
      onFinished(); // Call onFinished to transition to next screen
    }, 8500); // Total duration of splash screen

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white font-title z-[100] overflow-hidden">
      <div className="relative text-center w-full max-w-4xl mx-auto px-4 h-[70vh] flex items-center justify-center">
        {/* Phase 0: Logo */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-1000 ${
            phase === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <TangibleDataLogo className="h-10" />
          <p className="text-2xl text-gray-300 mt-4">{t.splashGretting}</p>
          <p className="text-sm text-gray-400 mt-6">{t.splashCollabIntro}</p>
          <p className="text-base text-gray-300 mt-1">{t.splashCollabPartner}</p>
        </div>

        {/* Phase 1: Title and Subtitle */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
            phase === 1 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <h1 className="text-5xl md:text-6xl text-cyan-400 mb-4 animate-fadeIn">
            {t.splashTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            {t.splashSubtitle}
          </p>
        </div>
        
        {/* Phase 2: Sculpture Photo */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            phase === 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={sculpturePhotoUrl} 
            alt="Fotografía de la escultura El Esqueleto del Cambio Climático"
            className="w-auto h-full object-contain rounded-lg shadow-2xl animate-fadeIn"
          />
        </div>

      </div>
      <button
        onClick={onFinished}
        className="fixed bottom-6 right-6 bg-gray-800/60 hover:bg-gray-700/80 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-lg animate-fadeIn"
        style={{ animationDelay: '1.5s' }}
        aria-label={t.skipButton}
      >
        {t.skipButton}
      </button>
    </div>
  );
};

export default SplashScreen;