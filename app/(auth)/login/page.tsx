
"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  // State to manage password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    // Main Container: Uses CSS grid to create the 50/50 split on desktop, stacking on mobile.
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT SIDE: Simplified to just a colored background */}
      <div className="bg-[#0A1D56] min-h-[150px] md:min-h-screen">
        {/* The images (logo and illustration) have been removed from here */}
      </div>

      {/* RIGHT SIDE: Login Form (Unchanged) */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#0A1D56]">Login</h1>
            <p className="text-gray-500 mt-2">Welcome back!</p>
          </div>

          {/* Form */}
          <form className="space-y-6">

            {/* Email Field Container */}
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">Email</Label>
              <div className="relative">
                {/* Icon positioned absolutely inside the input container */}
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  // Add padding-left (pl-10) to make room for the icon
                  className="pl-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-[#2F55D4] focus-visible:ring-offset-0"
                  required
                />
              </div>
            </div>

            {/* Password Field Container */}
            <div className="space-y-2">
              <Label htmlFor="password" className="sr-only">Password</Label>
              <div className="relative">
                {/* Lock Icon on the left */}
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  id="password"
                  // Dynamically change type based on state
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  // Add padding left (pl-10) and right (pr-10) for icons
                  className="pl-10 pr-10 py-6 bg-gray-50 border-gray-200 rounded-xl focus-visible:ring-[#2F55D4] focus-visible:ring-offset-0"
                  required
                />
                {/* Eye Icon toggle button on the right */}
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#2F55D4] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full py-6 text-lg bg-[#2F55D4] hover:bg-[#2547b8] text-white rounded-xl"
            >
              Login
            </Button>
          </form>

          {/* Footer / Sign Up Link */}
          <div className="text-center text-sm text-gray-500">
            Don't have an account yet?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#2F55D4] hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}