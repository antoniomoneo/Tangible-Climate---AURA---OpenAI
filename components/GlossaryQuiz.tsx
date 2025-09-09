import React, { useState, useEffect } from 'react';
import type { Language, QuizQuestion } from '../types';
import { quizContent } from '../data/quizContent';
import { locales } from '../locales';

interface GlossaryQuizProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const GlossaryQuiz: React.FC<GlossaryQuizProps> = ({ isOpen, onClose, language }) => {
  const content = quizContent[language];
  const t = locales[language];
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([]);

  const shuffleAndStart = () => {
    const array = [...content.questions];
    // Fisher-Yates shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    setShuffledQuestions(array);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  };

  useEffect(() => {
    if (isOpen) {
      shuffleAndStart();
    }
  }, [isOpen]);

  if (!isOpen || shuffledQuestions.length === 0) return null;

  const currentQuestion: QuizQuestion = shuffledQuestions[currentQuestionIndex];
  const isFinished = currentQuestionIndex >= shuffledQuestions.length;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="font-title text-2xl text-cyan-400">{content.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        <div className="p-6 text-gray-300">
          {isFinished ? (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{t.quizCompletedTitle}</h3>
              <p className="text-lg mb-4">{t.quizCompletedScore.replace('{score}', score.toString()).replace('{total}', shuffledQuestions.length.toString())}</p>
              <div className="flex justify-center gap-4">
                <button onClick={shuffleAndStart} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                  {t.quizRestart}
                </button>
                <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">
                  {t.quizClose}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-400 mb-2">{t.quizQuestionLabel.replace('{current}', (currentQuestionIndex + 1).toString()).replace('{total}', shuffledQuestions.length.toString())}</p>
              <h3 className="text-xl font-semibold mb-4 text-white">{currentQuestion.question}</h3>
              <div className="space-y-3">
                {currentQuestion.options.map(option => {
                  const isCorrect = option === currentQuestion.correctAnswer;
                  const isSelected = option === selectedAnswer;
                  let buttonClass = 'w-full text-left bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors';
                  if (isAnswered) {
                    if (isCorrect) {
                      buttonClass = 'w-full text-left bg-green-600 text-white font-semibold py-3 px-4 rounded-lg';
                    } else if (isSelected) {
                      buttonClass = 'w-full text-left bg-red-600 text-white font-semibold py-3 px-4 rounded-lg';
                    }
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
                  <p className="text-gray-300">{currentQuestion.explanation}</p>
                  <button onClick={handleNextQuestion} className="mt-3 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg">
                    {currentQuestionIndex === shuffledQuestions.length - 1 ? t.quizFinish : t.quizNext}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlossaryQuiz;