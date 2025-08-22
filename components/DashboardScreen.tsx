import React from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import SkeletonChart from './SkeletonChart';

interface DashboardScreenProps {
  onBack: () => void;
  language: Language;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onBack, language }) => {
  const t = locales[language];
  return (
    <div className="flex flex-col items-center justify-center w-full animate-fadeIn p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-6xl">
        <h1 className="font-title text-4xl text-cyan-400 mb-2">{t.dashboardTitle}</h1>
        <p className="text-gray-400 mb-6">{t.dashboardDescription}</p>

        <div className="w-full h-[50vh] rounded-lg shadow-inner bg-gray-900 p-4 border border-gray-700">
           <SkeletonChart startYear={1880} endYear={2024} />
        </div>

        <div className="text-center mt-6">
            <button 
              onClick={onBack}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg transition-colors text-lg shadow-lg"
            >
              {t.dashboardBack}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
