import React, { useEffect, useRef, useState } from 'react';
import type { Language } from '../types';
import { locales, storyData } from '../locales';
import SkeletonChart from './SkeletonChart';

interface ARModeScreenProps {
  onBack: () => void;
  language: Language;
}

const eras = [
  { id: 'era_industrial', startYear: 1880, endYear: 1945 },
  { id: 'era_acceleration', startYear: 1945, endYear: 1975 },
  { id: 'era_modern', startYear: 1975, endYear: 2024 },
];

const ARModeScreen: React.FC<ARModeScreenProps> = ({ onBack, language }) => {
  const t = locales[language];
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeEra, setActiveEra] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setError("Your browser does not support camera access.");
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please check permissions.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const fullChartStartYear = 1880;
  const fullChartEndYear = 2024;
  const totalYears = fullChartEndYear - fullChartStartYear;

  const getEraPosition = (eraStartYear: number, eraEndYear: number) => {
    const eraMidpointYear = eraStartYear + (eraEndYear - eraStartYear) / 2;
    const relativeStart = eraMidpointYear - fullChartStartYear;
    return `${(relativeStart / totalYears) * 100}%`;
  };

  const story = storyData[language];
  const eraInfo = {
    era_industrial: story.start.choices.find(c => c.nextSceneId === 'era_industrial')?.text,
    era_acceleration: story.start.choices.find(c => c.nextSceneId === 'era_acceleration')?.text,
    era_modern: story.start.choices.find(c => c.nextSceneId === 'era_modern')?.text,
  };

  return (
    <div className="fixed inset-0 bg-black text-white w-full h-full">
      <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0"></video>
      <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
      
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-4">
        {error ? (
          <div className="text-center bg-red-800/50 p-6 rounded-lg">
            <h2 className="text-xl font-bold">Camera Error</h2>
            <p>{error}</p>
            <button
              onClick={onBack}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Back to App Hub
            </button>
          </div>
        ) : (
          <>
            {/* Overlay UI */}
            <div className="absolute top-4 text-center w-full px-6">
              <h1 className="text-2xl font-title drop-shadow-lg">{t.appHubARTitle}</h1>
              <p className="text-sm opacity-90 drop-shadow-md">{t.arModeInstruction}</p>
            </div>
            
            {/* Chart Container */}
            <div className="w-full h-[60vh] max-w-6xl relative opacity-80">
                <SkeletonChart startYear={fullChartStartYear} endYear={fullChartEndYear} />

                {/* Markers */}
                <div className="absolute top-0 left-[50px] right-[30px] bottom-[40px] pointer-events-none">
                    {eras.map(era => (
                        <button 
                            key={era.id}
                            className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-400 rounded-full border-2 border-white shadow-lg animate-pulse pointer-events-auto"
                            style={{ left: getEraPosition(era.startYear, era.endYear) }}
                            onClick={() => setActiveEra(era.id)}
                            aria-label={`Show information for period ${era.startYear}-${era.endYear}`}
                        />
                    ))}
                </div>
            </div>

            {/* Info Popup */}
            {activeEra && story[activeEra] && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-gray-800/80 backdrop-blur-sm border border-gray-600 p-4 rounded-lg shadow-2xl animate-fadeIn">
                    <h3 className="font-bold text-cyan-400 text-lg mb-2">{eraInfo[activeEra as keyof typeof eraInfo] || 'Era Details'}</h3>
                    <p className="text-sm text-gray-300 mb-3">{story[activeEra].sceneDescription}</p>
                    <button onClick={() => setActiveEra(null)} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-lg text-sm">
                        Close
                    </button>
                </div>
            )}
            
            <button
              onClick={onBack}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg"
            >
              {t.dashboardBack}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ARModeScreen;