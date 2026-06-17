import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/home";
import Interview from "@/pages/interview";
import Dashboard from "@/pages/dashboard";
import Feedback from "@/pages/feedback";
import NotFound from "@/pages/not-found";
import Navigation from "@/components/layout/navigation";

import SignInPage from "@/pages/sign-in"; 
import SignUpPage from "@/pages/sign-up";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

// Set Clerk Publishable Key from .env
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />

      {/* Auth Routes */}
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        <SignedIn>
          <Dashboard />
        </SignedIn>
        <SignedOut>
          <Redirect to="/sign-in" />
        </SignedOut>
      </Route>

      <Route path="/interview/:id">
        <SignedIn>
          <Interview />
        </SignedIn>
        <SignedOut>
          <Redirect to="/sign-in" />
        </SignedOut>
      </Route>

      <Route path="/feedback/:id">
        <SignedIn>
          <Feedback />
        </SignedIn>
        <SignedOut>
          <Redirect to="/sign-in" />
        </SignedOut>
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAuthPage = location === "/sign-in" || location === "/sign-up";

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen bg-gray-50">
            {!isAuthPage && <Navigation />}

            {!isAuthPage && (
              <header className="p-4 flex items-center gap-4">
                <SignedOut>
                 
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </header>
            )}

            <Router />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
