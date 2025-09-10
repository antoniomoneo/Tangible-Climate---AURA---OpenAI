import React, { useState, useMemo, useEffect } from 'react';
import type { Language, GlossaryTerm, GlossaryViewMode } from '../types';
import { locales } from '../locales';
import { glossaryContent } from '../data/glossaryContent';
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
  fullWidth?: boolean;
}> = ({ label, isActive, onClick, fullWidth = false }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${fullWidth ? 'w-full' : ''} ${
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
  const [isMobile, setIsMobile] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const filteredTerms = useMemo(() => {
    return content.terms
      .filter(term => selectedCategory === 'all' || term.category === selectedCategory)
      .filter(term => term.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [content.terms, selectedCategory, searchTerm]);
  
  const searchedTerms = useMemo(() => {
    if (!searchTerm) return [];
    return content.terms
      .filter(term => term.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [content.terms, searchTerm]);

  const handleAskAuraClick = (term: GlossaryTerm) => {
    onClose(); // Close glossary modal first
    setTimeout(() => onAskAura(term), 300); // Open chat modal after a short delay
  };

  const TermDetail: React.FC<{ term: GlossaryTerm | null; isScrollable?: boolean }> = ({ term, isScrollable = true }) => {
    if (!term) {
      return (
        <div className="flex-1 flex items-center justify-center text-center text-gray-500 p-6">
          <p>{viewMode === 'LIST' ? 'Selecciona un término de la lista para ver su definición.' : t.mindMapInstructions}</p>
        </div>
      );
    }
    return (
      <div className={`flex-1 p-6 bg-gray-900/50 rounded-lg ${isScrollable ? 'overflow-y-auto' : ''}`}>
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

  const TermsList = () => (
    <>
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
    </>
  );

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
            {!isMobile && (
              <div className="flex items-center gap-2 bg-gray-900 p-1 rounded-lg">
                  <ViewModeButton label={t.glossaryViewList} isActive={viewMode === 'LIST'} onClick={() => setViewMode('LIST')} />
                  <ViewModeButton label={t.glossaryViewMindMap} isActive={viewMode === 'MIND_MAP'} onClick={() => { setViewMode('MIND_MAP'); setSelectedTerm(null); }} />
                  <ViewModeButton label={t.glossaryViewQuiz} isActive={false} onClick={() => setViewMode('QUIZ')} />
              </div>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
          </div>
        </div>
        
        {isMobile && (
          <div className="p-4 flex flex-col gap-2 border-b border-gray-600 flex-shrink-0">
            <ViewModeButton label={t.glossaryViewList} isActive={viewMode === 'LIST'} onClick={() => setViewMode('LIST')} fullWidth />
            <ViewModeButton label={t.glossaryViewMindMap} isActive={viewMode === 'MIND_MAP'} onClick={() => { setViewMode('MIND_MAP'); setSelectedTerm(null); }} fullWidth />
            <ViewModeButton label={t.glossaryViewQuiz} isActive={false} onClick={() => setViewMode('QUIZ')} fullWidth />
          </div>
        )}

        {viewMode === 'MIND_MAP' && (
           <div className="flex h-full">
              <div className="w-full md:w-2/3 h-full border-r border-gray-700">
                  <GlossaryMindMap 
                      terms={content.terms}
                      categories={content.categories}
                      selectedTerm={selectedTerm}
                      onSelectTerm={setSelectedTerm}
                      language={language}
                  />
              </div>
              <div className="hidden md:block md:w-1/3 h-full">
                  <TermDetail term={selectedTerm} />
              </div>
          </div>
        )}

        {viewMode === 'LIST' && (
          isMobile ? (
            // Mobile Vertical Layout
            <div className="flex-grow flex flex-col overflow-hidden">
              {selectedTerm ? (
                <div className="flex-grow flex flex-col overflow-y-auto">
                  <button
                    onClick={() => setSelectedTerm(null)}
                    className="sticky top-0 z-10 w-full text-left p-4 bg-gray-700 hover:bg-gray-600 font-semibold"
                  >
                    &larr; {t.glossaryBackToList}
                  </button>
                  <TermDetail term={selectedTerm} isScrollable={false} />
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-gray-600 flex-shrink-0">
                    <input
                      type="search"
                      placeholder={t.glossarySearchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="flex-grow overflow-y-auto p-4">
                    {searchTerm ? (
                      <>
                        {searchedTerms.length === 0 ? (
                          <p className="text-center text-gray-400 mt-8">{t.glossaryNoResults}</p>
                        ) : (
                          <ul className="space-y-1">
                            {searchedTerms.map(term => (
                              <li key={term.name}>
                                <button onClick={() => setSelectedTerm(term)} className="w-full text-left p-3 rounded-md hover:bg-gray-700/50">
                                  <span className="font-semibold text-white">{term.name}</span>
                                  <span className="text-sm text-gray-400 block">{term.category}</span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2">
                        {content.categories.map(cat => {
                          const isExpanded = expandedCategory === cat;
                          return (
                            <div key={cat}>
                              <button
                                onClick={() => setExpandedCategory(isExpanded ? null : cat)}
                                className="w-full flex justify-between items-center text-left p-3 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
                              >
                                <span className="font-semibold text-white">{cat}</span>
                                <svg className={`w-5 h-5 transform transition-transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              {isExpanded && (
                                <div className="pl-4 pt-2 border-l-2 border-gray-600 ml-2 animate-fadeIn">
                                  <ul className="space-y-1">
                                    {content.terms.filter(term => term.category === cat).map(term => (
                                      <li key={term.name}>
                                        <button onClick={() => setSelectedTerm(term)} className="w-full text-left p-3 rounded-md hover:bg-gray-700/50">
                                          <span className="font-semibold text-white">{term.name}</span>
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            // Desktop 3-Column Layout
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
              <div className="p-4 border-b md:border-b-0 md:border-r border-gray-600 flex-shrink-0 flex-col md:flex-row gap-4 items-center">
                <input
                  type="search"
                  placeholder={t.glossarySearchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex-grow flex overflow-hidden">
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
                  <div className="w-1/4 p-4 border-r border-gray-700 overflow-y-auto">
                    <TermsList />
                  </div>
                  <div className="w-2/4 p-4 flex">
                      <TermDetail term={selectedTerm} />
                  </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GlossaryModal;