import React, { useState, useEffect, useRef } from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { IdentificationIcon } from './icons';

// Game structure provided by user
const gameData = {
  "title": "Tangible Climate Quest",
  "setting": {
    "era": "Futuro postapocalíptico",
    "location": "Ruinas de la antigua sede del Museo de Ciencias Naturales en Madrid",
    "theme": "Aventura arqueológica con misterio y tensión",
    "style": "Aventura gráfica retro estilo Sierra (King’s Quest / Space Quest)"
  },
  "instructions": {
    "objective": "Explorar las ruinas, descifrar los huesos del 'Esqueleto del Clima' y descubrir cómo los datos perdidos podían haber cambiado el destino de la humanidad.",
    "controls": [
      "EXAMINAR + objeto (ej. EXAMINAR huesos)",
      "USAR + objeto",
      "HABLAR con + personaje",
      "MOVER hacia + dirección",
      "INVENTARIO para ver tus objetos"
    ],
    "win_condition": "El jugador debe recopilar todas las pistas en las cuatro fases históricas y redactar un diagnóstico final.",
    "lose_condition": "Si tomas decisiones precipitadas o ignoras pistas, quedarás atrapado en las ruinas sin respuestas."
  },
  "chapters": [
    {
      "id": 1,
      "name": "El inicio – El hallazgo",
      "description": "Dos investigadores entran en las ruinas polvorientas del Museo. El aire es espeso. Encuentran fragmentos de huesos y un extraño símbolo tallado en la piedra.",
      "choices": [
        {
          "action": "EXAMINAR símbolo",
          "result": "Descubres que es un registro de las primeras mediciones de temperatura. Premio: 1 pista clave."
        },
        {
          "action": "IGNORAR símbolo",
          "result": "Un techo se derrumba ligeramente. Pierdes tiempo y energía. Castigo: -1 turno."
        }
      ]
    },
    {
      "id": 2,
      "name": "Sombras de la guerra",
      "description": "Encuentras un búnker oculto con restos de la Segunda Guerra Mundial. Dentro, hay mapas, armas oxidadas y un diario con gráficos de emisiones.",
      "choices": [
        {
          "action": "LEER diario",
          "result": "Comprendes cómo la guerra alteró los patrones climáticos. Premio: acceso a nueva sala secreta."
        },
        {
          "action": "TOCAR armas oxidadas",
          "result": "Se activa una trampa antigua. Una puerta se cierra y quedas atrapado momentáneamente. Castigo: debes resolver un acertijo para salir."
        }
      ]
    },
    {
      "id": 3,
      "name": "La era del ascenso",
      "description": "En una cámara sellada encuentras gráficas talladas en piedra que muestran el ascenso de las temperaturas desde los años 60. Hay un pedestal con una balanza rota.",
      "choices": [
        {
          "action": "COLOCAR hueso en la balanza",
          "result": "La sala se ilumina y revela datos clave. Premio: desbloqueas pista final."
        },
        {
          "action": "ROMPER la balanza",
          "result": "El suelo tiembla, la sala empieza a hundirse. Castigo: pierdes un objeto del inventario."
        }
      ]
    },
    {
      "id": 4,
      "name": "La vértebra vacía",
      "description": "Llegas al final del esqueleto: la última vértebra está hueca. Representa el presente (2024) y el vacío de decisiones humanas.",
      "choices": [
        {
          "action": "INSERTAR todas las pistas en la vértebra",
          "result": "El esqueleto cobra vida simbólicamente y muestra el diagnóstico final. Premio: Victoria."
        },
        {
          "action": "SALIR sin completar",
          "result": "El jugador abandona las ruinas con dudas. Castigo: derrota."
        }
      ]
    }
  ],
  "rewards": [
    "Pistas clave para avanzar",
    "Acceso a salas secretas",
    "Objetos de inventario (linterna, huesos, mapas antiguos)",
    "Fragmentos de un mural que se completa al final"
  ],
  "punishments": [
    "Pérdida de turnos",
    "Atrapar al jugador en trampas",
    "Perder objetos del inventario",
    "Finales alternativos incompletos"
  ],
  "finale": {
    "good_ending": "El jugador reconstruye la historia climática y redacta un diagnóstico: 'Hubiéramos cambiado el destino si hubiéramos confiado en los datos'.",
    "bad_ending": "El jugador queda atrapado o sale con información incompleta, condenado a repetir los errores del pasado."
  }
};


interface GameLogEntry {
    type: 'narrator' | 'player' | 'system';
    text: string;
}

interface TangibleClimateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const TangibleClimateQuestModal: React.FC<TangibleClimateQuestModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];
  const [gameLog, setGameLog] = useState<GameLogEntry[]>([]);
  const [score, setScore] = useState(0);
  const [inventory, setInventory] = useState<string[]>([]);
  const [chapter, setChapter] = useState(1);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset game state
      setGameLog([{ type: 'narrator', text: t.questWelcome }]);
      setScore(0);
      setInventory([]);
      setChapter(1);
      setInput('');
      setError(null);
      setIsLoading(false);
      setIsGameOver(false);
    }
  }, [isOpen, t.questWelcome]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gameLog]);


  const handleSendCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim();
    if (!command || isLoading || isGameOver) return;
    
    setError(null);
    setInput('');
    setGameLog(prev => [...prev, { type: 'player', text: `> ${command}` }]);
    setIsLoading(true);

    try {
        const response = await fetch('/api/quest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                playerInput: command,
                gameState: { chapter, score, inventory },
                gameRules: gameData, // Send the whole ruleset
            }),
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'Server error');
        }

        const result = await response.json();
        
        const newLogEntries: GameLogEntry[] = [{ type: 'narrator', text: result.narrative }];
        if (result.newInventoryItem) {
            setInventory(prev => [...prev, result.newInventoryItem]);
            newLogEntries.push({ type: 'system', text: `[Item obtained: ${result.newInventoryItem}]` });
        }
        if (result.updatedScore > score) {
            newLogEntries.push({ type: 'system', text: `[Score +${result.updatedScore - score}]` });
        } else if (result.updatedScore < score) {
             newLogEntries.push({ type: 'system', text: `[Score ${result.updatedScore - score}]` });
        }
        
        setGameLog(prev => [...prev, ...newLogEntries]);
        setScore(result.updatedScore);
        
        if (result.updatedChapter) {
            setChapter(result.updatedChapter);
        }

        if (result.isGameOver) {
            setIsGameOver(true);
            setGameLog(prev => [...prev, { type: 'system', text: `[GAME OVER] ${result.ending}` }]);
        }
        
    } catch(err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(message);
        setGameLog(prev => [...prev, { type: 'system', text: `[ERROR: ${message}]` }]);
    } finally {
        setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col font-mono">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600 flex-shrink-0">
          <h2 className="text-2xl text-cyan-400 flex items-center gap-3">
            <IdentificationIcon />
            {t.questTitle}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
        </div>

        {/* Main Content */}
        <div className="flex-grow flex min-h-0">
            {/* Game Log (Left) */}
            <div className="w-2/3 p-4 flex flex-col border-r border-gray-600">
                <div className="flex-grow overflow-y-auto pr-2 text-lg leading-relaxed text-gray-300 space-y-4">
                    {gameLog.map((entry, index) => {
                        let style = 'whitespace-pre-wrap';
                        if (entry.type === 'player') style += ' text-cyan-400';
                        if (entry.type === 'system') style += ' text-amber-400 italic text-base';
                        return <p key={index} className={style}>{entry.text}</p>;
                    })}
                     <div ref={logEndRef} />
                </div>
                <form onSubmit={handleSendCommand} className="flex gap-2 pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.questPlaceholder}
                        disabled={isLoading || isGameOver}
                        className="w-full bg-gray-900 border border-gray-500 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || isGameOver || !input.trim()}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '...' : t.questSend}
                    </button>
                </form>
            </div>

            {/* Status (Right) */}
            <div className="w-1/3 p-6 space-y-8">
                <div>
                    <h3 className="text-xl text-gray-400 border-b border-gray-600 pb-2 mb-4">{t.questScore}</h3>
                    <p className="text-5xl text-white text-center font-bold">{score}</p>
                </div>
                 <div>
                    <h3 className="text-xl text-gray-400 border-b border-gray-600 pb-2 mb-4">{t.questInventory}</h3>
                    {inventory.length > 0 ? (
                        <ul className="space-y-2">
                           {inventory.map(item => <li key={item} className="text-white text-lg">- {item}</li>)}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">Empty</p>
                    )}
                </div>
                 {error && (
                    <div>
                        <h3 className="text-xl text-red-500 border-b border-red-700 pb-2 mb-4">SYSTEM ERROR</h3>
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TangibleClimateQuestModal;
