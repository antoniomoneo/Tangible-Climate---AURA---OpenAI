import React, { useState } from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { IdentificationIcon } from './icons';

interface TangibleClimateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const questQuestions = {
  en: [
    {
      question: "What is the 'Climate Change Skeleton' sculpture based on?",
      options: ["Fossil records", "Global temperature anomaly data", "Ocean acidity levels", "Atmospheric CO2 concentrations"],
      correctAnswer: "Global temperature anomaly data",
      explanation: "The sculpture's 'ribs' are shaped by the global temperature anomaly data from 1880 to the present, visualizing the warming trend."
    },
    {
      question: "Which institution collaborated with Tangible Data on this project?",
      options: ["The Louvre Museum", "The British Museum", "The Spanish National Museum of Natural Sciences (MNCN-CSIC)", "The Smithsonian"],
      correctAnswer: "The Spanish National Museum of Natural Sciences (MNCN-CSIC)",
      explanation: "This project is a collaboration with the MNCN-CSIC in Madrid, where the physical sculpture is exhibited."
    },
    {
      question: "What does a positive temperature anomaly value signify in the data?",
      options: ["A year colder than average", "A year warmer than the 1951-1980 average", "A year with average temperature", "A data error"],
      correctAnswer: "A year warmer than the 1951-1980 average",
      explanation: "The data shows deviations from a baseline period (1951-1980). Positive values (red/warm colors in charts) mean the year was warmer than that baseline average."
    }
  ],
  es: [
    {
      question: "¿En qué se basa la escultura 'El Esqueleto del Cambio Climático'?",
      options: ["Registros fósiles", "Datos de la anomalía de la temperatura global", "Niveles de acidez del océano", "Concentraciones de CO2 atmosférico"],
      correctAnswer: "Datos de la anomalía de la temperatura global",
      explanation: "Las 'costillas' de la escultura están moldeadas por los datos de la anomalía de la temperatura global desde 1880 hasta el presente, visualizando la tendencia al calentamiento."
    },
    {
      question: "¿Qué institución colaboró con Tangible Data en este proyecto?",
      options: ["El Museo del Louvre", "El Museo Británico", "El Museo Nacional de Ciencias Naturales (MNCN-CSIC)", "El Smithsonian"],
      correctAnswer: "El Museo Nacional de Ciencias Naturales (MNCN-CSIC)",
      explanation: "Este proyecto es una colaboración con el MNCN-CSIC en Madrid, donde se exhibe la escultura física."
    },
    {
      question: "¿Qué significa un valor de anomalía de temperatura positivo en los datos?",
      options: ["Un año más frío que el promedio", "Un año más cálido que el promedio de 1951-1980", "Un año con temperatura promedio", "Un error en los datos"],
      correctAnswer: "Un año más cálido que el promedio de 1951-1980",
      explanation: "Los datos muestran desviaciones de un período de referencia (1951-1980). Los valores positivos (colores rojos/cálidos en los gráficos) significan que el año fue más cálido que el promedio de esa referencia."
    }
  ]
}

type QuestState = 'intro' | 'playing' | 'results';

const TangibleClimateQuestModal: React.FC<TangibleClimateQuestModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];
  const questions = questQuestions[language];
  
  const [questState, setQuestState] = useState<QuestState>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const resetQuest = () => {
    setQuestState('intro');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };
  
  const handleClose = () => {
      resetQuest();
      onClose();
  }

  if (!isOpen) return null;
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuestState('results');
    }
  };

  const renderContent = () => {
    switch (questState) {
      case 'intro':
        return (
          <div className="text-center">
            <p className="text-lg mb-6">{t.questIntro}</p>
            <button
              onClick={() => setQuestState('playing')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg"
            >
              {t.questStart}
            </button>
          </div>
        );
      case 'results':
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">{t.questResultsTitle}</h3>
            <p className="text-lg mb-4">{t.questResultsScore.replace('{score}', score.toString()).replace('{total}', questions.length.toString())}</p>
            <div className="flex justify-center gap-4">
              <button onClick={resetQuest} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                {t.questRestart}
              </button>
            </div>
          </div>
        );
      case 'playing':
        return (
          <div>
            <p className="text-sm text-gray-400 mb-2">{t.quizQuestionLabel.replace('{current}', (currentQuestionIndex + 1).toString()).replace('{total}', questions.length.toString())}</p>
            <h3 className="text-xl font-semibold mb-4 text-white">{currentQuestion.question}</h3>
            <div className="space-y-3">
              {currentQuestion.options.map(option => {
                const isCorrect = option === currentQuestion.correctAnswer;
                const isSelected = option === selectedAnswer;
                let buttonClass = 'w-full text-left bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors';
                if (isAnswered) {
                  if (isCorrect) buttonClass = 'w-full text-left bg-green-600 text-white font-semibold py-3 px-4 rounded-lg';
                  else if (isSelected) buttonClass = 'w-full text-left bg-red-600 text-white font-semibold py-3 px-4 rounded-lg';
                }
                return (
                  <button key={option} onClick={() => handleAnswerSelect(option)} disabled={isAnswered} className={buttonClass}>
                    {option}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg animate-fadeIn">
                <p className={`font-bold ${selectedAnswer === currentQuestion.correctAnswer ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedAnswer === currentQuestion.correctAnswer ? t.questCorrect : t.questIncorrect}
                </p>
                <p className="text-gray-300 mt-1">{currentQuestion.explanation}</p>
                <button onClick={handleNext} className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                  {currentQuestionIndex === questions.length - 1 ? t.questResults : t.questNext}
                </button>
              </div>
            )}
          </div>
        );
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="font-title text-2xl text-cyan-400 flex items-center gap-2">
            <IdentificationIcon className="h-6 w-6"/>
            {t.questTitle}
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>
        <div className="p-6 text-gray-300">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default TangibleClimateQuestModal;
