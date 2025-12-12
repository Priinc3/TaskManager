import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar />
            <div className="pl-64">
                <Header
                    user={{
                        email: user.email,
                        full_name: user.user_metadata?.full_name,
                    }}
                />
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
