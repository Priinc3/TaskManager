import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
    // Only create client in browser and cache it
    if (typeof window === "undefined") {
        // Return a mock during SSR that won't throw
        return null as unknown as ReturnType<typeof createBrowserClient>;
    }

    if (supabaseClient) {
        return supabaseClient;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("Missing Supabase environment variables");
        // Return a mock that won't crash the app
        return null as unknown as ReturnType<typeof createBrowserClient>;
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return supabaseClient;
}
