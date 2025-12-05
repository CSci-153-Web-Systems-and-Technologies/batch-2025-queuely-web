// src/app/(user)/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { User, LogOut, Users as UsersIcon, Clock as ClockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function UserDashboardPage() {
  // --- SIMULATED STATE ---
  // Set this to `null` to see the "Get Number" view.
  // Set it to the ticket object to see the "Active Ticket" view.
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  // const [activeTicket, setActiveTicket] = useState({
  //   number: 40,
  //   currentPosition: 3,
  //   totalInLine: 28,
  //   estimatedWait: "~5 mins",
  //   serviceAround: "2:38",
  //   priority: "Yes",
  //   joined: "1:44",
  // });

  const user = { name: "Ricky" };

  const handleGetNumber = () => {
    // In a real app, this would call an API to join a queue.
    // For now, we'll just simulate getting a ticket.
    setActiveTicket({
      number: 41,
      currentPosition: 29,
      totalInLine: 29,
      estimatedWait: "~45 mins",
      serviceAround: "3:30",
      priority: "No",
      joined: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const handleLeaveQueue = () => {
    // Simulate leaving the queue
    setActiveTicket(null);
  };

  return (
    <div className="min-h-screen bg-[#E8F3E8] p-4 md:p-8">
      {/* --- TOP BAR --- */}
      <header className="max-w-2xl mx-auto flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-[#1B4D3E] rounded-lg"></div>
          <h1 className="text-3xl font-bold text-[#1B4D3E]">Queuely</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Link to the new Profile page */}
          <Link href="/profile">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#1B4D3E] hover:bg-[#1B4D3E]/10"
            >
              <User className="h-6 w-6" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#1B4D3E] hover:bg-[#1B4D3E]/10"
          >
            <LogOut className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-md mx-auto space-y-6">
        <p className="text-lg text-[#1B4D3E] font-medium">Hello, {user.name}</p>

        {/* CONDITIONAL RENDERING BASED ON activeTicket STATE */}
        {activeTicket ? (
          // --- VIEW 1: ACTIVE TICKET ---
          <>
            <Card className="bg-white border-none shadow-lg overflow-hidden rounded-2xl">
              <div className="bg-[#1B4D3E] p-8 text-center text-white">
                <h2 className="text-xl font-medium opacity-90">
                  Your Ticket Number
                </h2>
                <div className="text-7xl font-bold mt-2">
                  {activeTicket.number}
                </div>
              </div>
              <CardContent className="p-6 space-y-6">
                {/* ... ticket details (same as before) ... */}
                <div className="bg-[#E8F3E8] rounded-xl p-6 flex flex-col items-center justify-center text-center">
                  <p className="text-[#1B4D3E] font-medium flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" /> Current Position
                  </p>
                  <div className="text-4xl font-bold text-[#1B4D3E] mt-2">
                    {activeTicket.currentPosition}
                  </div>
                  <p className="text-sm text-[#1B4D3E]/70 mt-1">
                    of {activeTicket.totalInLine} people in line
                  </p>
                </div>
                {/* ... other ticket details ... */}
                <Separator className="bg-gray-200" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Priority:</span>
                    <span className="font-medium text-[#1B4D3E] bg-[#1B4D3E]/10 px-3 py-1 rounded-full">
                      {activeTicket.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Joined:</span>
                    <span className="font-medium text-[#1B4D3E]">
                      {activeTicket.joined}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  onClick={handleLeaveQueue}
                  className="w-full py-6 text-lg font-bold text-[#1B4D3E] bg-[#F4E08F] hover:bg-[#eacf6a] rounded-xl shadow-sm transition-all hover:shadow-md"
                >
                  Leave Queue
                </Button>
              </CardFooter>
            </Card>
            <div className="bg-[#6A9A8B] text-white p-4 rounded-xl text-sm shadow-sm">
              <p>
                <span className="font-bold">Queue Updates:</span> You've been
                added to the end of the queue.
              </p>
              <p className="text-white/70 text-xs mt-1">Just now</p>
            </div>
          </>
        ) : (
          // --- VIEW 2: NO TICKET ("Get Number") ---
          <Card className="bg-white border-none shadow-lg overflow-hidden rounded-2xl text-center p-8 space-y-6">
            <CardContent className="p-0 space-y-4">
              <div className="h-24 w-24 bg-[#E8F3E8] rounded-full flex items-center justify-center mx-auto">
                <UsersIcon className="h-12 w-12 text-[#1B4D3E]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B4D3E]">
                Not in a Queue yet?
              </h2>
              <p className="text-gray-500">
                Get a ticket number to start queuing for a service.
              </p>
            </CardContent>
            <CardFooter className="p-0 pt-4">
              <Button
                onClick={handleGetNumber}
                className="w-full py-6 text-lg font-bold text-white bg-[#1B4D3E] hover:bg-[#153a2f] rounded-xl shadow-sm"
              >
                Get a Number
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}