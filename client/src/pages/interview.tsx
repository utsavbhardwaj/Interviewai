import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import VideoInterface from "@/components/interview/video-interface";
import SpeechRecognition from "@/components/interview/speech-recognition";
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
  MessageCircle
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
  const interviewId = parseInt(params?.id || "0");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: interview, isLoading } = useQuery({
    queryKey: ["/api/interviews", interviewId],
    enabled: !!interviewId,
  });

  const startInterviewMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/interviews/${interviewId}/start`);
    },
    onSuccess: () => {
      setInterviewStarted(true);
      setStartTime(new Date());
      queryClient.invalidateQueries({ queryKey: ["/api/interviews", interviewId] });
    },
  });

  const submitResponseMutation = useMutation({
    mutationFn: async (data: { question: string; answer: string }) => {
      const response = await apiRequest("POST", `/api/interviews/${interviewId}/response`, data);
      return response.json();
    },
    onSuccess: (data) => {
      setAiResponse(data.aiResponse);
      setCurrentAnswer("");
      queryClient.invalidateQueries({ queryKey: ["/api/interviews", interviewId] });
    },
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

  const handleNextQuestion = () => {
    if (!interview?.questions || currentQuestionIndex >= interview.questions.length - 1) {
      // Interview completed
      const duration = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000 / 60) : 0;
      completeInterviewMutation.mutate(duration);
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setAiResponse("");
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim() || !interview?.questions) return;

    const question = interview.questions[currentQuestionIndex];
    submitResponseMutation.mutate({
      question,
      answer: currentAnswer.trim(),
    });

    const newResponse: InterviewResponse = {
      question,
      answer: currentAnswer.trim(),
      timestamp: Date.now(),
    };
    setResponses(prev => [...prev, newResponse]);
  };

  const currentQuestion = interview?.questions?.[currentQuestionIndex];
  const totalQuestions = interview?.questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

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
            />
          </div>

          {/* Interview Panel */}
          <div className="space-y-6">
            {/* Current Question */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                  Current Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 font-medium mb-4">
                  {currentQuestion}
                </p>
                
                {aiResponse && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 text-sm">
                      <strong>AI Interviewer:</strong> {aiResponse}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Response Input */}
            <Card>
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SpeechRecognition
                  onTranscript={setCurrentAnswer}
                  isListening={isRecording}
                />
                
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer or use speech recognition..."
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />

                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsRecording(!isRecording)}
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={!currentAnswer.trim() || submitResponseMutation.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {submitResponseMutation.isPending ? (
                      "Submitting..."
                    ) : currentQuestionIndex >= totalQuestions - 1 ? (
                      "Complete Interview"
                    ) : (
                      "Submit & Next"
                    )}
                  </Button>
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
