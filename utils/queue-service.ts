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

  // 2. Get Position
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

export async function joinQueue(
  supabase: SupabaseClient,
  userId: string,
  serviceName: string
) {
  // 1. CHECK for existing ticket
  const { data: existingTicket } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["waiting", "serving"])
    .single();

  if (existingTicket) {
    throw new Error("You already have an active ticket.");
  }

  // 2. INSERT new ticket
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
 * LEAVE QUEUE (Updated for ticket_id)
 */
export async function leaveQueue(supabase: SupabaseClient, ticketId: string) {
  const { error } = await supabase
    .from("tickets")
    .update({ status: "cancelled" })
    .eq("ticket_id", ticketId); // <--- CHANGED THIS from 'id' to 'ticket_id'

  if (error) throw error;
  return true;
}

export function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}



export async function getActiveQueue(supabase: SupabaseClient, serviceName: string) {
  const { data, error } = await supabase
    .from('tickets')
    .select(`
      *, 
      user_id (user_id, first_name, preferred_name)  // Join with user profile data
    `)
    .eq('service_name', serviceName)
    .in('status', ['waiting', 'serving'])
    .order('is_priority', { ascending: false }) // Priority tickets first (True = 1, False = 0)
    .order('created_at', { ascending: true });   // Then by time joined (Oldest first)
  
  if (error) throw error;
  return data;
}

/**
 * Generic function to update a ticket's status (used for Complete/Skip).
 */
export async function updateTicketStatus(
  supabase: SupabaseClient,
  ticketId: string,
  newStatus: 'completed' | 'cancelled'
) {
  const { error, count } = await supabase
    .from("tickets")
    .update({ status: newStatus })
    .eq("ticket_id", ticketId)
    .select('*', { count: 'exact' });

  if (error) throw error;
  if (count === 0) throw new Error(`Ticket ${ticketId} not found or already processed.`);
  return true;
}


/**
 * Moves the queue forward: marks the current serving ticket as 'completed',
 * and calls the next highest priority 'waiting' ticket.
 */
export async function callNextInLine(
  supabase: SupabaseClient,
  currentServingTicketId: string | null,
  serviceName: string
) {
  let nextTicket = null;

  // 1. Mark currently serving ticket as 'completed'
  if (currentServingTicketId) {
    await updateTicketStatus(supabase, currentServingTicketId, 'completed');
  }

  // 2. Find the next ticket to serve (sorted by priority and time)
  // This reuses the logic from getActiveQueue but limits to the first result.
  const { data: waitingTickets, error } = await supabase
    .from('tickets')
    .select('ticket_id') 
    .eq('service_name', serviceName)
    .eq('status', 'waiting')
    .order('is_priority', { ascending: false }) // Priority first
    .order('created_at', { ascending: true })   // Oldest time second
    .limit(1);

  if (error) throw error;

  // 3. Update the found ticket to 'serving'
  if (waitingTickets && waitingTickets.length > 0) {
    nextTicket = waitingTickets[0];
    await updateTicketStatus(supabase, nextTicket.ticket_id, 'serving');
  }

  return nextTicket;
}