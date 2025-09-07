import React from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { AcademicCapIcon } from './icons';

interface EducationalPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const EducationalPackModal: React.FC<EducationalPackModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="font-title text-2xl text-cyan-400 flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6"/>
            {t.educationalPackTitle}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 text-gray-300 space-y-4 leading-relaxed overflow-y-auto">
            <div
              className="prose prose-invert max-w-none text-gray-300"
              dangerouslySetInnerHTML={{ __html: t.educationalPackContent }}
            />
        </div>
      </div>
    </div>
  );
};

export default EducationalPackModal;