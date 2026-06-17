import { SignUp } from "@clerk/clerk-react"

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="dots-signup" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots-signup)" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-16 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="lines-signup" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M15,0 L0,0 L0,15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#lines-signup)" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="diagonal-signup" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0,8 L8,0" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#diagonal-signup)" />
          </svg>
        </div>
      </div>

      {/* Left Side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AI Interview Master</h1>
            <p className="text-gray-600">Create your account and start practicing interviews with AI</p>
          </div>

          {/* Clerk SignUp Component with Custom Styling */}
          <div className="clerk-signup-container">
            <SignUp
              path="/sign-up"
              routing="path"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-2xl border-0 rounded-3xl overflow-hidden",
                  headerTitle: "text-2xl font-bold text-gray-900",
                  headerSubtitle: "text-gray-600",
                  socialButtonsBlockButton:
                    "border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 rounded-xl",
                  socialButtonsBlockButtonText: "font-medium text-gray-700",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 font-medium",
                  formFieldInput:
                    "border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl px-4 py-3 transition-all duration-300",
                  formFieldLabel: "text-gray-700 font-medium",
                  formButtonPrimary:
                    "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl py-3 font-semibold transition-all duration-300 transform hover:scale-105",
                  footerActionLink: "text-emerald-600 hover:text-emerald-700 font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton: "text-emerald-600 hover:text-emerald-700",
                },
                variables: {
                  colorPrimary: "#10b981",
                  colorBackground: "#ffffff",
                  colorInputBackground: "#ffffff",
                  colorInputText: "#374151",
                  borderRadius: "0.75rem",
                },
              }}
            />
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free to start
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure & Private
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Content */}
      <div className="flex-1 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 relative overflow-hidden hidden lg:flex items-center justify-center">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-bounce">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-1/4 left-1/3">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-bounce delay-300">
            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center text-white z-10 px-8">
          <div className="mb-8">
            <div className="w-32 h-32 bg-white/20 rounded-3xl mx-auto mb-8 flex items-center justify-center backdrop-blur-sm">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Master Your Next
            <br />
            Interview with AI
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed max-w-md mx-auto">
            Practice with realistic AI interviews, get instant feedback, and land your dream job with confidence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">8.5K+</div>
              <div className="text-emerald-100 text-sm">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">94%</div>
              <div className="text-emerald-100 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">4.4★</div>
              <div className="text-emerald-100 text-sm">Rating</div>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-700 to-transparent"></div>
      </div>
    </div>
  )
}

export default SignUpPage
