import React, { useState, useMemo } from 'react';
import type { Language, GlossaryTerm, GlossaryViewMode } from '../types';
import { locales } from '../locales';
import { glossaryContent } from '../data/glossaryContent';
// FIX: Removed unused and non-existent icons 'CompassIcon', 'GlobeIcon', and 'BeakerIcon'.
import { BookOpenIcon, ChatBubbleIcon } from './icons';
import GlossaryQuiz from './GlossaryQuiz';
import GlossaryMindMap from './GlossaryMindMap';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onAskAura: (term: GlossaryTerm) => void;
}

const ViewModeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${
      isActive
        ? 'bg-cyan-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);


const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose, language, onAskAura }) => {
  const t = locales[language];
  const content = glossaryContent[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [viewMode, setViewMode] = useState<GlossaryViewMode>('LIST');

  const filteredTerms = useMemo(() => {
    return content.terms
      .filter(term => selectedCategory === 'all' || term.category === selectedCategory)
      .filter(term => term.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [content.terms, selectedCategory, searchTerm]);
  
  const handleAskAuraClick = (term: GlossaryTerm) => {
    onClose(); // Close glossary modal first
    setTimeout(() => onAskAura(term), 300); // Open chat modal after a short delay
  };

  const TermDetail: React.FC<{ term: GlossaryTerm | null }> = ({ term }) => {
    if (!term) {
      return (
        <div className="flex-1 flex items-center justify-center text-center text-gray-500 p-6">
          <p>{viewMode === 'LIST' ? 'Selecciona un término de la lista para ver su definición.' : t.mindMapInstructions}</p>
        </div>
      );
    }
    return (
      <div className="flex-1 p-6 bg-gray-900/50 rounded-lg overflow-y-auto">
        <h3 className="font-bold text-2xl text-cyan-400">{term.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{term.category}</p>
        <p className="text-gray-300 text-lg leading-relaxed">{term.definition}</p>
        {term.relatedTerms && term.relatedTerms.length > 0 && (
          <p className="text-sm text-gray-400 mt-6">
            <span className="font-bold">{t.glossarySeeAlso}:</span> {term.relatedTerms.join(', ')}
          </p>
        )}
        <button
          onClick={() => handleAskAuraClick(term)}
          className="mt-6 w-full flex items-center justify-center gap-2 text-sm bg-gray-700 hover:bg-cyan-800 text-cyan-300 font-semibold py-3 px-3 rounded-md transition-colors"
        >
          <ChatBubbleIcon className="h-4 w-4" />
          {t.glossaryAskAura}
        </button>
      </div>
    );
  };

  if (!isOpen) return null;
  
  if (viewMode === 'QUIZ') {
    return <GlossaryQuiz isOpen={true} onClose={() => { setViewMode('LIST'); onClose(); }} language={language} />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600 flex-shrink-0">
          <h2 className="font-title text-2xl text-cyan-400 flex items-center gap-2">
            <BookOpenIcon />
            {content.title}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg">
                <ViewModeButton label={t.glossaryViewList} isActive={viewMode === 'LIST'} onClick={() => setViewMode('LIST')} />
                <ViewModeButton label={t.glossaryViewMindMap} isActive={viewMode === 'MIND_MAP'} onClick={() => { setViewMode('MIND_MAP'); setSelectedTerm(null); }} />
                {/* FIX: The `viewMode` type is narrowed to 'LIST' | 'MIND_MAP' at this point in the code, so comparing it to 'QUIZ' causes a type error. Since this part of the component doesn't render when viewMode is 'QUIZ', the button can never be active, so we can set `isActive` to false. */}
                <ViewModeButton label={t.glossaryViewQuiz} isActive={false} onClick={() => setViewMode('QUIZ')} />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
          </div>
        </div>
        
        {/* FIX: Inlined rendering logic to resolve TypeScript control flow analysis error and missing renderContent function. */}
        {viewMode === 'MIND_MAP' && (
           <div className="flex h-full">
              <div className="w-2/3 h-full border-r border-gray-700">
                  <GlossaryMindMap 
                      terms={content.terms}
                      categories={content.categories}
                      selectedTerm={selectedTerm}
                      onSelectTerm={setSelectedTerm}
                      language={language}
                  />
              </div>
              <div className="w-1/3 h-full">
                  <TermDetail term={selectedTerm} />
              </div>
          </div>
        )}

        {viewMode === 'LIST' && (
            <>
              {/* Controls */}
              <div className="p-4 border-b border-gray-600 flex-shrink-0 flex flex-col md:flex-row gap-4 items-center">
                <input
                  type="search"
                  placeholder={t.glossarySearchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              {/* Content */}
              <div className="flex-grow flex overflow-hidden">
                  {/* Left: Categories */}
                  <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
                      <h3 className="font-bold text-lg text-white mb-3">Categorías</h3>
                      <ul className="space-y-2">
                          <li>
                              <button onClick={() => setSelectedCategory('all')} className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedCategory === 'all' ? 'bg-cyan-600 text-white' : 'hover:bg-gray-700'}`}>
                                  {t.glossaryAllCategories}
                              </button>
                          </li>
                          {content.categories.map(cat => (
                              <li key={cat}>
                                  <button onClick={() => setSelectedCategory(cat)} className={`w-full text-left px-3 py-2 rounded-md text-sm ${selectedCategory === cat ? 'bg-cyan-600 text-white' : 'hover:bg-gray-700'}`}>
                                      {cat}
                                  </button>
                              </li>
                          ))}
                      </ul>
                  </div>
                  {/* Middle: Terms List */}
                  <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
                      {filteredTerms.length === 0 ? (
                          <p className="text-center text-gray-400 mt-8">{t.glossaryNoResults}</p>
                      ) : (
                          <ul className="space-y-1">
                              {filteredTerms.map(term => (
                                  <li key={term.name}>
                                      <button onClick={() => setSelectedTerm(term)} className={`w-full text-left p-3 rounded-md ${selectedTerm?.name === term.name ? 'bg-gray-900/80' : 'hover:bg-gray-700/50'}`}>
                                          <span className="font-semibold text-white">{term.name}</span>
                                      </button>
                                  </li>
                              ))}
                          </ul>
                      )}
                  </div>
                  {/* Right: Term Detail */}
                  <div className="w-2/4 p-4 flex">
                      <TermDetail term={selectedTerm} />
                  </div>
              </div>
            </>
        )}
      </div>
    </div>
  );
};

export default GlossaryModal;