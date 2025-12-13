import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Hardcoded credentials
const SUPABASE_URL = "https://dwyzgcjnvqramqurhmzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3eXpnY2pudnFyYW1xdXJobXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjEwNTksImV4cCI6MjA4MTEzNzA1OX0.FDmuZHxNwJQqqmAK84_aNW9ql7FFFPjh-bID-FkhxdE";

interface CookieToSet {
    name: string;
    value: string;
    options?: Record<string, unknown>;
}

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: CookieToSet[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh session
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
    const isAuthRoute = request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/signup");
    const isPublicRoute = request.nextUrl.pathname === "/";

    if (!user && !isAuthRoute && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
