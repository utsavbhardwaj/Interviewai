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
    if (!isSupported) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      console.log("Starting speech recognition...");
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true; // Allow interim results for responsiveness
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";
        
        // Build complete transcript from all results
        for (let i = 0; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript;
        const filteredTranscript = currentTranscript.trim();
        
        // Enhanced filtering to prevent AI voice capture
        const aiPatterns = [
          /hello.*hello/i,
          /please.*please/i,
          /question.*question/i,
          /interview.*interview/i,
          /(\b\w+\b)\s+\1/g, // repeated words
          /^(um|uh|hmm|ah)$/i, // common speech synthesis artifacts
        ];
        
        const containsAIPattern = aiPatterns.some(pattern => {
          if (typeof pattern.test === 'function') {
            return pattern.test(filteredTranscript);
          }
          return filteredTranscript.match(pattern) !== null;
        });
        
        if (containsAIPattern || filteredTranscript.length < 2) {
          console.log("Filtered out potential AI voice capture:", filteredTranscript);
          return;
        }
        
        console.log("Speech recognition result:", filteredTranscript);
        setTranscript(filteredTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
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
