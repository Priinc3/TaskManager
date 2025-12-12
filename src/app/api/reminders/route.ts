import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// This endpoint is called by n8n to get pending reminders
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    // Simple API key auth for n8n
    if (authHeader !== `Bearer ${process.env.N8N_API_KEY}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get reminders that are due and not sent
    const now = new Date().toISOString();
    const { data: reminders, error } = await supabase
        .from("reminders")
        .select(`
      *,
      task:tasks(title, description, due_date, priority),
      user:profiles(full_name)
    `)
        .eq("is_sent", false)
        .lte("remind_at", now)
        .order("remind_at", { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Also get user emails for notifications
    const userIds = [...new Set(reminders?.map((r) => r.user_id) || [])];
    const { data: users } = await supabase.auth.admin.listUsers();

    const userEmails = users?.users.reduce((acc, user) => {
        if (userIds.includes(user.id)) {
            acc[user.id] = user.email;
        }
        return acc;
    }, {} as Record<string, string | undefined>) || {};

    const remindersWithEmail = reminders?.map((r) => ({
        ...r,
        user_email: userEmails[r.user_id],
    }));

    return NextResponse.json({ reminders: remindersWithEmail });
}

// This endpoint is called by n8n after sending notification
export async function POST(request: NextRequest) {
    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.N8N_API_KEY}`) {
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

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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
