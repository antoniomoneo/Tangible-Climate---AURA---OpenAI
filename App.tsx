import React, { useState, useCallback, useEffect } from 'react';
// FIX: Fix import paths to be relative.
import { GameState, StorySegment, StoryHistoryItem, Language, Choice, GlossaryTerm, AppDefinition } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import DashboardScreen from './components/DashboardScreen';
import Header from './components/Header';
import ChatModal from './components/ChatModal';
import AdminScreen from './components/AdminScreen';
import DebugPanel from './components/DebugPanel';
// FIX: Fix import paths to be relative.
import { locales, storyData } from './locales';
import { TangibleDataLogo } from './components/icons';
import SplashScreen from './components/SplashScreen';
import InstructionsModal from './components/InstructionsModal';
import CalendarModal from './components/CalendarModal';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import AppHubScreen from './components/AppHubScreen';
import KnowledgeBaseScreen from './components/KnowledgeBaseScreen';
import { knowledgeBaseContent } from './data/knowledgeBaseContent';
import JoinUsModal from './components/JoinUsModal';
import ScenarioLabModal from './components/ScenarioLabModal';
// FIX: Fix import paths to be relative.
import GlossaryModal from './components/GlossoryModal';
import AuraChatButton from './components/AuraChatButton';
import ARModeScreen from './components/ARModeScreen';
import VRModeScreen from './components/VRModeScreen';
import Footer from './components/Footer';
import CrazyVizModal from './components/CrazyVizModal';
import TangibleClimateQuestModal from './components/TangibleClimateQuestModal';
import CreditsModal from './components/CreditsModal';
import { getAppHubApps } from './data/vrAppAssets';


// FIX: Add a global declaration for window.gtag to resolve TypeScript errors.
declare global {
  interface Window {
    gtag: (command: 'event', eventName: string, eventParams: { [key: string]: any }) => void;
  }
}

// Helper function to send GA events
const trackEvent = (eventName: string, eventParams: { [key: string]: any }) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  } else {
    console.log(`GA Event (gtag not found): ${eventName}`, eventParams);
  }
};

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
  const [gameState, setGameState] = useState<GameState>(GameState.LANGUAGE_SELECTION);
  const [gameStateBeforeDashboard, setGameStateBeforeDashboard] = useState<GameState>(GameState.START);
  const [currentStory, setCurrentStory] = useState<StorySegment | null>(null);
  const [storyHistory, setStoryHistory] = useState<StoryHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isJoinUsOpen, setIsJoinUsOpen] = useState(false);
  const [isScenarioLabOpen, setIsScenarioLabOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false);
  const [isCrazyVizOpen, setIsCrazyVizOpen] = useState(false);
  const [isClimateQuestOpen, setIsClimateQuestOpen] = useState(false);
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [debugEvents, setDebugEvents] = useState<any[]>([]);
  const [currentChatContext, setCurrentChatContext] = useState('');
  const [currentSceneId, setCurrentSceneId] = useState('general_inquiry');

  const isAdmin = sessionStorage.getItem('isAdminAuthenticated') === 'true';
  const t = locales[language];

  const resetGame = () => {
    trackEvent('reset_game', { language });
    setGameState(GameState.LANGUAGE_SELECTION);
    setCurrentStory(null);
    setStoryHistory([]);
    setError(null);
  };

  const handleLanguageSelection = (selectedLanguage: Language) => {
    trackEvent('select_language', { language: selectedLanguage });
    setLanguage(selectedLanguage);
    setGameState(GameState.SPLASH);
  };
  
  const handleShowAppHub = () => {
    trackEvent('navigate_to_app_hub', { from_state: gameState });
    setGameState(GameState.APP_HUB);
  };

  const handleStartGame = useCallback(() => {
    setError(null);
    trackEvent('start_game', { language });
    const initialStory = storyData[language]['start'];
    
    setCurrentStory(initialStory);
    setStoryHistory([{ scene: initialStory.sceneDescription, choice: "The analysis begins..." }]);
    setGameState(GameState.PLAYING);
  }, [language]);

  const handleChoice = useCallback((choice: Choice) => {
    setError(null);
    
    trackEvent('make_choice', { 
      scene_id: currentStory?.id, 
      choice_text: choice.text, 
      next_scene_id: choice.nextSceneId 
    });

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
    trackEvent('open_modal', { modal_name: 'dashboard' });
    setGameStateBeforeDashboard(gameState);
    setGameState(GameState.DASHBOARD);
  };

  const handleCloseDashboard = () => {
    setGameState(gameStateBeforeDashboard);
  };
  
  const handleOpenGeneralChat = () => {
    trackEvent('open_modal', { modal_name: 'chat' });
    setCurrentChatContext(t.chatSystemInstruction);
    setCurrentSceneId('general_inquiry');
    setDebugEvents([]);
    if (isAdmin) {
      setIsDebugPanelOpen(true);
    }
    setIsChatOpen(true);
  };

  const handleOpenKnowledgeBaseChat = () => {
    trackEvent('open_modal', { modal_name: 'chat_knowledge_base' });
    const reportText = knowledgeBaseContent[language].sections
        .map(s => `## ${s.heading}\n${s.text.replace(/<[^>]*>/g, ' ')}`)
        .join('\n\n');
    const context = `${t.chatSystemInstructionReport}\n\n---BEGIN REPORT---\n${reportText}\n---END REPORT---`;

    setCurrentChatContext(context);
    setCurrentSceneId('knowledge_base_qna');
    setIsChatOpen(true);
  };
  
  const handleOpenAbout = () => {
    trackEvent('open_modal', { modal_name: 'about' });
    setIsAboutOpen(true);
  };

  const handleOpenInstructions = () => {
    trackEvent('open_modal', { modal_name: 'instructions' });
    setIsInstructionsOpen(true);
  };

  const handleOpenCalendar = () => {
    trackEvent('open_modal', { modal_name: 'calendar' });
    setIsCalendarOpen(true);
  };

  const handleOpenKnowledgeBase = () => {
    trackEvent('navigate_to_knowledge_base', { from_state: gameState });
    setGameState(GameState.KNOWLEDGE_BASE);
  };
  
  const handleOpenJoinUs = () => {
    trackEvent('open_modal', { modal_name: 'join_us' });
    setIsJoinUsOpen(true);
  };

  const handleOpenScenarioLab = () => {
    trackEvent('open_modal', { modal_name: 'scenario_lab' });
    setIsScenarioLabOpen(true);
  };

  const handleOpenGlossary = () => {
    trackEvent('open_modal', { modal_name: 'glossary' });
    setIsGlossaryOpen(true);
  };

  const handleOpenARMode = () => {
    trackEvent('navigate_to_ar_mode', { from_state: gameState });
    setGameState(GameState.AR_MODE);
  };

  const handleOpenVRMode = () => {
    trackEvent('navigate_to_vr_mode', { from_state: gameState });
    setGameState(GameState.VR_MODE);
  };

  const handleOpenCrazyViz = () => {
    trackEvent('open_modal', { modal_name: 'crazy_viz' });
    setIsCrazyVizOpen(true);
  };
  
  const handleOpenClimateQuest = () => {
    trackEvent('open_modal', { modal_name: 'climate_quest' });
    setIsClimateQuestOpen(true);
  };

  const handleOpenCredits = () => {
    trackEvent('open_modal', { modal_name: 'credits' });
    setIsCreditsOpen(true);
  }

  const handleCloseARMode = () => {
    setGameState(GameState.APP_HUB);
  };

  const handleCloseVRMode = () => {
    setGameState(GameState.APP_HUB);
  };

  const handleAskAuraInGlossary = (term: GlossaryTerm) => {
    trackEvent('open_modal', { modal_name: 'chat_glossary', term: term.name });
    const systemInstruction = t.chatExplainTermSystemInstruction
      .replace('{term}', term.name)
      .replace('{definition}', term.definition);
    
    setCurrentChatContext(systemInstruction);
    setCurrentSceneId(`glossary_term_${term.name.replace(/\s+/g, '_')}`);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };
  
  const handleDebugEvent = (eventData: any) => {
    const eventWithTimestamp = {
      timestamp: new Date().toISOString(),
      payload: eventData,
    };
    setDebugEvents(prevEvents => [...prevEvents, eventWithTimestamp]);
  };

  const appHubApps: AppDefinition[] = getAppHubApps({
      onStartGame: handleStartGame,
      onOpenDashboard: handleOpenDashboard,
      onOpenCalendar: handleOpenCalendar,
      onOpenChat: handleOpenGeneralChat,
      onOpenInstructions: handleOpenInstructions,
      onOpenKnowledgeBase: handleOpenKnowledgeBase,
      onOpenJoinUs: handleOpenJoinUs,
      onOpenScenarioLab: handleOpenScenarioLab,
      onOpenGlossary: handleOpenGlossary,
      onOpenARMode: handleOpenARMode,
      onOpenVRMode: handleOpenVRMode,
      onOpenCrazyViz: handleOpenCrazyViz,
      onOpenClimateQuest: handleOpenClimateQuest,
      onOpenCredits: handleOpenCredits,
  });

  if (gameState === GameState.LANGUAGE_SELECTION) {
    return <LanguageSelectionScreen onSelect={handleLanguageSelection} />;
  }
  
  if (gameState === GameState.SPLASH) {
    return <SplashScreen onFinished={() => setGameState(GameState.START)} language={language} />;
  }

  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen onShowHub={handleShowAppHub} language={language} />;
      case GameState.APP_HUB:
        return <AppHubScreen 
                  apps={appHubApps}
                  language={language}
                />;
      case GameState.KNOWLEDGE_BASE:
        return <KnowledgeBaseScreen
            onBack={handleShowAppHub}
            onOpenChat={handleOpenKnowledgeBaseChat}
            language={language}
        />;
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
           <GameOverScreen 
              finalScene={currentStory} 
              onRestart={resetGame} 
              language={language}
              onOpenQuest={handleOpenClimateQuest}
            />
         ) : null;
      case GameState.DASHBOARD:
        return <DashboardScreen onBack={handleCloseDashboard} language={language} />;
      case GameState.AR_MODE:
        return <ARModeScreen onBack={handleCloseARMode} language={language} />;
      case GameState.VR_MODE:
        return <VRModeScreen onBack={handleCloseVRMode} language={language} appHubApps={appHubApps} />;
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

  const immersiveModes: GameState[] = [
    GameState.LANGUAGE_SELECTION,
    GameState.SPLASH,
    GameState.ERROR,
    GameState.AR_MODE,
    GameState.VR_MODE,
  ];

  const showHeader = !immersiveModes.includes(gameState);
  const showChatButton = !immersiveModes.includes(gameState);
  const showFooter = !immersiveModes.includes(gameState);

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col items-center justify-center p-4 relative pb-14">
       <div className="w-full max-w-7xl mx-auto flex-grow flex flex-col">
          {showHeader && 
            <Header 
              onAppHubClick={handleShowAppHub}
              onInstructionsClick={handleOpenInstructions}
              onAboutClick={handleOpenAbout}
              language={language} 
            />
          }
          <main className="flex-grow flex items-center justify-center">
            {renderContent()}
          </main>
       </div>

       {showChatButton && <AuraChatButton onClick={handleOpenGeneralChat} language={language} />}

       {showFooter && <Footer />}

       <ChatModal 
          isOpen={isChatOpen} 
          onClose={handleCloseChat} 
          language={language}
          sceneId={currentSceneId}
          context={currentChatContext}
          onDebugEvent={handleDebugEvent}
       />
       <AboutModal 
          isOpen={isAboutOpen} 
          onClose={() => setIsAboutOpen(false)} 
          language={language}
       />
       <InstructionsModal
          isOpen={isInstructionsOpen}
          onClose={() => setIsInstructionsOpen(false)}
          language={language}
       />
       <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          language={language}
       />
        <JoinUsModal
          isOpen={isJoinUsOpen}
          onClose={() => setIsJoinUsOpen(false)}
          language={language}
        />
        <ScenarioLabModal
            isOpen={isScenarioLabOpen}
            onClose={() => setIsScenarioLabOpen(false)}
            language={language}
        />
        <GlossaryModal
          isOpen={isGlossaryOpen}
          onClose={() => setIsGlossaryOpen(false)}
          language={language}
          onAskAura={handleAskAuraInGlossary}
        />
        <CrazyVizModal
            isOpen={isCrazyVizOpen}
            onClose={() => setIsCrazyVizOpen(false)}
            language={language}
        />
        <TangibleClimateQuestModal
            isOpen={isClimateQuestOpen}
            onClose={() => setIsClimateQuestOpen(false)}
            language={language}
        />
        <CreditsModal
            isOpen={isCreditsOpen}
            onClose={() => setIsCreditsOpen(false)}
            language={language}
        />
       {isAdmin && (
         <DebugPanel 
            isOpen={isDebugPanelOpen}
            events={debugEvents}
            onClose={() => setIsDebugPanelOpen(false)}
         />
       )}
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