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
  Briefcase,
  Sparkles,
  ChevronRight,
  Bot
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);
  const [jobDescType, setJobDescType] = useState<"file" | "text">("file");
  const [jobDescText, setJobDescText] = useState("");

  const { data: interviews = [] as any[], isLoading } = useQuery<any[]>({
    queryKey: ["/api/interviews"],
  });

  const createInterviewMutation = useMutation({
    mutationFn: async (data: { 
      jobTitle: string; 
      company: string; 
      resume: File; 
      jobDescType: "file" | "text";
      jobDescriptionFile?: File | null;
      jobDescriptionText?: string;
    }) => {
      const formData = new FormData();
      formData.append("jobTitle", data.jobTitle);
      formData.append("company", data.company);
      formData.append("resume", data.resume);
      
      if (data.jobDescType === "file" && data.jobDescriptionFile) {
        formData.append("jobDescription", data.jobDescriptionFile);
      } else if (data.jobDescType === "text" && data.jobDescriptionText) {
        formData.append("jobDescriptionText", data.jobDescriptionText);
      }
      
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
      setJobDescText("");
      setJobDescType("file");
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
    if (!jobTitle || !resumeFile) {
      toast({
        title: "Missing Information",
        description: "Please enter a job title and upload a resume.",
        variant: "destructive",
      });
      return;
    }

    if (jobDescType === "file" && !jobDescFile) {
      toast({
        title: "Missing Information",
        description: "Please upload a job description file.",
        variant: "destructive",
      });
      return;
    }

    if (jobDescType === "text" && !jobDescText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please paste the job description text.",
        variant: "destructive",
      });
      return;
    }

    createInterviewMutation.mutate({
      jobTitle,
      company,
      resume: resumeFile,
      jobDescType,
      jobDescriptionFile: jobDescFile,
      jobDescriptionText: jobDescText,
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
      icon: <Video className="w-5 h-5 text-teal-600" />,
      bgColor: "bg-teal-50 border-teal-100/60",
      description: "Sessions created",
      trend: "All-time history"
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: <Trophy className="w-5 h-5 text-emerald-600" />,
      bgColor: "bg-emerald-50 border-emerald-100/60",
      description: "Based on feedback reports",
      trend: averageScore >= 80 ? "Excellent" : averageScore >= 60 ? "Good progress" : "Keep practicing"
    },
    {
      title: "Minutes Practiced",
      value: totalMinutes.toString(),
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
      bgColor: "bg-indigo-50 border-indigo-100/60",
      description: "Speaking practice duration",
      trend: `${completedInterviews.length} completed sessions`
    },
    {
      title: "Global Rank",
      value: "Top 12%",
      icon: <TrendingUp className="w-5 h-5 text-cyan-600" />,
      bgColor: "bg-cyan-50 border-cyan-100/60",
      description: "Percentile comparison",
      trend: "+15% this week"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 font-semibold px-2.5 py-0.5 rounded-full">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-500/25 font-semibold px-2.5 py-0.5 rounded-full">In Progress</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-700 border border-slate-500/25 font-semibold px-2.5 py-0.5 rounded-full">Pending</Badge>;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/25 font-bold px-2.5 py-0.5 rounded-full">{score}%</Badge>;
    if (score >= 60) return <Badge className="bg-amber-500/10 text-amber-700 border border-amber-500/25 font-bold px-2.5 py-0.5 rounded-full">{score}%</Badge>;
    return <Badge className="bg-rose-500/10 text-rose-700 border border-rose-500/25 font-bold px-2.5 py-0.5 rounded-full">{score}%</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
          <p className="text-slate-500 text-sm font-medium">Synchronizing Performance Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      {/* Subtle background lines & radial glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200/20 to-indigo-100/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100/80 px-2.5 py-1 rounded-full w-max mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Performance Center</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Interview Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-2xl">
              Monitor your speech accuracy, review detailed AI feedback, and launch customized mock interviews.
            </p>
          </div>
          
          {/* Top action button to quickly open form if not open */}
          {!showCreateForm && (
            <Button
              onClick={() => {
                setShowCreateForm(true);
                // Scroll smoothly to form
                setTimeout(() => {
                  document.getElementById("create-form-section")?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold shadow-md shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/35 hover:-translate-y-0.5 transition-all duration-200 rounded-xl px-5 py-5 text-sm self-start md:self-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Mock Interview
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -3, scale: 1.01 }}
              className="bg-white/75 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-200/60 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
                <span className="text-slate-500">{stat.description}</span>
                <span className="font-semibold text-teal-600 bg-teal-50/50 px-2 py-0.5 rounded border border-teal-100/30">{stat.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create Interview Banner Section */}
        <div id="create-form-section" className="mb-10">
          <AnimatePresence mode="wait">
            {!showCreateForm ? (
              <motion.div
                key="banner"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
              >
                {/* Visual glass overlay grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-25"></div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex-1 relative z-10 text-center lg:text-left">
                  <Badge className="bg-teal-500/10 text-teal-300 border border-teal-500/20 px-3 py-1 font-semibold mb-4 text-xs">
                    PRACTICE MAKES PERFECT
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                    Launch a Custom AI Mock Interview
                  </h2>
                  <p className="text-slate-400 mt-3 text-sm sm:text-base leading-relaxed max-w-xl">
                    Upload your resume and specify the targeted Job Description. Our system will analyze the inputs and construct realistic, role-specific questions for voice-to-voice practice.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold rounded-xl px-6 py-5 shadow-lg shadow-teal-500/15 hover:shadow-xl hover:shadow-teal-500/25 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Initialize Session
                    </Button>
                    <Link href="/">
                      <Button
                        variant="ghost"
                        className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl"
                      >
                        Learn how it works
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right side illustration container */}
                <div className="relative z-10 w-full max-w-[320px] aspect-[4/3] bg-slate-955/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hidden sm:flex">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-[10px] text-slate-500 font-bold tracking-wide">
                    <span>DOCUMENT MATCHING SERVICE</span>
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                  </div>
                  
                  {/* Floating visual items */}
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-2 w-[45%]">
                      <FileText className="w-4 h-4 text-teal-400" />
                      <div className="overflow-hidden">
                        <div className="w-8 h-1.5 bg-slate-700 rounded-full"></div>
                        <div className="w-12 h-1 bg-slate-800 rounded-full mt-1"></div>
                      </div>
                    </div>
                    
                    {/* Connecting glow path */}
                    <div className="flex-1 flex justify-center items-center px-1">
                      <div className="w-full h-[1px] bg-gradient-to-r from-teal-500 to-indigo-500 relative">
                        <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-teal-400 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg p-2 w-[45%]">
                      <Briefcase className="w-4 h-4 text-indigo-400" />
                      <div className="overflow-hidden">
                        <div className="w-10 h-1.5 bg-slate-700 rounded-full"></div>
                        <div className="w-6 h-1 bg-slate-800 rounded-full mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {/* Waveform indicator */}
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-teal-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-slate-400">AI PROMPT ALIGNED</span>
                    </div>
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 2, 1].map((v, i) => (
                        <div key={i} className="w-0.5 h-3 bg-teal-500 rounded-full animate-pulse" style={{ height: `${v * 4}px` }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/80 backdrop-blur-md border border-slate-100 shadow-xl rounded-[2rem] overflow-hidden">
                  <div className="bg-slate-900 px-6 sm:px-8 py-5 flex items-center justify-between text-white border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/25 flex items-center justify-center border border-teal-500/40">
                        <Video className="w-4 h-4 text-teal-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">New Interview Config</CardTitle>
                        <p className="text-slate-400 text-xs mt-0.5">Define your target role & upload credentials</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowCreateForm(false)}
                      className="text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs"
                    >
                      Close Form
                    </Button>
                  </div>
                  
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle" className="text-sm font-bold text-slate-700 flex items-center">
                          Job Title <span className="text-teal-600 ml-0.5">*</span>
                        </Label>
                        <Input
                          id="jobTitle"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="e.g., Software Engineer, Project Manager"
                          className="border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl py-5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-bold text-slate-700">Company</Label>
                        <Input
                          id="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="e.g., Google, Tesla (optional)"
                          className="border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 rounded-xl py-5"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 hover:border-teal-100/85 transition-colors flex flex-col justify-between">
                        <FileUpload
                          label="Upload Resume *"
                          accept=".pdf,.doc,.docx,.txt"
                          onFileSelect={setResumeFile}
                          selectedFile={resumeFile}
                          icon={<Upload className="w-5 h-5 text-teal-600" />}
                          description="PDF, DOCX, or TXT formats"
                        />
                      </div>
                      
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 hover:border-teal-100/85 transition-colors flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm font-bold text-slate-700">Job Description *</Label>
                            
                            {/* Segmented controls toggler */}
                            <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-200/50 text-[11px] font-semibold">
                              <button
                                type="button"
                                onClick={() => setJobDescType("file")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                  jobDescType === "file" 
                                    ? "bg-white text-teal-700 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                File
                              </button>
                              <button
                                type="button"
                                onClick={() => setJobDescType("text")}
                                className={`px-2.5 py-1 rounded-md transition-all ${
                                  jobDescType === "text" 
                                    ? "bg-white text-teal-700 shadow-sm" 
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                              >
                                Text
                              </button>
                            </div>
                          </div>

                          <AnimatePresence mode="wait">
                            {jobDescType === "file" ? (
                              <motion.div
                                key="file-input"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.2 }}
                              >
                                <FileUpload
                                  label=""
                                  accept=".pdf,.doc,.docx,.txt"
                                  onFileSelect={setJobDescFile}
                                  selectedFile={jobDescFile}
                                  icon={<Briefcase className="w-5 h-5 text-indigo-600" />}
                                  description="PDF, DOCX, or TXT formats"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="text-input"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-1"
                              >
                                <textarea
                                  value={jobDescText}
                                  onChange={(e) => setJobDescText(e.target.value)}
                                  placeholder="Paste the job description text (requirements, role details, technologies...) here..."
                                  rows={5}
                                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/10 bg-white placeholder-slate-400 font-sans leading-relaxed resize-none custom-scrollbar"
                                />
                                <p className="text-[10px] text-slate-400">Pasted text will be fed directly to the AI interviewer.</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
                      <Button 
                        onClick={handleCreateInterview}
                        disabled={createInterviewMutation.isPending}
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold px-6 py-5 rounded-xl shadow-lg shadow-teal-500/15 hover:shadow-xl hover:shadow-teal-500/25 transition-all duration-200"
                      >
                        {createInterviewMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating Interview...
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4 mr-2" />
                            Start Practice Session
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCreateForm(false)}
                        disabled={createInterviewMutation.isPending}
                        className="border-slate-200 text-slate-700 px-6 py-5 rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Interviews Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/75 backdrop-blur-md border border-slate-100 shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-white/40 border-b border-slate-100 py-6 px-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center">
                  <Calendar className="w-5 h-5 text-teal-600 mr-2.5" />
                  Recent Practice Sessions
                </CardTitle>
                {interviews.length > 0 && (
                  <Badge variant="outline" className="bg-teal-50/50 text-teal-700 border-teal-100/50 font-semibold px-3 py-1 rounded-full">
                    {interviews.length} Sessions Total
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {interviews.length === 0 ? (
                <div className="text-center py-20 px-4">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                    <Video className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No interviews recorded</h3>
                  <p className="text-slate-500 mb-6 text-sm max-w-sm mx-auto">Start your first AI practice session above to evaluate your communication accuracy and skills.</p>
                  <Button 
                    onClick={() => {
                      setShowCreateForm(true);
                      document.getElementById("create-form-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="bg-primary hover:bg-primary/90 rounded-xl px-5"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Launch Your First Interview
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Role Target
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Date Created
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Speaking Time
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Overall Score
                        </th>
                        <th className="px-8 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-8 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {interviews.map((interview: any) => (
                        <tr key={interview.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-8 py-5 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100/50">
                                <Briefcase className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-slate-800">{interview.jobTitle}</div>
                                {interview.company ? (
                                  <div className="text-xs font-medium text-slate-400">{interview.company}</div>
                                ) : (
                                  <div className="text-xs italic text-slate-400/80">Self practice</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600 font-medium">
                            {new Date(interview.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-600 font-medium">
                            {interview.duration ? (
                              <div className="flex items-center space-x-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{interview.duration} mins</span>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">Unfinished</span>
                            )}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap">
                            {interview.feedback?.overallScore ? (
                              getScoreBadge(interview.feedback.overallScore)
                            ) : (
                              <span className="text-slate-400 text-xs italic">-</span>
                            )}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap">
                            {getStatusBadge(interview.status)}
                          </td>
                          <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-semibold">
                            {interview.status === "completed" && interview.feedback ? (
                              <Link href={`/feedback/${interview.id}`}>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-200 rounded-lg shadow-sm transition-all"
                                >
                                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                                  View Feedback
                                </Button>
                              </Link>
                            ) : interview.status === "pending" ? (
                              <Link href={`/interview/${interview.id}`}>
                                <Button 
                                  size="sm"
                                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm"
                                >
                                  <Play className="w-3 h-3 fill-current mr-1.5" />
                                  Start Session
                                </Button>
                              </Link>
                            ) : interview.status === "in_progress" ? (
                              <Link href={`/interview/${interview.id}`}>
                                <Button 
                                  size="sm"
                                  className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-sm"
                                >
                                  <Play className="w-3 h-3 fill-current mr-1.5" />
                                  Resume
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
        </motion.div>
      </div>
    </div>
  );
}
