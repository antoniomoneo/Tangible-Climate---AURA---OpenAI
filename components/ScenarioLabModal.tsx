import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { temperatureData } from '../data/temperatureData';
import type { Language, DataPoint } from '../types';
import { locales } from '../locales';
import { generateSimulation, getScenarios, SCENARIO_JUSTIFICATIONS } from '../utils/simulationService';
import type { ScenarioId } from '../utils/simulationService';
import { LightBulbIcon } from './icons';

interface ScenarioLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const ScenarioLabModal: React.FC<ScenarioLabModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];
  const scenarios = getScenarios(language);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('NO_AEROSOL_COOLING');
  const [aiSimulatedData, setAiSimulatedData] = useState<DataPoint[] | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const historicalData: DataPoint[] = useMemo(() => temperatureData, []);

  const handleSelectScenario = (scenarioId: ScenarioId) => {
    setSelectedScenario(scenarioId);
    setAiSimulatedData(null);
    setAiExplanation(null);
    setErrorAI(null);
  };

  const handleGenerateAIScenario = async () => {
    if (!userInput.trim()) return;
    setIsLoadingAI(true);
    setErrorAI(null);
    setAiSimulatedData(null);
    setAiExplanation(null);

    try {
      const response = await fetch('/api/scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput, historicalData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Server error');
      }

      const result = await response.json();
      
      if (!result.simulatedData || !result.explanation) {
        throw new Error("Invalid response structure from AI.");
      }

      const lastHistoricalYear = historicalData[historicalData.length - 1].year;
      // Prepend last historical point for a connected line
      const lastHistPoint = historicalData.find(d => d.year === lastHistoricalYear);
      const simulation = lastHistPoint ? [lastHistPoint, ...result.simulatedData] : result.simulatedData;
      
      setAiSimulatedData(simulation);
      setAiExplanation(result.explanation);
    } catch (e) {
      console.error("AI Scenario Generation failed:", e);
      const message = e instanceof Error ? e.message : t.scenarioLabAiError;
      setErrorAI(`${t.scenarioLabAiError} ${message}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const combinedData = useMemo(() => {
    const simulationData = aiSimulatedData || generateSimulation(historicalData, selectedScenario);
    const allYears = new Set([...historicalData.map(p => p.year), ...simulationData.map(p => p.year)]);

    return Array.from(allYears).sort().map(year => {
      const histPoint = historicalData.find(p => p.year === year);
      const simPoint = simulationData.find(p => p.year === year);
      return {
        year: year,
        real: histPoint ? histPoint.anomaly : null,
        simulated: simPoint ? simPoint.anomaly : null,
      };
    });
  }, [historicalData, selectedScenario, aiSimulatedData]);

  const scenarioInfo = scenarios[selectedScenario];
  const scenarioJustification = SCENARIO_JUSTIFICATIONS[selectedScenario][language];

  const simulationName = aiSimulatedData ? `IA: ${userInput.substring(0, 25)}...` : scenarioInfo.name;
  const simulationColor = aiSimulatedData ? "#10b981" : "#f97316";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-90 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-800 border border-cyan-500/30 rounded-2xl shadow-2xl w-full h-full p-4 sm:p-6 flex flex-col relative overflow-y-auto">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-title text-cyan-300 flex items-center gap-3">
            <LightBulbIcon />
            {t.scenarioLabTitle}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors text-3xl leading-none" aria-label="Close">&times;</button>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 pt-4">
          {/* Left Column (25%) - Controls */}
          <div className="lg:w-1/4 space-y-6 overflow-y-auto pr-2 pb-4 flex-shrink-0">
             <section>
              <label htmlFor="scenario-select" className="text-lg font-bold text-gray-300">{t.scenarioLabSelectPreset}</label>
              <select
                id="scenario-select"
                value={aiSimulatedData ? 'ai_custom' : selectedScenario}
                onChange={(e) => {
                  if (e.target.value !== 'ai_custom') {
                    handleSelectScenario(e.target.value as ScenarioId);
                  }
                }}
                className="w-full mt-2 p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                disabled={isLoadingAI}
              >
                {aiSimulatedData && <option value="ai_custom" disabled>{`IA: ${userInput.substring(0, 25)}...`}</option>}
                {Object.entries(scenarios).map(([id, { name }]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </section>

            <section className="pt-6 border-t border-gray-700">
              <h3 className="text-lg font-bold text-green-300">{t.scenarioLabCustomAi}</h3>
              <p className="text-sm text-gray-400 mt-1 mb-3">{t.scenarioLabCustomAiDesc}</p>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t.scenarioLabCustomAiPlaceholder}
                className="w-full h-24 mt-2 p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                maxLength={200}
                disabled={isLoadingAI}
              />
              <button
                onClick={handleGenerateAIScenario}
                disabled={isLoadingAI || !userInput.trim()}
                className="w-full mt-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {isLoadingAI ? t.scenarioLabGeneratingButton : t.scenarioLabGenerateButton}
              </button>
              {errorAI && <p className="text-sm text-red-400 mt-2 p-2 bg-red-900/50 rounded-md">{errorAI}</p>}
            </section>
          </div>

          {/* Center Column (50%) - Chart */}
          <div className="lg:w-1/2 flex-1 flex flex-col min-h-[50vh] lg:min-h-full">
             <h3 className="text-center font-title text-cyan-200 mb-4 flex-shrink-0 text-lg">
                {t.scenarioLabChartTitle}
              </h3>
              <div className="flex-grow min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={combinedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} domain={['auto', 'auto']} label={{ value: t.scenarioLabChartYAxis, angle: -90, position: 'insideLeft', fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#22d3ee' }} labelStyle={{ color: '#a5f3fc', fontWeight: 'bold' }} />
                    <Legend />
                    <Line type="monotone" dataKey="real" name={t.scenarioLabChartReal} stroke="#38bdf8" strokeWidth={2} dot={false} connectNulls />
                    <Line type="monotone" dataKey="simulated" name={simulationName} stroke={simulationColor} strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Right Column (25%) - Explanation */}
          <div className="lg:w-1/4 lg:h-full lg:overflow-y-auto p-1">
             {aiExplanation ? (
                <div className="p-4 bg-gray-900/70 border-l-4 border-green-400 rounded-r-lg animate-fadeIn">
                  <h4 className="font-bold text-green-300">{t.scenarioLabAiLogic}</h4>
                  <p className="text-sm text-gray-300 mt-1">{aiExplanation}</p>
                </div>
              ) : scenarioInfo && (
                <div className="p-4 bg-gray-900/70 border-l-4 border-orange-400 rounded-r-lg animate-fadeIn">
                  <h4 className="font-bold text-orange-300">{scenarioInfo.name}</h4>
                  <p className="text-sm text-gray-300 mt-2">{scenarioInfo.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    <span className='font-bold text-gray-300'>{t.scenarioLabPresetLogic}:</span> {scenarioJustification}
                  </p>
                </div>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ScenarioLabModal;