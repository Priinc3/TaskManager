import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

// Hardcoded credentials - these are public anon keys safe for frontend
const SUPABASE_URL = "https://dwyzgcjnvqramqurhmzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3eXpnY2pudnFyYW1xdXJobXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjEwNTksImV4cCI6MjA4MTEzNzA1OX0.FDmuZHxNwJQqqmAK84_aNW9ql7FFFPjh-bID-FkhxdE";

export function createClient() {
    if (typeof window === "undefined") {
        return null as unknown as ReturnType<typeof createBrowserClient>;
    }

    if (supabaseClient) {
        return supabaseClient;
    }

    supabaseClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabaseClient;
}
