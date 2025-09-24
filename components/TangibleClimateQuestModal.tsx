import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { locales, questGameData } from '../locales';
import { IdentificationIcon, LightBulbIcon } from './icons';

interface TangibleClimateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

interface GameState {
  chapterId: number;
  score: number;
  inventory: string[];
}

const TangibleClimateQuestModal: React.FC<TangibleClimateQuestModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];
  const gameData = questGameData[language];
  
  const [log, setLog] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [gameState, setGameState] = useState<GameState>({ chapterId: 1, score: 0, inventory: [] });
  const [gameOver, setGameOver] = useState<'win' | 'lose' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(false);
  
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchSuggestedActions = async (state: GameState) => {
      if (gameOver) return;
      setAreSuggestionsLoading(true);
      try {
          const res = await fetch('/api/text-adventure-suggestions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ language, gameState: state }),
          });
          if (!res.ok) throw new Error('Failed to fetch suggestions');
          const suggestions = await res.json();
          if (Array.isArray(suggestions) && suggestions.length > 0) {
              setSuggestedActions(suggestions);
          } else {
              setSuggestedActions([]);
          }
      } catch (err) {
          console.error(err);
          setSuggestedActions([]);
      } finally {
          setAreSuggestionsLoading(false);
      }
  };

  const resetGame = () => {
    const initialGameState: GameState = { chapterId: 1, score: 0, inventory: [] };
    const firstChapter = gameData.chapters.find(c => c.id === initialGameState.chapterId);
    setGameState(initialGameState);
    setLog([gameData.intro, firstChapter!.description]);
    setGameOver(null);
    setInput('');
    fetchSuggestedActions(initialGameState);
  };

  useEffect(() => {
    if (isOpen) {
      resetGame();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, language]);

  useEffect(() => {
    scrollToBottom();
  }, [log]);

  const processCommand = async (command: string) => {
    if (!command || isLoading || isHintLoading || gameOver) return;

    setLog(prev => [...prev, `> ${command}`]);
    setInput('');
    setIsLoading(true);
    setSuggestedActions([]);

    try {
        const res = await fetch('/api/text-adventure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, command, gameState }),
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || 'Server error');
        }
        const { responseText, newGameState, newChapterDescription, isGameOver } = await res.json();
        
        const newLogMessages = [responseText];
        if (newChapterDescription) {
            newLogMessages.push(newChapterDescription);
        }
        setLog(prev => [...prev, ...newLogMessages]);
        setGameState(newGameState);

        if (isGameOver) {
            setGameOver(isGameOver);
        } else {
            fetchSuggestedActions(newGameState);
        }

    } catch (err: any) {
        setLog(prev => [...prev, `Error: ${err.message}`]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input.trim());
  };

  const handleSuggestedActionClick = (action: string) => {
    processCommand(action);
  };

  const handleAskForHint = async () => {
    if (isLoading || isHintLoading || gameOver) return;

    setIsHintLoading(true);
    setLog(prev => [...prev, `> [${t.textAdventureQuestHint}]`]);

    try {
        const res = await fetch('/api/text-adventure-hint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, gameState }),
        });
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || 'Server error');
        }
        const { hint } = await res.json();
        setLog(prev => [...prev, `[AURA]: ${hint}`]);
    } catch (err: any) {
        setLog(prev => [...prev, `[AURA]: Error: ${err.message}`]);
    } finally {
        setIsHintLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 animate-fadeIn font-title">
      <div className="bg-black border-2 border-cyan-700 rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col text-green-400">
        <div className="flex items-center justify-between p-3 border-b-2 border-cyan-700 flex-shrink-0">
          <h2 className="text-xl text-cyan-400 flex items-center gap-2">
            <IdentificationIcon className="h-5 w-5"/>
            {t.textAdventureQuestTitle}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className="flex-grow flex flex-col p-4">
            <div ref={logEndRef} className="flex-grow overflow-y-auto pr-2 space-y-3 text-lg leading-relaxed mb-4">
              {log.map((line, index) => (
                <p key={index} className={`whitespace-pre-wrap ${line.startsWith('>') ? 'text-cyan-400' : ''} ${line.startsWith('[AURA]') ? 'text-amber-400 italic' : ''}`} dangerouslySetInnerHTML={{ __html: line.replace(/\n/g, '<br />') }} />
              ))}
               {(isLoading || isHintLoading) && <div className="animate-pulse">_</div>}
               {gameOver && (
                <div className={`mt-4 text-2xl font-bold text-center animate-fadeIn ${gameOver === 'win' ? 'text-green-400' : 'text-red-500'}`}>
                    <p>{gameOver === 'win' ? t.textAdventureQuestWin : t.textAdventureQuestLose}</p>
                     <button onClick={resetGame} className="mt-4 text-base bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                        {t.textAdventureQuestRestart}
                     </button>
                </div>
               )}
            </div>
            
            {!gameOver && (
              <div className="mb-2 flex flex-wrap gap-2 justify-start">
                  {areSuggestionsLoading ? (
                      <p className="text-sm text-gray-500 italic">AURA is thinking of suggestions...</p>
                  ) : (
                      suggestedActions.map((action, i) => (
                          <button
                              key={i}
                              onClick={() => handleSuggestedActionClick(action)}
                              className="bg-gray-800 border border-cyan-700 text-cyan-400 px-3 py-1 rounded-sm text-sm hover:bg-cyan-900 hover:text-white transition-colors"
                          >
                              {action}
                          </button>
                      ))
                  )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-2 items-center mt-2">
              <span className="text-cyan-400 text-lg flex-shrink-0">&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading || isHintLoading || !!gameOver}
                className="flex-grow bg-transparent border-none text-cyan-400 text-lg focus:outline-none"
                autoFocus
              />
               <button 
                  type="button" 
                  onClick={handleAskForHint}
                  disabled={isLoading || isHintLoading || !!gameOver}
                  className="bg-amber-600 text-white px-3 py-2 rounded-sm hover:bg-amber-500 disabled:opacity-50 flex items-center gap-2"
                  title={t.textAdventureQuestHint}
                >
                  <LightBulbIcon className="h-4 w-4" />
                   <span className="hidden sm:inline">{t.textAdventureQuestHint}</span>
               </button>
              <button type="submit" className="bg-cyan-700 text-white px-4 py-2 rounded-sm hover:bg-cyan-600 disabled:opacity-50">
                {t.textAdventureQuestSubmit}
              </button>
            </form>
          </div>
          <div className="w-full md:w-64 border-t-2 md:border-t-0 md:border-l-2 border-cyan-700 p-4 flex-shrink-0 overflow-y-auto">
            <h3 className="text-cyan-400 text-xl mb-2">{t.textAdventureQuestScore}</h3>
            <p className="text-2xl mb-4">{gameState.score}</p>
            <h3 className="text-cyan-400 text-xl mb-2">{t.textAdventureQuestInventory}</h3>
            {gameState.inventory.length > 0 ? (
              <ul className="space-y-1 list-disc list-inside">
                {gameState.inventory.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            ) : (
                <p className="text-gray-500 italic">Vacío</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TangibleClimateQuestModal;