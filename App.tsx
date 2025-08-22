import React, { useState, useCallback, useEffect } from 'react';
import { GameState, StorySegment, StoryHistoryItem, Language, Choice } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import DashboardScreen from './components/DashboardScreen';
import Header from './components/Header';
import ChatModal from './components/ChatModal';
import AdminScreen from './components/AdminScreen';
import { locales, storyData } from './locales';
import { TangibleDataLogo } from './components/icons';

const AboutModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}> = ({ isOpen, onClose, language }) => {
  const t = locales[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="font-title text-2xl text-cyan-400">{t.aboutTitle}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 text-gray-300 space-y-4 leading-relaxed">
            <p>{t.intro}</p>
            <p>{t.objective}</p>
            <div className="pt-4 mt-4 border-t border-gray-600 text-center">
                 <p className="text-sm text-gray-400 mb-2">{t.aboutCredit}</p>
                 <a href="https://www.tangibledata.xyz" target="_blank" rel="noopener noreferrer" aria-label="Tangible Data Website" className="inline-block">
                    <TangibleDataLogo className="h-6 text-white hover:text-cyan-400 transition-colors" />
                 </a>
            </div>
        </div>
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [gameStateBeforeDashboard, setGameStateBeforeDashboard] = useState<GameState>(GameState.START);
  const [currentStory, setCurrentStory] = useState<StorySegment | null>(null);
  const [storyHistory, setStoryHistory] = useState<StoryHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const t = locales[language];

  const resetGame = () => {
    setGameState(GameState.START);
    setCurrentStory(null);
    setStoryHistory([]);
    setError(null);
  };
  
  const handleStartGame = useCallback((selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setError(null);
    const initialStory = storyData[selectedLanguage]['start'];
    
    setCurrentStory(initialStory);
    setStoryHistory([{ scene: initialStory.sceneDescription, choice: "The analysis begins..." }]);
    setGameState(GameState.PLAYING);
  }, []);

  const handleChoice = useCallback((choice: Choice) => {
    setError(null);

    const newHistory: StoryHistoryItem[] = [...storyHistory, { scene: currentStory?.sceneDescription || '', choice: choice.text }];
    setStoryHistory(newHistory);
    
    const nextStory = storyData[language][choice.nextSceneId];

    if (!nextStory) {
        console.error(`Error: Scene with id "${choice.nextSceneId}" not found.`);
        setError("An error occurred: the next analysis step could not be found.");
        setGameState(GameState.ERROR);
        return;
    }

    setCurrentStory(nextStory);

    if (nextStory.choices.length === 0) {
      setGameState(GameState.GAME_OVER);
    } else {
      setGameState(GameState.PLAYING);
    }
  }, [storyHistory, currentStory, language]);
  
  const handleOpenDashboard = () => {
    setGameStateBeforeDashboard(gameState);
    setGameState(GameState.DASHBOARD);
  };

  const handleCloseDashboard = () => {
    setGameState(gameStateBeforeDashboard);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onStart={handleStartGame} />;
      case GameState.PLAYING:
        return currentStory ? (
          <GameScreen
            story={currentStory}
            onChoice={handleChoice}
            isLoading={false}
            language={language}
          />
        ) : null;
      case GameState.GAME_OVER:
         return currentStory ? (
           <GameOverScreen finalScene={currentStory} onRestart={resetGame} language={language} />
         ) : null;
      case GameState.DASHBOARD:
        return <DashboardScreen onBack={handleCloseDashboard} language={language} />;
      case GameState.ERROR:
        return (
          <div className="text-center text-red-400">
            <h2 className="text-2xl font-bold mb-4">{t.errorTitle}</h2>
            <p>{error}</p>
            <button
              onClick={resetGame}
              className="mt-6 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {t.errorTryAgain}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const showHeader = gameState === GameState.PLAYING || gameState === GameState.GAME_OVER || gameState === GameState.DASHBOARD;

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-center p-4 relative">
       <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col">
          {showHeader && 
            <Header 
              onDashboardClick={handleOpenDashboard} 
              onChatClick={() => setIsChatOpen(true)}
              onAboutClick={() => setIsAboutOpen(true)}
              language={language} 
            />
          }
          <main className="flex-grow flex items-center justify-center">
            {renderContent()}
          </main>
       </div>
       <ChatModal 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          language={language}
          context={currentStory?.sceneDescription || 'General inquiry'}
       />
       <AboutModal 
          isOpen={isAboutOpen} 
          onClose={() => setIsAboutOpen(false)} 
          language={language}
       />
    </div>
  );
};


const App: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange, false);
    return () => {
      window.removeEventListener('hashchange', handleHashChange, false);
    };
  }, []);

  if (route.toLowerCase().startsWith('#/admin')) {
    return <AdminScreen />;
  }

  return <Game />;
};

export default App;