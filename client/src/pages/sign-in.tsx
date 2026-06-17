import { SignIn } from "@clerk/clerk-react"

const SignInPage = () => {
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="dots-signin" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots-signin)" />
          </svg>
        </div>
        <div className="absolute bottom-32 right-16 w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-100">
            <defs>
              <pattern id="lines-signin" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
                <path d="M15,0 L0,0 L0,15" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#lines-signin)" />
          </svg>
        </div>
        <div className="absolute top-1/3 right-1/4 w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200">
            <defs>
              <pattern id="diagonal-signin" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M0,8 L8,0" stroke="currentColor" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#diagonal-signin)" />
          </svg>
        </div>
      </div>

      {/* Left Side - Visual Content */}
      <div className="flex-1 bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 relative overflow-hidden hidden lg:flex items-center justify-center">
        {/* Background Decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 right-1/4 transform translate-x-1/2">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-bounce">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-pulse">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-1/4 right-1/3">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center animate-bounce delay-300">
            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Welcome Back to
            <br />
            AI Interview Master
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed max-w-md mx-auto">
            Continue your interview preparation journey and achieve your career goals with AI-powered practice sessions.
          </p>

          {/* Features */}
          <div className="space-y-4 max-w-sm mx-auto">
            <div className="flex items-center text-left">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-emerald-100">Resume your practice sessions</span>
            </div>
            <div className="flex items-center text-left">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-emerald-100">Access your feedback history</span>
            </div>
            <div className="flex items-center text-left">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-emerald-100">Track your progress</span>
            </div>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-emerald-700 to-transparent"></div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Sign in to continue your interview preparation journey</p>
          </div>

          {/* Clerk SignIn Component with Custom Styling */}
          <div className="clerk-signin-container">
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
               afterSign-inUrl="/dashboard" 
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
                  formFieldAction: "text-emerald-600 hover:text-emerald-700",
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Secure Login
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Access
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 p-6 bg-emerald-50 rounded-2xl">
            <div className="text-center">
              <div className="text-sm text-emerald-700 font-medium mb-2">Your Progress Awaits</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-emerald-600">Sessions</div>
                  <div className="text-xs text-emerald-500">Resume Practice</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-600">Feedback</div>
                  <div className="text-xs text-emerald-500">View Reports</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-600">Progress</div>
                  <div className="text-xs text-emerald-500">Track Growth</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
