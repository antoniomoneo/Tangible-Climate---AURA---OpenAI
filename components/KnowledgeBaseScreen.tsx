import React from 'react';
// FIX: Fix import paths to be relative.
import type { Language } from '../types';
// FIX: Fix import paths to be relative.
import { locales } from '../locales';
import { knowledgeBaseContent } from '../data/knowledgeBaseContent';
import { ChatBubbleIcon } from './icons';

interface KnowledgeBaseScreenProps {
  onBack: () => void;
  onOpenChat: () => void;
  language: Language;
}

const KnowledgeBaseScreen: React.FC<KnowledgeBaseScreenProps> = ({ onBack, onOpenChat, language }) => {
  const t = locales[language];
  const content = knowledgeBaseContent[language];

  const renderContent = (content: { title: string; sections: { heading: string; text: string }[] }) => {
    return (
      <>
        <h1 className="font-title text-3xl md:text-4xl text-cyan-400 mb-8 text-center">{content.title}</h1>
        {content.sections.map((section, index) => (
          <div key={index} className="mb-8">
            <h2 className="font-title text-2xl text-white mb-4 border-b border-gray-600 pb-2">{section.heading}</h2>
            <div
              className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: section.text }}
            />
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="relative w-full h-full max-w-4xl mx-auto flex flex-col animate-fadeIn p-4">
      <div className="bg-gray-800 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700 w-full flex-grow overflow-y-auto mb-24">
        {renderContent(content)}
      </div>
      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={onBack}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
        >
          {t.knowledgeBaseBack}
        </button>
        <button
          onClick={onOpenChat}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
        >
          <ChatBubbleIcon className="h-5 w-5" />
          {t.knowledgeBaseAskReport}
        </button>
      </div>
    </div>
  );
};

export default KnowledgeBaseScreen;