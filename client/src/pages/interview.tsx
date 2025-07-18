import { useState, useEffect, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VideoInterface from "@/components/interview/video-interface";
import QuestionProgress from "@/components/interview/question-progress";
import { useTextToSpeech } from "@/hooks/use-text-to-speech";
import { useAdvancedSpeech } from "@/hooks/use-advanced-speech";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Play, 
  Pause,
  CheckCircle,
  Clock,
  MessageCircle,
  Volume2,
  VolumeX
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface InterviewResponse {
  question: string;
  answer: string;
  timestamp: number;
}

export default function Interview() {
  const [, params] = useRoute("/interview/:id");
  const [, navigate] = useLocation();
  const interviewId = parseInt(params?.id || "0");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isAIVoiceEnabled, setIsAIVoiceEnabled] = useState(true);
  const [isListeningForResponse, setIsListeningForResponse] = useState(false);
  const [responseTimeout, setResponseTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  const { transcript, isListening, startListening, stopListening, clearTranscript } = useAdvancedSpeech();

  const { data: interview, isLoading, refetch } = useQuery({
    queryKey: ["/api/interviews", interviewId],
    enabled: !!interviewId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const startInterviewMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/interviews/${interviewId}/start`);
      return response.json();
    },
    onSuccess: (updatedInterview) => {
      console.log("Interview started successfully:", updatedInterview);
      setInterviewStarted(true);
      setStartTime(new Date());
      
      // Force refetch the interview data to get questions
      queryClient.invalidateQueries({ queryKey: ["/api/interviews", interviewId] });
      
      // Manually refetch after a short delay
      setTimeout(async () => {
        console.log("Manually refetching interview data...");
        const { data: refreshedInterview } = await refetch();
        console.log("Refreshed interview data:", refreshedInterview);
        
        // Speak first question if AI voice is enabled
        if (isAIVoiceEnabled && refreshedInterview?.questions?.[0]) {
          console.log("Speaking first question:", refreshedInterview.questions[0]);
          speak(refreshedInterview.questions[0]);
        }
      }, 1000);
    },
    onError: (error) => {
      console.error("Failed to start interview:", error);
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive"
      });
    }
  });

  const submitResponseMutation = useMutation({
    mutationFn: async (data: { question: string; answer: string }) => {
      const response = await apiRequest("POST", `/api/interviews/${interviewId}/response`, data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Received AI response:", data.aiResponse);
      setAiResponse(data.aiResponse);
      setCurrentAnswer("");
      setIsProcessingResponse(false);
      
      // Speak the AI response if voice is enabled
      if (isAIVoiceEnabled && data.aiResponse) {
        console.log("Speaking AI response");
        setTimeout(() => {
          speak(data.aiResponse);
        }, 500);
      } else if (!isAIVoiceEnabled) {
        console.log("AI voice disabled, skipping speech");
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/interviews", interviewId] });
    },
    onError: (error) => {
      console.error("Failed to submit response:", error);
      setIsProcessingResponse(false);
      toast({
        title: "Error",
        description: "Failed to submit response. Please try again.",
        variant: "destructive"
      });
    }
  });

  const completeInterviewMutation = useMutation({
    mutationFn: async (duration: number) => {
      return apiRequest("POST", `/api/interviews/${interviewId}/complete`, { duration });
    },
    onSuccess: () => {
      toast({
        title: "Interview Completed",
        description: "Your feedback is being generated. Redirecting...",
      });
      setTimeout(() => {
        window.location.href = `/feedback/${interviewId}`;
      }, 2000);
    },
  });

  const handleStartInterview = () => {
    startInterviewMutation.mutate();
  };

  const handleNextQuestion = useCallback(() => {
    console.log("handleNextQuestion called, current index:", currentQuestionIndex, "total questions:", interview?.questions?.length);
    
    if (!interview?.questions || currentQuestionIndex >= interview.questions.length - 1) {
      console.log("Interview completed - redirecting to feedback");
      // Interview completed
      const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000 / 60) : 0;
      completeInterviewMutation.mutate(duration);
      return;
    }
    
    console.log("Moving to next question:", currentQuestionIndex + 1);
    setCurrentQuestionIndex(prev => prev + 1);
    setAiResponse("");
    
    // Reset transcript and answer for new question
    clearTranscript();
    setCurrentAnswer("");
  }, [currentQuestionIndex, interview?.questions, startTime, completeInterviewMutation, clearTranscript]);

  const handleEndInterview = () => {
    stopSpeaking();
    const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000 / 60) : 0;
    
    if (responses.length > 0) {
      completeInterviewMutation.mutate(duration);
    } else {
      toast({
        title: "Interview Ended",
        description: "Returning to dashboard...",
      });
      navigate("/dashboard");
    }
  };

  const toggleAIVoice = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setIsAIVoiceEnabled(!isAIVoiceEnabled);
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim() || !interview?.questions || isProcessingResponse) return;

    const question = interview.questions[currentQuestionIndex];
    const answer = currentAnswer.trim();
    
    console.log("Submitting answer:", answer, "for question:", question);
    
    // Set processing state
    setIsProcessingResponse(true);
    
    // Clear the current answer immediately
    setCurrentAnswer("");
    setIsListeningForResponse(false);
    setIsRecording(false);
    
    // Clear any pending timeout
    if (responseTimeout) {
      clearTimeout(responseTimeout);
      setResponseTimeout(null);
    }

    submitResponseMutation.mutate({
      question,
      answer,
    });

    const newResponse: InterviewResponse = {
      question,
      answer,
      timestamp: Date.now(),
    };
    setResponses(prev => [...prev, newResponse]);
  };

  const currentQuestion = interview?.questions?.[currentQuestionIndex];
  const totalQuestions = interview?.questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  
  console.log("Current interview state:", {
    currentQuestionIndex,
    totalQuestions,
    currentQuestion,
    hasQuestions: !!interview?.questions,
    questionsLength: interview?.questions?.length
  });

  // Auto-speak current question when interview starts or question changes
  const [lastSpokenQuestionIndex, setLastSpokenQuestionIndex] = useState<number | null>(null);

  useEffect(() => {
    if (
      interviewStarted &&
      currentQuestion &&
      isAIVoiceEnabled &&
      !isSpeaking &&
      currentQuestionIndex !== lastSpokenQuestionIndex // Only speak if not already spoken
    ) {
      stopSpeaking();
      if (isListening) stopListening();
      setIsListeningForResponse(false);
      setIsRecording(false);

      setTimeout(() => {
        speak(currentQuestion);
        setLastSpokenQuestionIndex(currentQuestionIndex); // Mark as spoken
      }, 2000);
    }
  }, [
    interviewStarted,
    currentQuestionIndex,
    currentQuestion,
    isAIVoiceEnabled,
    isSpeaking,
    speak,
    stopSpeaking,
    isListening,
    stopListening,
    lastSpokenQuestionIndex,
  ]);

  // Start listening when AI finishes speaking
  useEffect(() => {
    if (interviewStarted && !isSpeaking && currentQuestion && !isListeningForResponse) {
      // AI has finished speaking, start listening for response
      const timer = setTimeout(() => {
        console.log("AI finished speaking, starting to listen for response...");
        
        // Clear any existing transcript first
        clearTranscript();
        
        // Start speech recognition only after AI has completely finished
        startListening();
        setIsListeningForResponse(true);
        setIsRecording(true);
      }, 6000); // Wait 6 seconds after AI stops speaking for clean audio separation

      return () => clearTimeout(timer);
    }
  }, [isSpeaking, interviewStarted, currentQuestion, isListeningForResponse, clearTranscript, startListening]);

  // Auto-submit answer after 4 seconds of silence when user stops speaking
  useEffect(() => {
    if (currentAnswer.trim() && isListeningForResponse && !isSpeaking) {
      // Clear existing timeout
      if (responseTimeout) {
        clearTimeout(responseTimeout);
      }
      
      // Set new timeout to submit answer after 4 seconds of silence - only if AI is not speaking
      const timeout = setTimeout(() => {
        if (currentAnswer.trim() && !isSpeaking) {
          console.log("Auto-submitting answer after silence:", currentAnswer);
          stopListening(); // Stop listening before submitting
          handleSubmitAnswer();
          setIsListeningForResponse(false);
          setIsRecording(false);
        }
      }, 4000); // Increased to 4 seconds for better UX
      
      setResponseTimeout(timeout);
    }
    
    return () => {
      if (responseTimeout) {
        clearTimeout(responseTimeout);
      }
    };
  }, [currentAnswer, isListeningForResponse, isSpeaking]);

  // Handle transcript from speech recognition hook
  useEffect(() => {
    if (transcript.trim() && isListeningForResponse && !isSpeaking && transcript.length > 3) {
      console.log("Updating current answer from transcript hook:", transcript);
      setCurrentAnswer(transcript);
    } else if (transcript.trim() && isSpeaking) {
      console.log("Ignoring transcript while AI is speaking:", transcript);
    }
  }, [transcript, isListeningForResponse, isSpeaking]);

  // Progress to next question after AI response
  useEffect(() => {
    if (aiResponse && !isSpeaking && !isProcessingResponse) {
      console.log("AI response received, moving to next question in 3 seconds:", aiResponse);
      const timer = setTimeout(() => {
        console.log("Moving to next question now");
        handleNextQuestion();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [aiResponse, isSpeaking, isProcessingResponse, handleNextQuestion]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Interview not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Ready to Start Your Interview?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">{interview.jobTitle}</h3>
              {interview.company && (
                <p className="text-gray-600">{interview.company}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold mb-3">Interview Details:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {totalQuestions} AI-generated questions based on your resume and job description</li>
                <li>• Estimated duration: {Math.round(totalQuestions * 3)} - {Math.round(totalQuestions * 5)} minutes</li>
                <li>• Video and audio will be recorded for feedback analysis</li>
                <li>• You can pause between questions if needed</li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleStartInterview}
                disabled={startInterviewMutation.isPending}
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                {startInterviewMutation.isPending ? (
                  "Starting Interview..."
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start Interview
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{interview.jobTitle}</h1>
              {interview.company && (
                <p className="text-gray-600">{interview.company}</p>
              )}
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Interview
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {startTime && (
                <span>{Math.round((Date.now() - startTime.getTime()) / 1000 / 60)} min</span>
              )}
            </div>
          </div>
          
          <Progress value={progress} className="mt-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Interface */}
          <div className="lg:col-span-2">
            <VideoInterface
              isRecording={isRecording}
              isVideoEnabled={isVideoEnabled}
              isAudioEnabled={isAudioEnabled}
              onToggleVideo={() => setIsVideoEnabled(!isVideoEnabled)}
              onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
              onEndCall={handleEndInterview}
              isAIVoiceEnabled={isAIVoiceEnabled}
              onToggleAIVoice={toggleAIVoice}
              isSpeaking={isSpeaking}
            />
          </div>

          {/* Interview Panel */}
          <div className="space-y-6">
            {/* Current Question */}
            <Card className="border-l-4 border-l-teal-500">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-blue-50">
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-teal-600" />
                  Interview Question {currentQuestionIndex + 1} of {totalQuestions}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-gray-900 font-medium leading-relaxed">
                    {currentQuestion}
                  </p>
                </div>
                
                {aiResponse && (
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-teal-800 font-medium text-sm mb-1">AI Interviewer:</p>
                        <p className="text-teal-700 text-sm">{aiResponse}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Input */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                <CardTitle className="flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-blue-600" />
                  Your Response
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="speech-status-display bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isListeningForResponse ? (
                        <>
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-red-700">Recording your response...</span>
                        </>
                      ) : isSpeaking ? (
                        <>
                          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-blue-700">AI is speaking...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-700">Ready</span>
                        </>
                      )}
                    </div>
                    {transcript && (
                      <button
                        onClick={() => {
                          clearTranscript();
                          setCurrentAnswer("");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {transcript && (
                    <div className="mt-2 p-2 bg-white border border-gray-200 rounded text-sm">
                      <strong>Live Transcript:</strong> {transcript}
                    </div>
                  )}
                </div>
                
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer or use speech recognition..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />

                <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {isListeningForResponse ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-teal-800 font-medium text-sm">Listening...</span>
                      </div>
                    ) : isSpeaking ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-blue-800 font-medium text-sm">AI Speaking...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-800 font-medium text-sm">Ready</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">
                    {isListeningForResponse 
                      ? "Speak naturally and I'll automatically process your answer after you finish."
                      : isSpeaking
                      ? "Please wait for the question to finish before responding."
                      : "Ready for the next question or your response."}
                  </p>
                  {currentAnswer && (
                    <div className="mt-3 p-2 bg-white border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">Current Response:</p>
                      <p className="text-sm text-gray-800">{currentAnswer}</p>
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={submitResponseMutation.isPending}
                        size="sm"
                        className="mt-2 bg-teal-600 hover:bg-teal-700"
                      >
                        Submit Response Now
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Questions Answered</span>
                    <span>{responses.length} / {totalQuestions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completion</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  {startTime && (
                    <div className="flex justify-between text-sm">
                      <span>Time Elapsed</span>
                      <span>{Math.round((Date.now() - startTime.getTime()) / 1000 / 60)} min</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
