// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // CHANGE THIS LINE: Redirect to the new overview path
  redirect("/dashboard/dashboard-overview");
}