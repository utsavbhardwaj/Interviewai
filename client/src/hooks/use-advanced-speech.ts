import { useState, useCallback, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface AdvancedSpeechHook {
  transcript: string;
  isSupported: boolean;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
  confidence: number;
}

export function useAdvancedSpeech(): AdvancedSpeechHook {
  const [confidence, setConfidence] = useState(0);
  
  const commands = [
    {
      command: 'clear',
      callback: () => resetTranscript()
    },
    {
      command: 'stop listening',
      callback: () => SpeechRecognition.stopListening()
    }
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition({ commands });

  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition");
      return;
    }

    console.log("Starting advanced speech recognition...");
    
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
      interimResults: true
    });
  }, [browserSupportsSpeechRecognition]);

  const stopListening = useCallback(() => {
    console.log("Stopping advanced speech recognition...");
    SpeechRecognition.stopListening();
  }, []);

  const clearTranscript = useCallback(() => {
    resetTranscript();
  }, [resetTranscript]);

  // Filter out AI voice patterns
  const filteredTranscript = transcript ? transcript.replace(/\b(\w+)\s+\1\b/g, '$1').trim() : '';

  return {
    transcript: filteredTranscript,
    isSupported: browserSupportsSpeechRecognition,
    isListening: listening,
    startListening,
    stopListening,
    clearTranscript,
    confidence
  };
}