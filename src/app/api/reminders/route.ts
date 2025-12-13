import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Hardcoded credentials
const SUPABASE_URL = "https://dwyzgcjnvqramqurhmzt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3eXpnY2pudnFyYW1xdXJobXp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1NjEwNTksImV4cCI6MjA4MTEzNzA1OX0.FDmuZHxNwJQqqmAK84_aNW9ql7FFFPjh-bID-FkhxdE";
const N8N_API_KEY = "taskflow-n8n-api-key-2024";

function createSupabaseClient() {
    return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return [];
            },
            setAll() {
                // No-op for API routes
            },
        },
    });
}

// GET: Fetch pending reminders for n8n
export async function GET(request: NextRequest) {
    // Verify API key
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${N8N_API_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createSupabaseClient();

    // Get reminders that are due and not yet sent
    const now = new Date().toISOString();
    const { data: reminders, error } = await supabase
        .from("reminders")
        .select(`
      id,
      remind_at,
      is_sent,
      task:tasks(
        id,
        title,
        description,
        priority,
        due_date,
        user_id
      )
    `)
        .lte("remind_at", now)
        .eq("is_sent", false)
        .limit(50);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get user emails for each reminder
    const remindersWithEmails = await Promise.all(
        (reminders || []).map(async (reminder) => {
            const task = reminder.task as { user_id: string } | null;
            if (!task?.user_id) return reminder;

            const { data: profile } = await supabase
                .from("profiles")
                .select("email, full_name")
                .eq("id", task.user_id)
                .single();

            return {
                ...reminder,
                user_email: profile?.email,
                user: profile,
            };
        })
    );

    return NextResponse.json({ reminders: remindersWithEmails });
}

// POST: Mark reminders as sent
export async function POST(request: NextRequest) {
    // Verify API key
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${N8N_API_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { reminder_ids } = body;

    if (!reminder_ids || !Array.isArray(reminder_ids)) {
        return NextResponse.json({ error: "Missing reminder_ids" }, { status: 400 });
    }

    const supabase = createSupabaseClient();

    const { error } = await supabase
        .from("reminders")
        .update({ is_sent: true, sent_at: new Date().toISOString() })
        .in("id", reminder_ids);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: reminder_ids.length });
}
