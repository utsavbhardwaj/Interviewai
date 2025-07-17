import { useState, useCallback, useRef } from "react";

interface TextToSpeechHook {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
}

export function useTextToSpeech(): TextToSpeechHook {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isSupported = typeof window !== "undefined" && 'speechSynthesis' in window;

  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    synthRef.current = window.speechSynthesis;
    utteranceRef.current = new SpeechSynthesisUtterance(text);

    // Configure voice settings
    utteranceRef.current.rate = 0.9;
    utteranceRef.current.pitch = 1.1;
    utteranceRef.current.volume = 0.8;

    // Try to use a professional-sounding voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    ) || voices.find(voice => voice.lang.startsWith('en'));

    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }

    utteranceRef.current.onstart = () => {
      console.log("AI started speaking");
      setIsSpeaking(true);
    };

    utteranceRef.current.onend = () => {
      console.log("AI finished speaking");
      setIsSpeaking(false);
    };

    utteranceRef.current.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utteranceRef.current);
  }, [isSupported]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported
  };
}