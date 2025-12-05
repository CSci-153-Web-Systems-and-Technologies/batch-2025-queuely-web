// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export default function LoginPage() {
  const router = useRouter();
  // 2. Create Supabase client
  const supabase = createClient();

  // 3. Define state for form inputs, loading status, and errors
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 4. The function that handles form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // 1. Log in (Authentication)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      setErrorMessage(authError.message);
      setIsLoading(false);
      return;
    }

    // 2. If login successful, fetch user role (Authorization)
    if (authData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
         // Handle edge case where auth succeeded but profile fetch failed
         setErrorMessage("Could not fetch user role.");
         await supabase.auth.signOut(); // Sign them out if we can't determine role
         setIsLoading(false);
         return;
      }

      // 3. Redirect based on role
      router.refresh(); // Refresh server components
      if (profileData?.role === 'admin') {
        router.push("/dashboard");
      } else {
        router.push("/home");
      }
    }

    // Call Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // If error, show message and stop loading
      setErrorMessage(error.message);
      setIsLoading(false);
    } else {
      // If success, redirect to dashboard
      // Router refresh ensures server components re-run to check auth state
      router.refresh();
    }
  };

  return (
    // Main Container: Overall light green background
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#E8F3E8]">

      {/* LEFT SIDE: Branding Text (Unchanged) */}
      <div className="hidden md:flex flex-col justify-center items-start p-16 text-[#1B4D3E]">
        {/* Placeholder text for the logo area */}
        <h1 className="text-6xl font-bold mb-6 flex items-center gap-2">
          {/* Placeholder for logo icon */}
          <div className="h-12 w-12 bg-[#1B4D3E] rounded-lg"></div>
          Queuely
        </h1>
        <p className="text-2xl font-medium">
          Modern queue management for modern service and business
        </p>
      </div>

      {/* RIGHT SIDE: The Login Card */}
      <div className="flex items-center justify-center p-4 md:p-8">

        {/* THE CARD */}
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">

          {/* Card Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1B4D3E]">Welcome Back</h2>
            <p className="text-gray-500 mt-3">
              Sign in to access and manage your queues
            </p>
          </div>

          {/* Error Alert Message */}
          {errorMessage && (
            <Alert variant="destructive" className="bg-red-50 text-red-600 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Form - 5. Attach the submit handler */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* CHANGED: Username Field to Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1B4D3E] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email" // Changed type to email
                placeholder="Enter your email"
                // 6. Bind value and onChange to state
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-6 bg-gray-100/50 border-gray-200 rounded-xl focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1B4D3E] font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                // 6. Bind value and onChange to state
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-6 bg-gray-100/50 border-gray-200 rounded-xl focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              // 7. Disable button while loading
              disabled={isLoading}
              className="w-full py-6 text-lg font-semibold bg-[#1B4D3E] hover:bg-[#153a2f] text-white rounded-xl mt-4 disabled:opacity-70"
            >
              {/* Change text based on loading state */}
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Card Footer Links (Unchanged) */}
          <div className="text-center space-y-4 text-sm text-gray-600">
            <p>
              Dont have account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#1B4D3E] hover:underline"
              >
                Sign up
              </Link>
            </p>
            <Link
              href="/forgot-password"
              className="block font-semibold text-[#1B4D3E] hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}