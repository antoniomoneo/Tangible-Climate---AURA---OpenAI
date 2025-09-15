import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Language } from '../types';
import { locales } from '../locales';
import { temperatureData } from '../data/temperatureData';
import { SwirlIcon, PlayIcon, PauseIcon, RecordIcon, StopIcon, SlidersIcon } from './icons';

interface CrazyVizModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

// Helper to map a value from one range to another
const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

// Particle class
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  history: { x: number; y: number }[];
  maxHistory: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = 0;
    this.vy = 0;
    this.history = [];
    this.maxHistory = 5;
  }

  update(flowField: number[][][], flowStrength: number, width: number, height: number) {
    const gridX = Math.floor(this.x / 10);
    const gridY = Math.floor(this.y / 10);
    
    if (flowField[gridX] && flowField[gridX][gridY]) {
        const [angle, magnitude] = flowField[gridX][gridY];
        this.vx += Math.cos(angle) * magnitude * flowStrength * 0.1;
        this.vy += Math.sin(angle) * magnitude * flowStrength * 0.1;
    }

    this.vx *= 0.95; // friction
    this.vy *= 0.95;

    this.x += this.vx;
    this.y += this.vy;

    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    
    // Edge wrapping
    if (this.x > width) { this.x = 0; this.history = []; }
    if (this.x < 0) { this.x = width; this.history = []; }
    if (this.y > height) { this.y = 0; this.history = []; }
    if (this.y < 0) { this.y = height; this.history = []; }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.beginPath();
    ctx.moveTo(this.history[0]?.x || this.x, this.history[0]?.y || this.y);
    for (let i = 1; i < this.history.length; i++) {
        ctx.lineTo(this.history[i].x, this.history[i].y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

const CrazyVizModal: React.FC<CrazyVizModalProps> = ({ isOpen, onClose, language }) => {
  const t = locales[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const [isRecording, setIsRecording] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [downloadingMessage, setDownloadingMessage] = useState('');

  // Modulator states
  const [speed, setSpeed] = useState(0.5); // 0-1 range
  const [particleCount, setParticleCount] = useState(500);
  const [trailLength, setTrailLength] = useState(0.9); // 0-1 range, inverted (0.9 = long trail)
  const [complexity, setComplexity] = useState(0.5); // 0-1 range
  const [flowStrength, setFlowStrength] = useState(0.5); // 0-1 range
  
  const yearIndexRef = useRef(0);
  const frameCountRef = useRef(0);
  const [currentYear, setCurrentYear] = useState(temperatureData[0].year);

  // Refs for Web Audio and MediaRecorder
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const mediaStreamDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  
  const particlesRef = useRef<Particle[]>([]);
  const flowFieldRef = useRef<number[][][]>([]);

  const setupAudio = useCallback(() => {
    if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0, audioContext.currentTime);

        oscillator.connect(gain);
        
        gain.connect(audioContext.destination);

        // FIX: oscillator.start() requires an argument in some browser versions. Passing 0 starts the oscillator immediately and ensures compatibility.
        oscillator.start(0);
        oscillatorRef.current = oscillator;
        gainRef.current = gain;
    }
  }, []);

  const togglePlay = () => {
    if (!isPlaying) {
      setupAudio();
      const gain = gainRef.current;
      if (gain) {
        gain.gain.exponentialRampToValueAtTime(0.1, audioContextRef.current!.currentTime + 0.5);
      }
    } else {
      const gain = gainRef.current;
      if (gain) {
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current!.currentTime + 0.5);
      }
    }
    setIsPlaying(!isPlaying);
  };
  
  const handleStop = useCallback(() => {
    setIsPlaying(false);
    yearIndexRef.current = 0;
    setCurrentYear(temperatureData[0].year);
    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) { // Stop recording
      mediaRecorderRef.current?.stop();
      if (gainRef.current && mediaStreamDestinationRef.current) {
        gainRef.current.disconnect(mediaStreamDestinationRef.current);
        mediaStreamDestinationRef.current = null;
      }
      setIsRecording(false);
      setDownloadingMessage(t.crazyVizDownloading);
    } else { // Start recording
      if (!canvasRef.current) return;

      const canvasStream = canvasRef.current.captureStream(30); // 30 FPS

      // Ensure audio is running and get its stream
      setupAudio();
      const audioDest = audioContextRef.current!.createMediaStreamDestination();
      mediaStreamDestinationRef.current = audioDest; // Save ref to disconnect later
      
      if (gainRef.current) gainRef.current.connect(audioDest);
      const audioStream = audioDest.stream;

      // Combine video and audio tracks
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);

      const mimeTypesToTry = [
        'video/webm; codecs=vp9,opus',
        'video/webm; codecs=vp8,vorbis',
        'video/webm',
        'video/mp4',
      ];

      let supportedMimeType: string | null = null;
      for (const mimeType of mimeTypesToTry) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          supportedMimeType = mimeType;
          break;
        }
      }

      if (!supportedMimeType) {
        console.error("No supported MIME type found for MediaRecorder.");
        alert("Sorry, your browser doesn't support video recording in a compatible format.");
        return;
      }
      
      const fileExtension = supportedMimeType.startsWith('video/mp4') ? 'mp4' : 'webm';

      const recorder = new MediaRecorder(combinedStream, { mimeType: supportedMimeType });
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: supportedMimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crazy-viz-climate-art-${new Date().toISOString()}.${fileExtension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setDownloadingMessage('');
      };

      recorder.start();
      setIsRecording(true);
      if (!isPlaying) togglePlay(); // Auto-play on record
    }
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
        const { width, height } = canvas.parentElement!.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        particlesRef.current = Array.from({ length: particleCount }, () => new Particle(width, height));
        const cols = Math.floor(width / 10);
        const rows = Math.floor(height / 10);
        flowFieldRef.current = new Array(cols).fill(0).map(() => new Array(rows).fill([0, 0]));
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!isPlayingRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(animate);
        return;
      }

      frameCountRef.current++;

      const speedThreshold = Math.floor(mapRange(speed, 0, 1, 30, 1));
      if (frameCountRef.current % speedThreshold === 0) {
        yearIndexRef.current = (yearIndexRef.current + 1) % temperatureData.length;
        setCurrentYear(temperatureData[yearIndexRef.current].year);
      }
      
      const { anomaly } = temperatureData[yearIndexRef.current];
      
      if (oscillatorRef.current && gainRef.current && audioContextRef.current) {
        const freq = mapRange(anomaly, -0.5, 1.5, 150, 600);
        oscillatorRef.current.frequency.linearRampToValueAtTime(freq, audioContextRef.current.currentTime + 0.1);
        const vol = mapRange(Math.abs(anomaly), 0, 1.5, 0.05, 0.2);
        gainRef.current.gain.linearRampToValueAtTime(vol, audioContextRef.current.currentTime + 0.1);
      }

      const time = frameCountRef.current * 0.002;
      const noiseScale = mapRange(complexity, 0, 1, 0.01, 0.1);
      for (let x = 0; x < flowFieldRef.current.length; x++) {
          for(let y = 0; y < flowFieldRef.current[0].length; y++) {
              const angle = Math.sin(x * noiseScale + time) * Math.cos(y * noiseScale + anomaly) * Math.PI * 2;
              const magnitude = (Math.sin(time + anomaly) + 1) / 2;
              flowFieldRef.current[x][y] = [angle, magnitude];
          }
      }

      ctx.fillStyle = `rgba(17, 24, 39, ${1 - trailLength})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const particleColor = `hsl(${mapRange(anomaly, -0.5, 1.5, 200, 0)}, 100%, 60%)`;

      particlesRef.current.forEach(p => {
        p.update(flowFieldRef.current, flowStrength, canvas.width, canvas.height);
        p.draw(ctx, particleColor);
      });

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
      handleStop();
    };
  }, [isOpen, speed, particleCount, trailLength, complexity, flowStrength, handleStop]);
  
   useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas;
    const currentCount = particlesRef.current.length;
    if (particleCount > currentCount) {
        const toAdd = Array.from({ length: particleCount - currentCount }, () => new Particle(width, height));
        particlesRef.current.push(...toAdd);
    } else if (particleCount < currentCount) {
        particlesRef.current.splice(particleCount);
    }
  }, [particleCount]);

  if (!isOpen) return null;

  const ControlButton: React.FC<{onClick: () => void, title: string, children: React.ReactNode, active?: boolean, disabled?: boolean}> = ({onClick, title, children, active=false, disabled=false}) => (
    <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-400 ${active ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
        {children}
    </button>
  );

  const Slider: React.FC<{label: string, value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, min?: number, max?: number, step?: number}> = ({label, value, onChange, min = 0, max = 1, step = 0.01}) => (
    <div>
        <label className="block text-sm font-medium text-gray-400">{label}</label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
        />
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-0 animate-fadeIn">
      <div className="bg-gray-900 w-full h-full flex flex-col relative">
        <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
        
        {/* UI Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col">
            <header className="p-4 flex justify-between items-center text-white pointer-events-auto">
                 <h2 className="font-title text-2xl text-cyan-400 flex items-center gap-2">
                    <SwirlIcon />
                    {t.crazyVizTitle}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl leading-none">&times;</button>
            </header>

            <main className="flex-grow relative">
                {/* Year Display */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900/50 px-6 py-2 rounded-lg border border-gray-700">
                    <p className="font-title text-5xl text-white tracking-widest">{currentYear}</p>
                </div>

                {/* Controls Panel */}
                <div className={`absolute top-0 left-0 h-full p-4 pointer-events-auto transition-transform duration-300 ${isControlsVisible ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="bg-gray-800/80 backdrop-blur-md p-6 rounded-lg border border-gray-700 space-y-4 w-64 h-full overflow-y-auto">
                        <h3 className="text-lg font-bold text-cyan-400">{t.crazyVizControlsTitle}</h3>
                        <Slider label={t.crazyVizControlsSpeed} value={speed} onChange={e => setSpeed(Number(e.target.value))} />
                        <Slider label={t.crazyVizControlsParticles} value={particleCount} onChange={e => setParticleCount(Number(e.target.value))} min={100} max={2000} step={100} />
                        <Slider label={t.crazyVizControlsTrail} value={trailLength} onChange={e => setTrailLength(Number(e.target.value))} />
                        <Slider label={t.crazyVizControlsComplexity} value={complexity} onChange={e => setComplexity(Number(e.target.value))} />
                        <Slider label={t.crazyVizControlsFlow} value={flowStrength} onChange={e => setFlowStrength(Number(e.target.value))} />
                    </div>
                </div>
            </main>
            
            <p className="absolute bottom-5 right-5 text-xs text-gray-500 font-mono pointer-events-auto opacity-75">
                Created with Tangible Data Technology
            </p>
            
            <footer className="p-4 flex justify-between items-center text-white pointer-events-auto">
                <ControlButton onClick={() => setIsControlsVisible(!isControlsVisible)} title={t.crazyVizControlsTitle}>
                    <SlidersIcon className="h-6 w-6"/>
                </ControlButton>

                <div className="flex items-center gap-4">
                    <ControlButton onClick={togglePlay} title={isPlaying ? t.crazyVizPause : t.crazyVizPlay}>
                        {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
                    </ControlButton>
                    <ControlButton onClick={toggleRecording} title={isRecording ? t.crazyVizStopRecording : t.crazyVizRecord} active={isRecording} disabled={!!downloadingMessage}>
                       {isRecording ? <StopIcon className="w-6 h-6 animate-pulse"/> : <RecordIcon className="w-6 h-6 text-red-500"/>}
                    </ControlButton>
                </div>
                
                <div className="w-24 text-right">
                  {downloadingMessage && <p className="text-sm text-cyan-300 animate-pulse">{downloadingMessage}</p>}
                </div>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default CrazyVizModal;