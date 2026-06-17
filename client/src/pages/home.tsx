import { useLocation } from "wouter";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  PlayCircle,
  Star,
} from "lucide-react";
import { Bot, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-50/50 border-b border-slate-100/80">
        {/* Background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60"></div>
        
        {/* Colorful glowing ambient spheres */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-teal-200/30 to-cyan-100/20 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-100/30 to-teal-100/20 rounded-full blur-3xl translate-x-1/4 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-20 lg:py-28">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-start"
              >
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-teal-200/50 bg-white/70 backdrop-blur-md text-xs sm:text-sm font-medium text-teal-800 shadow-sm shadow-teal-100/50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>AI-Powered Interview Practice</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight"
              >
                Ace Your Next Interview with
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 via-emerald-500 to-teal-800">
                  AI-Powered Practice
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl"
              >
                Upload your resume and target job description. Practice realistic voice-to-voice mock interviews with our advanced AI, and receive a comprehensive, production-grade feedback report to land your dream offer.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 pt-2"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group flex items-center"
                  onClick={() => navigate("/dashboard")}
                >
                  Start Practicing Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-8 py-6 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center"
                >
                  <PlayCircle className="w-5 h-5 mr-2 text-teal-600" />
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6"
              >
                <div className="flex -space-x-3">
                  {[
                    { name: "JD", bg: "bg-blue-500" },
                    { name: "SM", bg: "bg-emerald-500" },
                    { name: "KT", bg: "bg-indigo-500" },
                    { name: "AG", bg: "bg-rose-500" },
                  ].map((avatar, idx) => (
                    <div
                      key={idx}
                      className={`w-10 h-10 rounded-full ${avatar.bg} border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-md transform hover:scale-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                    >
                      {avatar.name}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-md">
                    +97
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 mt-1">
                    Trusted by over <strong>1,200+ job seekers</strong> globally.
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Mockup Column */}
            <div className="lg:col-span-5 flex justify-center items-center relative mt-12 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-[440px]"
              >
                {/* Decorative glowing backdrops behind mockup */}
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-cyan-300 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>

                {/* Main Interview Simulator Card */}
                <div className="relative aspect-[4/3] bg-slate-900 rounded-[2rem] p-4 shadow-2xl border border-slate-800 overflow-hidden group hover:border-slate-700 transition-colors duration-300">
                  {/* Glass reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none"></div>

                  {/* Top navigation bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400 px-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-teal-400" />
                      <span className="font-semibold tracking-wide">HireMentis AI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                      <span className="font-medium text-emerald-400 uppercase tracking-widest text-[9px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900/50">LIVE SESSION</span>
                    </div>
                  </div>

                  {/* AI Avatar / Waveform Area */}
                  <div className="flex flex-col items-center justify-center py-6 relative h-[calc(100%-48px)]">
                    {/* Siri/Gemini styled voice orb */}
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.15, 1],
                          rotate: [0, 180, 360],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500 rounded-full opacity-30 blur-md"
                      ></motion.div>
                      <motion.div
                        animate={{
                          scale: [1.05, 0.95, 1.05],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute w-16 h-16 bg-gradient-to-tr from-teal-600 to-cyan-600 rounded-full flex items-center justify-center shadow-lg border border-teal-400/30"
                      >
                        <Bot className="w-8 h-8 text-white" />
                      </motion.div>
                    </div>

                    {/* Pulsating Voice Bars */}
                    <div className="flex items-center space-x-1 mt-5 h-8">
                      {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((bar, idx) => (
                        <motion.div
                          key={idx}
                          animate={{
                            scaleY: [0.3, 1.2, 0.3],
                          }}
                          transition={{
                            duration: 1 + idx * 0.15,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-1 h-6 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full origin-center"
                        ></motion.div>
                      ))}
                    </div>

                    {/* Question subtitle inside preview */}
                    <div className="mt-4 text-center px-4">
                      <p className="text-[10px] text-slate-400 italic">AI Interviewer asking...</p>
                      <p className="text-xs font-medium text-slate-200 mt-1 max-w-[280px] mx-auto line-clamp-2 leading-relaxed">
                        "Can you describe a challenge you faced with database scalability and how you resolved it?"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Card 1: Candidate Response (Top Left) */}
                <motion.div
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -left-6 bg-white/80 backdrop-blur-md border border-slate-200/50 p-3 rounded-2xl shadow-xl max-w-[180px] pointer-events-none hidden sm:block"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center">
                      <span className="text-[9px] text-teal-700 font-bold">YOU</span>
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">Candidate</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-normal font-medium">
                    "We implemented Redis caching layer which cut database latency by 80%..."
                  </p>
                  <div className="mt-1.5 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-[8px] text-emerald-600 font-bold uppercase">Streaming Audio</span>
                  </div>
                </motion.div>

                {/* Floating Card 2: AI Metrics Analysis (Bottom Right) */}
                <motion.div
                  animate={{
                    y: [0, 6, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-8 -right-6 bg-white/95 backdrop-blur-md border border-teal-100 p-3.5 rounded-2xl shadow-2xl w-44 pointer-events-none hidden sm:block"
                >
                  <h4 className="text-[10px] font-bold text-slate-800 mb-2 flex items-center justify-between">
                    <span>Live Audit Metrics</span>
                    <span className="text-[8px] text-teal-600 bg-teal-50 px-1 py-0.5 rounded font-bold">AI Active</span>
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[9px] font-semibold text-slate-500 mb-0.5">
                        <span>Confidence</span>
                        <span className="text-emerald-600">92%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[92%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] font-semibold text-slate-500 mb-0.5">
                        <span>Communication</span>
                        <span className="text-teal-600">89%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full rounded-full w-[89%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[9px] font-semibold text-slate-500 mb-0.5">
                        <span>Technical Depth</span>
                        <span className="text-indigo-600">95%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full w-[95%]"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>
      {/* Process Section */}


<section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-32 left-20 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="dots-process" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots-process)" />
          </svg>
        </div>
        <div className="absolute bottom-40 right-16 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="lines-process" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M15,0 L0,0 L0,15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#lines-process)" />
          </svg>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-8">
            HOW TO GET STARTED
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            How AI Interview Master Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform provides a comprehensive interview preparation experience tailored to your specific
            job requirements
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-600 transform -translate-x-px hidden lg:block"></div>

          {/* Step 1 - Upload Documents */}
          <div className="relative mb-24">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Content - Left Side */}
              <div className="lg:text-right lg:pr-16">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500 text-white rounded-full font-bold text-lg mb-6 lg:ml-auto">
                  1
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Upload Documents</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Upload your resume and job description. Our AI will analyze both to create personalized interview
                  questions.
                </p>
                <div className="flex items-center justify-start lg:justify-end space-x-4 text-sm text-emerald-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span>Resume Analysis</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                    <span>Job Matching</span>
                  </div>
                </div>
              </div>

              {/* Mockup - Right Side */}
              <div className="mt-8 lg:mt-0 lg:pl-16">
                <div className="relative">
                  <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">Upload Documents</h4>
                        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-emerald-200 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                              className="w-6 h-6 text-emerald-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Drop your resume here</p>
                        </div>
                        <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">Add job description</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Point */}
            <div className="absolute left-1/2 top-6 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 hidden lg:block"></div>
          </div>

          {/* Step 2 - Practice Interview */}
          <div className="relative mb-24">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Mockup - Left Side */}
              <div className="order-2 lg:order-1 mt-8 lg:mt-0 lg:pr-16">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-3xl p-8 shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">AI Interview Session</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-gray-500">Live</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">AI</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">"Tell me about your experience with React..."</p>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                          </div>
                        </div>
                        <div className="bg-emerald-50 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">Your response is being analyzed...</p>
                              <div className="flex items-center mt-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                                <span className="text-xs text-emerald-600">Real-time feedback</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content - Right Side */}
              <div className="order-1 lg:order-2 lg:pl-16">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full font-bold text-lg mb-6">
                  2
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Practice Interview</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Engage in realistic mock interviews with our AI interviewer. Answer questions via video and get
                  real-time responses.
                </p>
                <div className="flex items-center space-x-4 text-sm text-blue-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Video Interview</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>Real-time AI</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Point */}
            <div className="absolute left-1/2 top-6 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 hidden lg:block"></div>
          </div>

          {/* Step 3 - Get Detailed Feedback */}
          <div className="relative">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              {/* Content - Left Side */}
              <div className="lg:text-right lg:pr-16">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500 text-white rounded-full font-bold text-lg mb-6 lg:ml-auto">
                  3
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Get Detailed Feedback</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Receive comprehensive feedback on your performance, including technical skills, communication, and
                  areas for improvement.
                </p>
                <div className="flex items-center justify-start lg:justify-end space-x-4 text-sm text-purple-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span>Performance Score</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span>Improvement Tips</span>
                  </div>
                </div>
              </div>

              {/* Mockup - Right Side */}
              <div className="mt-8 lg:mt-0 lg:pl-16">
                <div className="relative">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-500 rounded-3xl p-8 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900">Interview Feedback</h4>
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-emerald-600 mb-1">92%</div>
                            <div className="text-xs text-gray-500">Technical</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">85%</div>
                            <div className="text-xs text-gray-500">Communication</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-purple-600 mb-1">78%</div>
                            <div className="text-xs text-gray-500">Confidence</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="bg-emerald-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Overall Score</span>
                              <span className="text-sm font-bold text-emerald-600">A-</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div className="h-2 bg-emerald-500 rounded-full w-4/5"></div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <p>✓ Strong technical knowledge</p>
                            <p>⚠ Work on eye contact</p>
                            <p>✓ Clear communication</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Connection Point */}
            <div className="absolute left-1/2 top-6 w-6 h-6 bg-purple-500 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 hidden lg:block"></div>
          </div>
        </div>
      </div>
    </section>


      {/* Features Section */}
       <section className="py-20 px-4 bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="dots1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots1)" />
          </svg>
        </div>
        <div className="absolute top-40 right-20 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="lines1" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,5 L10,5" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#lines1)" />
          </svg>
        </div>
        <div className="absolute bottom-32 left-1/4 w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="grid1" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M15,0 L0,0 L0,15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid1)" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <circle cx="50" cy="50" r="2" fill="currentColor" />
            <circle cx="20" cy="30" r="1" fill="currentColor" />
            <circle cx="80" cy="70" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="diagonal1" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0,8 L8,0" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#diagonal1)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full text-sm text-gray-600 mb-8 shadow-sm border">
            Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Packed With Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            AI Interview Master combines cutting-edge AI technology with expert interview knowledge to give you the edge
            in your job search
          </p>
        </div>

        {/* Top Row - 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Realistic AI Interviews */}
          <div className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute top-4 right-4 opacity-10">
              <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">AI Interview in progress</div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-emerald-400 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-gray-900">Interactive Session</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Realistic AI Interviews</h3>
              <p className="text-gray-600 leading-relaxed">
                Practice with our lifelike AI interviewer that asks relevant questions and responds to your answers
                naturally using advanced speech recognition.
              </p>
            </div>
          </div>

          {/* Industry-Specific Questions */}
          <div className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute top-4 right-4 opacity-10">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-gray-900">5,000+</div>
                  <div className="relative">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="absolute -top-1 left-4/5 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Questions Available</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Industry-Specific Questions</h3>
              <p className="text-gray-600 leading-relaxed">
                Access thousands of questions curated for different industries, roles, and seniority levels, generated
                based on your uploaded job description.
              </p>
            </div>
          </div>

          {/* Instant AI Feedback */}
          <div className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute top-4 right-4 opacity-10">
              <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">Feedback</div>
                    </div>
                    <div className="w-8 h-1 bg-emerald-300"></div>
                    <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">Score</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-full"></div>
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instant AI Feedback</h3>
              <p className="text-gray-600 leading-relaxed">
                Get personalized feedback on your responses, including content quality, delivery style, and specific
                areas for improvement after each session.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Row - 2 Larger Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Behavioral Analysis */}
          <div className="group bg-white rounded-3xl p-10 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-50 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute top-6 right-6 opacity-10">
              <svg className="w-20 h-20 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white text-lg">📊</span>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">Performance Analysis</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 bg-emerald-50 px-4 py-2 rounded-full flex-1">
                      Confidence Level: 92%
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 bg-blue-50 px-4 py-2 rounded-full flex-1">
                      Communication Skills: 85%
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 bg-purple-50 px-4 py-2 rounded-full flex-1">
                      Body Language: 78%
                    </span>
                    <div className="ml-auto text-xs text-gray-500">Live Analysis</div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Behavioral Analysis</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Receive insights on your communication skills, confidence level, body language, and overall interview
                performance using computer vision technology for comprehensive evaluation.
              </p>
            </div>
          </div>

          {/* Session Recording & Time Management */}
          <div className="group bg-white rounded-3xl p-10 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute top-6 right-6 opacity-10">
              <svg className="w-20 h-20 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">REC</div>
                    <div className="text-xs text-gray-500">Session Recording</div>
                    <div className="w-full h-1 bg-gray-200 rounded-full mt-2">
                      <div className="w-2/3 h-1 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 mb-1">2:30</div>
                    <div className="text-xs text-gray-500">Optimal Time</div>
                    <div className="w-12 h-12 mx-auto mt-2 relative">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-emerald-500"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray="75, 100"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Session Recording & Time Management</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Record your interview sessions and review them later while learning to deliver concise responses within
                appropriate time frames with real-time coaching and feedback.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    {/* Testimonials */}

    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        {/* Dotted patterns */}
        <div className="absolute top-20 left-10 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="dots-testimonials" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots-testimonials)" />
          </svg>
        </div>

        {/* Grid lines */}
        <div className="absolute bottom-32 right-16 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="lines-testimonials" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M15,0 L0,0 L0,15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#lines-testimonials)" />
          </svg>
        </div>

        {/* Diagonal lines */}
        <div className="absolute top-1/3 right-1/4 w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="diagonal-lines" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0,8 L8,0" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#diagonal-lines)" />
          </svg>
        </div>

        {/* Horizontal lines */}
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="horizontal-lines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M0,5 L10,5" stroke="currentColor" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#horizontal-lines)" />
          </svg>
        </div>

        {/* Vertical lines */}
        <div className="absolute top-1/4 left-1/5 w-16 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="vertical-lines" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M5,0 L5,10" stroke="currentColor" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#vertical-lines)" />
          </svg>
        </div>

        {/* Cross-hatch pattern */}
        <div className="absolute top-2/3 right-1/3 w-22 h-22">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="crosshatch" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                <path d="M0,6 L12,6 M6,0 L6,12" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#crosshatch)" />
          </svg>
        </div>

        {/* Scattered circles */}
        <div className="absolute top-1/2 left-1/4 w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <circle cx="20" cy="20" r="1.5" fill="currentColor" />
            <circle cx="50" cy="35" r="1" fill="currentColor" />
            <circle cx="80" cy="60" r="2" fill="currentColor" />
            <circle cx="30" cy="75" r="1" fill="currentColor" />
            <circle cx="70" cy="15" r="1.5" fill="currentColor" />
          </svg>
        </div>

        {/* Wavy lines */}
        <div className="absolute bottom-1/3 right-1/5 w-24 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <path d="M0,50 Q25,30 50,50 T100,50" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <path d="M0,30 Q25,10 50,30 T100,30" stroke="currentColor" strokeWidth="0.3" fill="none" />
            <path d="M0,70 Q25,50 50,70 T100,70" stroke="currentColor" strokeWidth="0.4" fill="none" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-8">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            TESTIMONIALS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Our Users Love the Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Thousands of job seekers have successfully prepared for their interviews with our platform
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Suman Sourav",
              role: "Product Manager at BharatCore Labs",
              content:
                "AI Interview Master prepared me thoroughly for the Product Manager role at BharatCore Labs. The AI-driven feedback was so detailed that my responses became far more impactful and structured. I walked into the real interview brimming with confidence.",
              avatar: "SS",
              rating: 5,
              linkedinUrl:
                "https://www.linkedin.com/in/ACoAAD2QMl8B283VwVg4HO-ueI8RWyl8O7SZmcM?lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3BjabMqiqiShWYHQ5XE4UQhg%3D%3D",
            },
            {
              name: "Tarushee Gupta",
              role: "Software Engineer at InnoVista Systems",
              content:
                "After just two weeks on AI Interview Master, my technical interview performance shot up. The platform's data-structures and system-design questions were exactly what I faced in my InnoVista Systems campus drive, and the AI tips helped me articulate answers clearly.",
              avatar: "TG",
              rating: 4,
              linkedinUrl:
                "https://www.linkedin.com/in/tarushee-gupta-5ab637302?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAE1WDZMBlLkEjwDnqQ1Gb3CDDvHCdjLPtEU&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3B47ub852aQ9mTnbwDCljyOg%3D%3D",
            },
            {
              name: "Atishay Jain",
              role: "Marketing Specialist at UrbanPalate Innovations",
              content:
                "I used to get nervous in interviews, but AI Interview Master's realistic mock sessions completely changed my game. Practicing HR drills—like explaining my strengths and weaknesses—helped me express myself with clarity.",
              avatar: "AJ",
              rating: 4,
              linkedinUrl:
                "https://www.linkedin.com/in/atishay-jain-821610268?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAEGWHZkBOF1l4yp9kMQ13lIGgqJdV4TUfSg&lipi=urn%3Ali%3Apage%3Ad_flagship3_search_srp_all%3BvLN481yyQ4SlzjMwOm2mmQ%3D%3D",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden"
            >
              {/* Background Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>

              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <svg className="w-12 h-12 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 mr-1 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <div className="ml-2 text-sm text-gray-500 font-medium">{testimonial.rating}.0</div>
                </div>

                {/* Review Text */}
                <blockquote className="text-gray-700 leading-relaxed mb-8 text-lg">"{testimonial.content}"</blockquote>

                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>

                  {/* LinkedIn Link */}
                  <a
                    href={testimonial.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors duration-300 group-hover:scale-110"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-emerald-200 transition-colors duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="group">
            <div className="text-4xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              94%
            </div>
            <div className="text-gray-600">Success Rate</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              150+
            </div>
            <div className="text-gray-600">Happy Candidates</div>
          </div>
          <div className="group">
            <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              4.4
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA */}

    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-emerald-50 via-emerald-25 to-green-50 rounded-3xl p-12 md:p-16 lg:p-20 overflow-hidden shadow-sm border border-emerald-100/50">
          {/* Background Pattern Lines */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Random geometric lines */}
              <path
                d="M0,100 L200,80 L400,120 L600,90 L800,110"
                stroke="rgb(34, 197, 94)"
                strokeWidth="1"
                opacity="0.3"
                fill="none"
              />
              <path
                d="M0,200 L150,180 L350,220 L550,190 L800,210"
                stroke="rgb(34, 197, 94)"
                strokeWidth="1"
                opacity="0.25"
                fill="none"
              />
              <path
                d="M0,300 L250,280 L450,320 L650,290 L800,310"
                stroke="rgb(34, 197, 94)"
                strokeWidth="1"
                opacity="0.2"
                fill="none"
              />
              <path
                d="M0,400 L180,380 L380,420 L580,390 L800,410"
                stroke="rgb(34, 197, 94)"
                strokeWidth="1"
                opacity="0.15"
                fill="none"
              />
              <path
                d="M0,500 L220,480 L420,520 L620,490 L800,510"
                stroke="rgb(34, 197, 94)"
                strokeWidth="1"
                opacity="0.1"
                fill="none"
              />

              {/* Diagonal lines */}
              <path d="M100,0 L120,600" stroke="rgb(34, 197, 94)" strokeWidth="0.5" opacity="0.15" fill="none" />
              <path d="M300,0 L320,600" stroke="rgb(34, 197, 94)" strokeWidth="0.5" opacity="0.1" fill="none" />
              <path d="M500,0 L520,600" stroke="rgb(34, 197, 94)" strokeWidth="0.5" opacity="0.12" fill="none" />
              <path d="M700,0 L720,600" stroke="rgb(34, 197, 94)" strokeWidth="0.5" opacity="0.08" fill="none" />

              {/* Scattered dots */}
              <circle cx="150" cy="150" r="2" fill="rgb(34, 197, 94)" opacity="0.2" />
              <circle cx="650" cy="200" r="1.5" fill="rgb(34, 197, 94)" opacity="0.25" />
              <circle cx="450" cy="350" r="2.5" fill="rgb(34, 197, 94)" opacity="0.15" />
              <circle cx="250" cy="450" r="2" fill="rgb(34, 197, 94)" opacity="0.2" />
              <circle cx="750" cy="120" r="1.5" fill="rgb(34, 197, 94)" opacity="0.18" />
              <circle cx="550" cy="480" r="2" fill="rgb(34, 197, 94)" opacity="0.22" />
            </svg>
          </div>

          <div className="relative text-center">
            {/* AI Tutor Avatar */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-200 to-emerald-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white/80">
                  <Bot className="w-10 h-10 text-emerald-700" />
                </div>
                {/* Floating Sparkles */}
                <div className="absolute -top-1 -right-1 animate-pulse">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="absolute -bottom-1 -left-1 animate-pulse delay-300">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-20 animate-pulse"></div>
              </div>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Preparing for your{" "}
              <span className="bg-gradient-to-r from-emerald-700 to-emerald-600 bg-clip-text text-transparent">
                dream job?
              </span>
            </h2>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
              Try speaking with our expert <span className="font-semibold text-emerald-700">AI Interview Tutor</span>,
              and get free practice and personalized feedback to ace your next interview.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
             <Link href="/dashboard">
  <Button
    size="lg"
    className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
  >
    Start Your Free Interview
    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </Button>
</Link>

              <div className="flex items-center text-sm text-gray-600">
                <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
                No credit card required
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                AI-Powered Feedback
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                Personalized Questions
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></div>
                Real-time Analysis
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>
  );
}
