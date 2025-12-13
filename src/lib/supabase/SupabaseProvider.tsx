"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

// Hardcoded credentials - these are public anon keys safe for frontend
const SUPABASE_URL = "https://dwyzgcjnvqramqurhmzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3eXpnY2pudnFyYW1xdXJobXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjEwNTksImV4cCI6MjA4MTEzNzA1OX0.FDmuZHxNwJQqqmAK84_aNW9ql7FFFPjh-bID-FkhxdE";

// Create the client type from the return type
type SupabaseClientType = ReturnType<typeof createBrowserClient>;

type SupabaseContextType = {
    supabase: SupabaseClientType | null;
    isLoading: boolean;
    error: string | null;
};

const SupabaseContext = createContext<SupabaseContextType>({
    supabase: null,
    isLoading: true,
    error: null,
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase, setSupabase] = useState<SupabaseClientType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            console.log("Initializing Supabase client...");
            const client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            setSupabase(client);
            console.log("Supabase client initialized successfully");
        } catch (err) {
            console.error("Failed to initialize Supabase:", err);
            setError(err instanceof Error ? err.message : "Failed to initialize database connection");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <SupabaseContext.Provider value={{ supabase, isLoading, error }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export function useSupabase() {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error("useSupabase must be used within a SupabaseProvider");
    }
    return context;
}
