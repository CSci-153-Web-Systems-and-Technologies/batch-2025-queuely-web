// src/lib/queue-service.ts
import { SupabaseClient } from "@supabase/supabase-js";

// CONSTANTS
const AVG_WAIT_TIME_MINS = 5;

/**
 * Calculates a specific ticket's position and estimated wait time.
 */
export async function getQueueMetrics(
    supabase: SupabaseClient,
    serviceName: string,
    ticketCreatedAt: string
    ) {
    // 1. Get Total in Line
    const { count: totalCount } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .eq("service_name", serviceName)
        .eq("status", "waiting");

    // 2. Get Position (People ahead)
    const { count: peopleAhead } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .eq("service_name", serviceName)
        .eq("status", "waiting")
        .lt("created_at", ticketCreatedAt);

    const position = (peopleAhead || 0) + 1;
    const total = totalCount || 0;
    const waitTime = (position - 1) * AVG_WAIT_TIME_MINS;
    
    const serviceTime = new Date(Date.now() + waitTime * 60 * 1000);
    const serviceAround = serviceTime.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit'
    });

    return {
        position,
        totalInLine: total,
        estimatedWait: position === 1 ? "Next!" : `~${waitTime} mins`,
        serviceAround,
  };
}

/**
 * Joins a queue for a specific service.
 */
export async function joinQueue(
  supabase: SupabaseClient,
  userId: string,
  serviceName: string
) {
  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        user_id: userId,
        service_name: serviceName,
        status: "waiting",
        is_priority: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Leaves (Cancels) a ticket.
 */
export async function leaveQueue(supabase: SupabaseClient, ticketId: string) {
  const { error } = await supabase
    .from("tickets")
    .update({ status: "cancelled" })
    .eq("id", ticketId);

  if (error) throw error;
  return true;
}

/**
 * Formats a timestamp into a readable time (e.g. 2:30 PM)
 */
export function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}