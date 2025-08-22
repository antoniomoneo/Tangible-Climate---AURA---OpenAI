import React from 'react';
import type { StorySegment, Language, Choice } from '../types';
import { ChartBarIcon } from './icons';
import { locales } from '../locales';
import SkeletonChart from './SkeletonChart';

interface GameScreenProps {
  story: StorySegment;
  onChoice: (choice: Choice) => void;
  isLoading: boolean;
  language: Language;
}

const GameScreen: React.FC<GameScreenProps> = ({ story, onChoice, isLoading, language }) => {
  const t = locales[language];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start w-full max-w-7xl mx-auto p-4">
      {/* Visual Column */}
      <div className="w-full aspect-video rounded-lg shadow-2xl bg-gray-800 border border-gray-700 overflow-hidden relative flex items-center justify-center p-4">
        {story.chartConfig ? (
          <SkeletonChart 
            key={`${story.chartConfig.startYear}-${story.chartConfig.endYear}`}
            startYear={story.chartConfig.startYear}
            endYear={story.chartConfig.endYear}
          />
        ) : story.image ? (
          <img 
            key={story.image}
            src={story.image} 
            alt="Scene" 
            className="w-full h-full object-contain animate-fadeIn" 
          />
        ) : (
          <div className="text-gray-500">No visual available</div>
        )}
      </div>

      {/* Story Column */}
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col h-full">
        <div className="flex-grow mb-6">
            <h2 className="font-title text-3xl text-cyan-400 mb-4">{t.gameTitle}</h2>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
                <p key={story.sceneDescription} className="animate-fadeIn">
                    {story.sceneDescription}
                </p>
            </div>
        </div>
        
        {/* Choices */}
        <div>
          <h3 className="text-xl font-bold text-gray-300 mb-4 border-t border-gray-600 pt-4">{t.whatToDo}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {story.choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => onChoice(choice)}
                disabled={isLoading}
                className="group flex items-center justify-start text-left bg-gray-700 hover:bg-cyan-600 hover:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-gray-600 disabled:cursor-wait disabled:text-gray-400"
              >
                <span className="mr-3 text-cyan-400 group-hover:text-white transition-colors">
                    <ChartBarIcon />
                </span>
                {choice.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;