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
        let completeTranscript = "";
        
        // Build complete transcript from all results
        for (let i = 0; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          completeTranscript += transcriptPart;
        }
        
        // Filter out common AI speech patterns that might be captured
        const filteredTranscript = completeTranscript.trim();
        
        // Skip if transcript contains repeated patterns that indicate AI voice capture
        if (filteredTranscript.includes('hello hello') || 
            filteredTranscript.includes('please please') ||
            filteredTranscript.includes('stop stop') ||
            filteredTranscript.match(/(\b\w+\b)\s+\1/g)) {
          console.log("Filtered out AI voice capture:", filteredTranscript);
          return;
        }
        
        console.log("Speech recognition result:", filteredTranscript);
        // Update transcript in real-time (both interim and final)
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
