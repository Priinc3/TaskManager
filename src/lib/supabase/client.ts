import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

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
