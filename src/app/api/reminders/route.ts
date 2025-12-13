import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Hardcoded credentials
const SUPABASE_URL = "https://dwyzgcjnvqramqurhmzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3eXpnY2pudnFyYW1xdXJobXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjEwNTksImV4cCI6MjA4MTEzNzA1OX0.FDmuZHxNwJQqqmAK84_aNW9ql7FFFPjh-bID-FkhxdE";
const N8N_API_KEY = "taskflow-n8n-api-key-2024";

// This endpoint is called by n8n to get pending reminders
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    // Simple API key auth for n8n
    if (authHeader !== `Bearer ${N8N_API_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Get reminders that are due and not sent
    const now = new Date().toISOString();
    const { data: reminders, error } = await supabase
        .from("reminders")
        .select(`
      *,
      task:tasks(title, description, due_date, priority)
    `)
        .eq("is_sent", false)
        .lte("remind_at", now)
        .order("remind_at", { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get user info from profiles
    const userIds = [...new Set(reminders?.map((r) => r.user_id) || [])];

    let remindersWithEmail = reminders || [];

    if (userIds.length > 0) {
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", userIds);

        const userInfo = profiles?.reduce((acc, profile) => {
            acc[profile.id] = { full_name: profile.full_name, email: profile.email };
            return acc;
        }, {} as Record<string, { full_name: string; email: string }>) || {};

        remindersWithEmail = reminders?.map((r) => ({
            ...r,
            user_email: userInfo[r.user_id]?.email,
            user: { full_name: userInfo[r.user_id]?.full_name },
        })) || [];
    }

    return NextResponse.json({ reminders: remindersWithEmail });
}

// This endpoint is called by n8n after sending notification
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${N8N_API_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reminder_ids } = body;

    if (!reminder_ids || !Array.isArray(reminder_ids)) {
        return NextResponse.json(
            { error: "reminder_ids array required" },
            { status: 400 }
        );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Mark reminders as sent
    const { error } = await supabase
        .from("reminders")
        .update({ is_sent: true })
        .in("id", reminder_ids);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, marked_sent: reminder_ids.length });
}
