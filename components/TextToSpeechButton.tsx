import React from 'react';
import useTextToSpeech from './useTextToSpeech';
import { SpeakerOnIcon, SpeakerOffIcon, LoadingSpinnerIcon } from './icons';
import type { Language } from '../types';

interface TextToSpeechButtonProps {
  textToSpeak: string;
  language: Language;
  className?: string;
}

const TextToSpeechButton: React.FC<TextToSpeechButtonProps> = ({ textToSpeak, language, className = '' }) => {
  const { isSpeaking, isLoading, speak, cancel } = useTextToSpeech();

  // Effect to cancel speech if the component unmounts or the text changes.
  React.useEffect(() => {
    return () => {
      cancel();
    }
  }, [textToSpeak, cancel]);

  const handleToggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    if (isSpeaking) {
      cancel();
    } else {
      speak(textToSpeak, language);
    }
  };
  
  const getIcon = () => {
    if (isLoading) {
      return <LoadingSpinnerIcon className="h-6 w-6" />;
    }
    if (isSpeaking) {
      return <SpeakerOffIcon className="h-6 w-6" />;
    }
    return <SpeakerOnIcon className="h-6 w-6" />;
  };
  
  const getTitle = () => {
    if (isLoading) return "Loading audio...";
    if (isSpeaking) return "Stop narration";
    return "Start narration";
  }

  return (
    <button
      onClick={handleToggleSpeech}
      className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-wait ${
        isSpeaking 
          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      } ${className}`}
      aria-label={getTitle()}
      title={getTitle()}
      disabled={isLoading}
    >
      {getIcon()}
    </button>
  );
};

export default TextToSpeechButton;