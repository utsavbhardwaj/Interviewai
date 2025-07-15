import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PerformanceChart from "@/components/feedback/performance-chart";
import { 
  Download, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  ThumbsUp,
  ArrowRight,
  BarChart3,
  MessageCircle,
  Target
} from "lucide-react";

export default function Feedback() {
  const [, params] = useRoute("/feedback/:id");
  const interviewId = parseInt(params?.id || "0");

  const { data: interview, isLoading } = useQuery({
    queryKey: ["/api/interviews", interviewId],
    enabled: !!interviewId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!interview || !interview.feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Feedback not available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { feedback } = interview;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Interview Feedback Report</h1>
            <p className="text-primary-100">{interview.jobTitle}</p>
            {interview.company && (
              <p className="text-primary-100">{interview.company}</p>
            )}
            <div className="flex items-center mt-4 space-x-6 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(interview.completedAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                {interview.questions?.length || 0} Questions
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                {interview.duration} minutes
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <div className={`text-4xl font-bold ${getScoreColor(feedback.overallScore)} mb-2`}>
                      {feedback.overallScore}/100
                    </div>
                    <p className="text-lg font-semibold text-gray-900">Overall Performance</p>
                    <p className="text-gray-600">{getScoreLevel(feedback.overallScore)}</p>
                  </div>

                  {/* Category Scores */}
                  <div className="space-y-4">
                    {[
                      { label: "Technical Knowledge", score: feedback.technicalKnowledge, description: "Understanding of role-specific concepts" },
                      { label: "Communication Skills", score: feedback.communication, description: "Clarity and articulation of responses" },
                      { label: "Problem Solving", score: feedback.problemSolving, description: "Analytical approach to challenges" },
                      { label: "Cultural Fit", score: feedback.culturalFit, description: "Alignment with company values" }
                    ].map((category, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">{category.label}</span>
                          <span className={`text-sm font-bold ${getScoreColor(category.score)}`}>
                            {category.score}/100
                          </span>
                        </div>
                        <Progress value={category.score} className="h-3 mb-1" />
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Question Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Question-by-Question Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedback.questionAnalysis?.map((analysis, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-medium text-gray-900 flex-1">
                          Q{index + 1}: {analysis.question}
                        </h5>
                        <Badge className={`ml-4 ${
                          analysis.score >= 80 ? 'bg-green-100 text-green-800' :
                          analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {analysis.score >= 80 ? 'Excellent' :
                           analysis.score >= 60 ? 'Good' : 'Needs Work'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Your Answer:</strong> {analysis.answer.substring(0, 150)}
                        {analysis.answer.length > 150 && "..."}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>Feedback:</strong> {analysis.feedback}
                      </p>
                      <div className="mt-2">
                        <Progress value={analysis.score} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Insights */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Strengths */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <h5 className="font-semibold text-green-800 mb-2">Key Strengths</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        {feedback.strengths?.map((strength, index) => (
                          <li key={index}>• {strength}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Areas for Improvement */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <h5 className="font-semibold text-yellow-800 mb-2">Areas for Improvement</h5>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {feedback.improvements?.map((improvement, index) => (
                          <li key={index}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <Lightbulb className="text-blue-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <div>
                      <h5 className="font-semibold text-blue-800 mb-2">Recommendations</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        {feedback.recommendations?.map((recommendation, index) => (
                          <li key={index}>• {recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Follow-up Practice
                </Button>
                <Button variant="outline" className="w-full">
                  Share with Mentor
                </Button>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart
                  scores={{
                    technical: feedback.technicalKnowledge,
                    communication: feedback.communication,
                    problemSolving: feedback.problemSolving,
                    culturalFit: feedback.culturalFit
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready for Your Next Challenge?</h3>
            <p className="text-gray-600 mb-4">Keep practicing to improve your interview skills</p>
            <Button className="bg-primary hover:bg-primary/90">
              Start Another Practice Interview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
