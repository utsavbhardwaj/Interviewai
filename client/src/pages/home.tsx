import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FileUpload from "@/components/ui/file-upload";
import { 
  Sparkles, 
  Upload, 
  Video, 
  BarChart3, 
  Bot, 
  Briefcase, 
  MessageCircle, 
  Brain,
  Clock,
  PlayCircle,
  Users,
  Star,
  ArrowRight
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescFile, setJobDescFile] = useState<File | null>(null);

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
        throw new Error("Failed to create interview");
      }
      
      return response.json();
    },
    onSuccess: (interview) => {
      toast({
        title: "Interview Created",
        description: "Your interview has been created successfully!",
      });
      navigate(`/interview/${interview.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create interview. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleStartInterview = () => {
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

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Interview Practice
              </Badge>
            </div>
            <h1 className="hero-text text-gray-900 mb-6">
              Ace Your Next Interview with
              <span className="text-primary"> AI-Powered Practice</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Upload your resume and job description, practice with AI-generated questions, 
              and receive detailed feedback to improve your interview performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Practicing Free
              </Button>
              <Button variant="outline" size="lg">
                <PlayCircle className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white font-semibold">JD</div>
                <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white font-semibold">SM</div>
                <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white font-semibold">KT</div>
                <div className="w-10 h-10 rounded-full bg-primary border-2 border-white flex items-center justify-center text-white font-semibold">+97</div>
              </div>
              <span className="text-gray-600">Trusted by 100+ job seekers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title text-gray-900 mb-4">
              Start Your Practice Interview
            </h2>
            <p className="text-xl text-gray-600">
              Upload your documents and let our AI create personalized interview questions
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center">Create New Interview Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Frontend Developer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Tech Corp Inc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload
                  label="Upload Resume *"
                  accept=".pdf,.doc,.docx,.txt"
                  onFileSelect={setResumeFile}
                  selectedFile={resumeFile}
                  icon={<Upload className="w-8 h-8" />}
                  description="PDF, DOC, TXT supported"
                />
                <FileUpload
                  label="Upload Job Description *"
                  accept=".pdf,.doc,.docx,.txt"
                  onFileSelect={setJobDescFile}
                  selectedFile={jobDescFile}
                  icon={<Briefcase className="w-8 h-8" />}
                  description="Text or PDF format"
                />
              </div>

              <div className="text-center pt-4">
                <Button 
                  onClick={handleStartInterview}
                  disabled={createInterviewMutation.isPending}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  {createInterviewMutation.isPending ? (
                    "Creating Interview..."
                  ) : (
                    <>
                      Start Interview Practice
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Three Step Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-4">
              How AI Interview Master Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered platform provides a comprehensive interview preparation experience 
              tailored to your specific job requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Step 1: Upload */}
            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Upload className="text-primary text-2xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload Documents</h3>
                <p className="text-gray-600 mb-6">
                  Upload your resume and job description. Our AI will analyze both to create 
                  personalized interview questions.
                </p>
              </CardContent>
            </Card>

            {/* Step 2: Interview */}
            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Video className="text-primary text-2xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Practice Interview</h3>
                <p className="text-gray-600 mb-6">
                  Engage in realistic mock interviews with our AI interviewer. Answer questions 
                  via video and get real-time responses.
                </p>
              </CardContent>
            </Card>

            {/* Step 3: Feedback */}
            <Card className="text-center group hover:shadow-lg transition-shadow">
              <CardContent className="pt-8">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="text-primary text-2xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Detailed Feedback</h3>
                <p className="text-gray-600 mb-6">
                  Receive comprehensive feedback on your performance, including technical skills, 
                  communication, and areas for improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-4">
              Packed With Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI Interview Master combines cutting-edge AI technology with expert interview knowledge 
              to give you the edge in your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Bot className="w-6 h-6" />,
                title: "Realistic AI Interviews",
                description: "Practice with our lifelike AI interviewer that asks relevant questions and responds to your answers naturally using advanced speech recognition."
              },
              {
                icon: <Briefcase className="w-6 h-6" />,
                title: "Industry-Specific Questions",
                description: "Access thousands of questions curated for different industries, roles, and seniority levels, generated based on your uploaded job description."
              },
              {
                icon: <MessageCircle className="w-6 h-6" />,
                title: "Instant AI Feedback",
                description: "Get personalized feedback on your responses, including content quality, delivery style, and specific areas for improvement after each session."
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Behavioral Analysis",
                description: "Receive insights on your communication skills, confidence level, body language, and overall interview performance using computer vision."
              },
              {
                icon: <Video className="w-6 h-6" />,
                title: "Session Recording",
                description: "Record your interview sessions and review them later to track your progress and identify patterns in your responses."
              },
              {
                icon: <Clock className="w-6 h-6" />,
                title: "Time Management",
                description: "Learn to deliver concise and impactful responses within appropriate time frames with real-time coaching and feedback."
              }
            ].map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-gray-900 mb-4">
              Our Users Love the Results
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Thousands of job seekers have successfully prepared for their interviews with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Product Manager at BharatCore Labs",
                content: "AI Interview Master prepared me thoroughly for the Product Manager role at BharatCore Labs. The AI-driven feedback was so detailed that my responses became far more impactful and structured. I walked into the real interview brimming with confidence.",
                avatar: "PS"
              },
              {
                name: "Rohit Gupta",
                role: "Software Engineer at InnoVista Systems",
                content: "After just two weeks on AI Interview Master, my technical interview performance shot up. The platform's data-structures and system-design questions were exactly what I faced in my InnoVista Systems campus drive, and the AI tips helped me articulate answers clearly.",
                avatar: "RG"
              },
              {
                name: "Ananya Singh",
                role: "Marketing Specialist at UrbanPalate Innovations",
                content: "I used to get nervous in interviews, but AI Interview Master's realistic mock sessions completely changed my game. Practicing HR drills—like explaining my strengths and weaknesses—helped me express myself with clarity.",
                avatar: "AS"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="shadow-sm border border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-teal-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful job seekers who have transformed their interview skills with AI Interview Master
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Sales
            </Button>
          </div>
          <p className="text-teal-200 mt-4">No credit card required. Try now.</p>
        </div>
      </section>
    </div>
  );
}
