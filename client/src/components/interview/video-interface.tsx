import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone,
  Bot
} from "lucide-react";

interface VideoInterfaceProps {
  isRecording: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  onToggleVideo: () => void;
  onToggleAudio: () => void;
}

export default function VideoInterface({
  isRecording,
  isVideoEnabled,
  isAudioEnabled,
  onToggleVideo,
  onToggleAudio
}: VideoInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isVideoEnabled) {
      startVideo();
    } else {
      stopVideo();
    }

    return () => {
      stopVideo();
    };
  }, [isVideoEnabled]);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: isAudioEnabled
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="video-container aspect-video relative">
      {isVideoEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Camera is off</p>
          </div>
        </div>
      )}

      {/* Video overlay */}
      <div className="video-overlay" />

      {/* Recording indicator */}
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot" />
          <span className="text-white text-sm font-medium">Recording</span>
        </div>
      )}

      {/* AI Interviewer Avatar */}
      <div className="absolute top-4 right-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white animate-pulse" />
        </div>
      </div>

      {/* Video controls */}
      <div className="video-controls">
        <Button
          onClick={onToggleAudio}
          className={`video-control-btn ${!isAudioEnabled ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          {isAudioEnabled ? (
            <Mic className="w-5 h-5 text-white" />
          ) : (
            <MicOff className="w-5 h-5 text-white" />
          )}
        </Button>

        <Button
          onClick={onToggleVideo}
          className={`video-control-btn ${!isVideoEnabled ? 'bg-red-600 hover:bg-red-700' : ''}`}
        >
          {isVideoEnabled ? (
            <Video className="w-5 h-5 text-white" />
          ) : (
            <VideoOff className="w-5 h-5 text-white" />
          )}
        </Button>

        <Button className="video-control-btn bg-red-600 hover:bg-red-700">
          <Phone className="w-5 h-5 text-white" />
        </Button>
      </div>

      {/* Interview status */}
      <div className="absolute bottom-16 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
        AI Interview in Progress
      </div>
    </div>
  );
}
