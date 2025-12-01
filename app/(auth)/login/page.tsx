// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    // Main Container: Overall light green background
    <div className="w-full min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#E8F3E8]">

      {/* LEFT SIDE: Branding Text */}
      <div className="hidden md:flex flex-col justify-center items-start p-16 text-[#1B4D3E]">
        {/* Placeholder text for the logo area */}
        <h1 className="text-6xl font-bold mb-6 flex items-center gap-2">
          {/* Placeholder for logo icon */}
          <div className="h-12 w-12 bg-[#1B4D3E] rounded-lg"></div>
          Queuely
        </h1>
        <p className="text-2xl font-medium max-w-md">
          Modern queue management for modern service and business
        </p>
      </div>

      {/* RIGHT SIDE: The Login Card */}
      <div className="flex items-center justify-center p-4 md:p-8">

        {/* THE CARD: White background, deep shadow, rounded corners */}
        <div className="w-full max-w-[450px] bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">

          {/* Card Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1B4D3E]">Welcome Back</h2>
            <p className="text-gray-500 mt-3">
              Sign in to access and manage your queues
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Username Field (Simple input, no icons) */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#1B4D3E] font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                // Using a slightly darker gray bg for input as seen in image
                className="py-6 bg-gray-100/50 border-gray-200 rounded-xl focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Password Field (Simple input, no icons) */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1B4D3E] font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="py-6 bg-gray-100/50 border-gray-200 rounded-xl focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-0"
                required
              />
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              // Dark green background to match image
              className="w-full py-6 text-lg font-semibold bg-[#1B4D3E] hover:bg-[#153a2f] text-white rounded-xl mt-4"
            >
              Sign In
            </Button>
          </form>

          {/* Card Footer Links */}
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