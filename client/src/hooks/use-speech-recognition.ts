import { useState, useCallback, useRef } from "react";

interface SpeechRecognitionHook {
  transcript: string;
  isSupported: boolean;
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  clearTranscript: () => void;
}

export function useSpeechRecognition(): SpeechRecognitionHook {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isSupported = typeof window !== "undefined" && 
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true; // Allow interim results for responsiveness
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        // Update with both interim and final results for real-time feedback
        if (finalTranscript) {
          setTranscript(prev => {
            const newText = prev ? prev + " " + finalTranscript : finalTranscript;
            return newText.trim();
          });
        } else if (interimTranscript) {
          setTranscript(prev => {
            // For interim results, append temporarily
            const baseText = prev || "";
            return (baseText + " " + interimTranscript).trim();
          });
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.start();
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setIsListening(false);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  return {
    transcript,
    isSupported,
    isListening,
    startListening,
    stopListening,
    clearTranscript
  };
}
