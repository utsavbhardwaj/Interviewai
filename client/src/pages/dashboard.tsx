import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/ui/file-upload";
import { useToast } from "@/hooks/use-toast";
import { 
  Video, 
  Trophy, 
  Clock, 
  TrendingUp,
  Calendar,
  FileText,
  BarChart3,
  Eye,
  Play,
  Plus,
  Upload,
  Briefcase
} from "lucide-react";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);

  const { data: interviews = [], isLoading } = useQuery({
    queryKey: ["/api/interviews"],
  });

  const createInterviewMutation = useMutation({
    mutationFn: async (data: { jobTitle: string; company: string; resume: File; jobDescription: File }) => {
      const formData = new FormData();
      formData.append("jobTitle", data.jobTitle);
      formData.append("company", data.company);
      formData.append("resume", data.resume);
      formData.append("jobDescription", data.jobDescription);
      
      const response = await fetch("/api/interviews", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create interview");
      }
      
      return response.json();
    },
    onSuccess: (interview) => {
      toast({
        title: "Interview Created",
        description: "Your interview has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/interviews"] });
      setShowCreateForm(false);
      // Reset form
      setJobTitle("");
      setCompany("");
      setResumeFile(null);
      setJobDescFile(null);
      navigate(`/interview/${interview.id}`);
    },
    onError: (error: any) => {
      console.error("Create interview error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateInterview = () => {
    if (!jobTitle || !resumeFile || !jobDescFile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and upload both files.",
        variant: "destructive",
      });
      return;
    }

    createInterviewMutation.mutate({
      jobTitle,
      company,
      resume: resumeFile,
      jobDescription: jobDescFile,
    });
  };

  const completedInterviews = interviews.filter((i: any) => i.status === "completed");
  const totalMinutes = completedInterviews.reduce((acc: number, i: any) => acc + (i.duration || 0), 0);
  const averageScore = completedInterviews.length > 0 
    ? Math.round(completedInterviews.reduce((acc: number, i: any) => acc + (i.feedback?.overallScore || 0), 0) / completedInterviews.length)
    : 0;

  const stats = [
    {
      title: "Total Interviews",
      value: interviews.length.toString(),
      icon: <Video className="w-6 h-6 text-blue-600" />,
      bgColor: "bg-blue-100"
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: <Trophy className="w-6 h-6 text-green-600" />,
      bgColor: "bg-green-100"
    },
    {
      title: "Minutes Practiced",
      value: totalMinutes.toString(),
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      bgColor: "bg-purple-100"
    },
    {
      title: "Improvement",
      value: "+15%",
      icon: <TrendingUp className="w-6 h-6 text-primary" />,
      bgColor: "bg-primary/10"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">{score}%</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">{score}%</Badge>;
    return <Badge className="bg-red-100 text-red-800">{score}%</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Dashboard</h1>
          <p className="text-gray-600">Track your progress and review past interviews</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Interview Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Create New Interview
                {!showCreateForm && (
                  <Button 
                    onClick={() => setShowCreateForm(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Interview
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showCreateForm ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g., Google"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FileUpload
                      label="Upload Resume *"
                      accept=".pdf,.doc,.docx,.txt"
                      onFileSelect={setResumeFile}
                      selectedFile={resumeFile}
                      icon={<Upload className="w-6 h-6" />}
                      description="PDF, DOC, DOCX, or TXT files only"
                    />
                    <FileUpload
                      label="Upload Job Description *"
                      accept=".pdf,.doc,.docx,.txt"
                      onFileSelect={setJobDescFile}
                      selectedFile={jobDescFile}
                      icon={<Briefcase className="w-6 h-6" />}
                      description="PDF, DOC, DOCX, or TXT files only"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      onClick={handleCreateInterview}
                      disabled={createInterviewMutation.isPending}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {createInterviewMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating Interview...
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 mr-2" />
                          Start Interview
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      disabled={createInterviewMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Video className="w-12 h-12 text-primary mx-auto mb-4" />
                  <p className="text-gray-600">Create a new AI-powered interview session to practice your skills</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            {interviews.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No interviews yet</h3>
                <p className="text-gray-600 mb-6">Start your first interview practice session to see your progress here.</p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Video className="w-4 h-4 mr-2" />
                    Start Your First Interview
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {interviews.map((interview: any) => (
                      <tr key={interview.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{interview.jobTitle}</div>
                          {interview.company && (
                            <div className="text-sm text-gray-500">{interview.company}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {interview.duration ? `${interview.duration} min` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {interview.feedback?.overallScore ? 
                            getScoreBadge(interview.feedback.overallScore) : 
                            <span className="text-gray-400">-</span>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(interview.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {interview.status === "completed" && interview.feedback ? (
                            <Link href={`/feedback/${interview.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-1" />
                                View Feedback
                              </Button>
                            </Link>
                          ) : interview.status === "pending" ? (
                            <Link href={`/interview/${interview.id}`}>
                              <Button variant="outline" size="sm">
                                <Play className="w-4 h-4 mr-1" />
                                Start
                              </Button>
                            </Link>
                          ) : interview.status === "in_progress" ? (
                            <Link href={`/interview/${interview.id}`}>
                              <Button variant="outline" size="sm">
                                <Play className="w-4 h-4 mr-1" />
                                Continue
                              </Button>
                            </Link>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
