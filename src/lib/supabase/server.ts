import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Hardcoded credentials
const SUPABASE_URL = "https://dwyzgcjnvqramqurhmzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3eXpnY2pudnFyYW1xdXJobXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjEwNTksImV4cCI6MjA4MTEzNzA1OX0.FDmuZHxNwJQqqmAK84_aNW9ql7FFFPjh-bID-FkhxdE";

interface CookieToSet {
    name: string;
    value: string;
    options?: Record<string, unknown>;
}

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: CookieToSet[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignore errors
                    }
                },
            },
        }
    );
}
