import { useState, useEffect, useCallback, useRef } from 'react';

// Decodes a base64 string into a Uint8Array for audio processing.
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioSrc = useRef<string | null>(null);

  // Initialize and clean up the Audio element.
  useEffect(() => {
    if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onplay = () => setIsSpeaking(true);
        audioRef.current.onpause = () => setIsSpeaking(false);
        audioRef.current.onended = () => setIsSpeaking(false);
        audioRef.current.onerror = () => {
            setError("Error playing audio.");
            setIsSpeaking(false);
            setIsLoading(false);
        };
    }

    // Cleanup function to stop audio and revoke object URLs on unmount.
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = ''; // Detach source
        }
        if (currentAudioSrc.current) {
            URL.revokeObjectURL(currentAudioSrc.current);
            currentAudioSrc.current = null;
        }
    };
  }, []);

  const speak = useCallback(async (text: string, lang: 'en' | 'es') => {
    if (isLoading || isSpeaking || !audioRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || 'Failed to generate speech.');
      }

      const { audioContent } = await response.json();
      if (!audioContent) {
        throw new Error('No audio content received from server.');
      }
      
      const audioBytes = base64ToUint8Array(audioContent);
      const audioBlob = new Blob([audioBytes], { type: 'audio/mpeg' });
      
      // Revoke the old object URL to prevent memory leaks.
      if (currentAudioSrc.current) {
          URL.revokeObjectURL(currentAudioSrc.current);
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudioSrc.current = audioUrl;

      audioRef.current.src = audioUrl;
      audioRef.current.play();

    } catch (err: any) {
      console.error('Text-to-speech error:', err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isSpeaking]);

  const cancel = useCallback(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    // The onpause handler will set isSpeaking to false.
  }, []);

  return { isSpeaking, isLoading, error, speak, cancel };
};

export default useTextToSpeech;