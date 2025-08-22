import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Calibrating sensors...",
  "Accessing historical data...",
  "Rendering climate model...",
  "Compiling data points...",
  "Initializing analysis AI...",
];

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-lg font-semibold font-title">{message || currentMessage}</p>
    </div>
  );
};

export default LoadingIndicator;
