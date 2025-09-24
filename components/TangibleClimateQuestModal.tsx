import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { locales, questGameData } from '../locales';
import { IdentificationIcon, LightBulbIcon } from './icons';

// A visual component to render the climate skeleton progressively.
const SKELETON_RIBS = [
  "M 46 115 A 4 20 0 0 1 54 115", "M 54 117 A 4 22 0 0 1 62 117", "M 62 120 A 4 23 0 0 1 70 120",
  "M 70 118 A 4 21 0 0 1 78 118", "M 77.5 115 A 4.5 25 0 0 1 86.5 115", "M 85.5 112 A 4.5 28 0 0 1 94.5 112",
  "M 93.5 108 A 4.5 32 0 0 1 102.5 108", "M 101 105 A 5 35 0 0 1 111 105", "M 109 108 A 5 34 0 0 1 119 108",
  "M 117 110 A 5 33 0 0 1 127 110", "M 125 112 A 5 32 0 0 1 135 112", "M 132.5 110 A 5.5 34 0 0 1 143.5 110",
  "M 140.5 105 A 5.5 38 0 0 1 151.5 105", "M 148.5 98 A 5.5 44 0 0 1 159.5 98", "M 156 90 A 6 50 0 0 1 168 90",
  "M 164 85 A 6 55 0 0 1 176 85", "M 172 80 A 6 60 0 0 1 184 80", "M 179.5 75 A 6.5 65 0 0 1 192.5 75",
  "M 187.5 70 A 6.5 70 0 0 1 200.5 70", "M 195.5 65 A 6.5 75 0 0 1 208.5 65", "M 203 60 A 7 80 0 0 1 217 60",
  "M 211 55 A 7 85 0 0 1 225 55", "M 219 50 A 7 90 0 0 1 233 50", "M 226.5 45 A 7.5 95 0 0 1 241.5 45",
  "M 234.5 40 A 7.5 100 0 0 1 249.5 40"
];

const RIBS_PER_CHAPTER = 6;
const TOTAL_RIBS = SKELETON_RIBS.length;

interface SkeletonVisualizerProps {
  progress: number; // 0 for chapter 1, 1 for chapter 2, etc.
  isComplete: boolean;
}

const SkeletonVisualizer: React.FC<SkeletonVisualizerProps> = ({ progress, isComplete }) => {
  const ribsToShow = isComplete ? TOTAL_RIBS : progress * RIBS_PER_CHAPTER;
  const prevRibsToShow = useRef(ribsToShow);

  useEffect(() => {
    prevRibsToShow.current = ribsToShow;
  }, [ribsToShow]);

  return (
    <div className="w-full aspect-video p-2 bg-gray-900/50 rounded border border-cyan-900 relative">
      <svg xmlns="http://www.w.org/2000/svg" viewBox="40 20 220 120" className="w-full h-full">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <g transform="translate(0, -10)">
            {SKELETON_RIBS.slice(0, ribsToShow).map((d, index) => (
              <path 
                key={index} 
                d={d} 
                className={`transition-colors duration-500 ${isComplete ? 'text-cyan-400' : 'text-green-400'} ${index >= prevRibsToShow.current ? 'animate-fadeIn' : ''}`}
                style={{ animationDelay: `${(index - prevRibsToShow.current) * 50}ms` }}
              />
            ))}
          </g>
        </g>
      </svg>
      {isComplete && <div className="absolute inset-0 bg-cyan-400/20 rounded-lg animate-pulse pointer-events-none"></div>}
    </div>
  );
};


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
          <div className="flex-grow flex flex-col p-4 overflow-hidden">
            <div className="flex-grow overflow-y-auto pr-2 space-y-3 text-lg leading-relaxed mb-4">
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
               <div ref={logEndRef} />
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
          <div className="w-full md:w-64 border-t-2 md:border-t-0 md:border-l-2 border-cyan-700 p-4 flex-shrink-0 flex flex-col overflow-y-auto">
            <div>
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
            <div className="mt-auto pt-4 border-t-2 border-cyan-800">
                <h3 className="text-cyan-400 text-xl mb-2">{t.textAdventureQuestSkeletonReconstruction}</h3>
                <SkeletonVisualizer progress={gameState.chapterId - 1} isComplete={gameOver === 'win'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TangibleClimateQuestModal;