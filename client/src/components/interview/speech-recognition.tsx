import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface SpeechRecognitionProps {
  onTranscript: (text: string) => void;
  isListening: boolean;
  isAISpeaking?: boolean;
  onClearTranscript?: () => void;
}

export default function SpeechRecognition({
  onTranscript,
  isListening,
  isAISpeaking = false,
  onClearTranscript
}: SpeechRecognitionProps) {
  const {
    transcript,
    isSupported,
    startListening,
    stopListening,
    clearTranscript
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  useEffect(() => {
    if (isListening) {
      startListening();
    } else {
      stopListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 text-sm">
          Speech recognition is not supported in your browser. Please type your responses manually.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isAISpeaking ? 'bg-blue-500 animate-pulse' : 
            isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'
          }`} />
          <span className="text-sm text-gray-600">
            {isAISpeaking ? "AI Speaking..." : 
             isListening ? "Listening..." : "Speech recognition ready"}
          </span>
        </div>
        
        {onClearTranscript && transcript && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearTranscript();
              onClearTranscript();
            }}
            className="text-xs"
          >
            Clear
          </Button>
        )}
      </div>
      
      {isListening && transcript && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-blue-800 text-sm">
            <strong>Recognized:</strong> {transcript}
          </p>
        </div>
      )}
      
      {isAISpeaking && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-orange-600" />
            <p className="text-orange-800 text-sm">
              AI interviewer is speaking...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
