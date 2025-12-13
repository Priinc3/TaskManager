"use client";

import { SupabaseProvider } from "@/lib/supabase/SupabaseProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <SupabaseProvider>
                {children}
            </SupabaseProvider>
        </ErrorBoundary>
    );
}
