import React, { useState, useEffect } from 'react';
import { TangibleDataLogo } from './icons';
import type { Language } from '../types';
import { locales } from '../locales';

interface SplashScreenProps {
  onFinished: () => void;
  language: Language;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished, language }) => {
  const [phase, setPhase] = useState(0); // 0: logo, 1: title/subtitle
  const t = locales[language];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setPhase(1); // Start fading out logo, fading in title
    }, 2500);

    const timer2 = setTimeout(() => {
      onFinished(); // Call onFinished to transition to next screen
    }, 6500); // Total duration of splash screen

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinished]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center text-white font-title z-[100]">
      <div className="relative text-center w-full max-w-3xl mx-auto px-4 h-48 flex items-center justify-center">
        {/* Phase 0: Logo */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
            phase === 0 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <TangibleDataLogo className="h-10 mx-auto mb-4" />
          <p className="text-2xl text-gray-300">{t.splashGretting}</p>
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
          <p className="text-xl md:text-2xl text-gray-300 animate-fadeIn" style={{ animationDelay: '1s' }}>
            {t.splashSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;