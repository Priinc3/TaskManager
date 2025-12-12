import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface CookieToSet {
    name: string;
    value: string;
    options?: Record<string, unknown>;
}

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // During build time, env vars might not be available
    if (!supabaseUrl || !supabaseAnonKey) {
        return createServerClient(
            "https://placeholder.supabase.co",
            "placeholder-key",
            {
                cookies: {
                    getAll() { return []; },
                    setAll() { },
                },
            }
        );
    }

    const cookieStore = await cookies();

    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
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
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );
}
