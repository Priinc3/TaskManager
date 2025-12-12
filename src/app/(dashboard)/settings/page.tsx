"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, Input, Select } from "@/components/ui";
import { User, Bell, Palette, Moon, Sun, Save } from "lucide-react";

export default function SettingsPage() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [isDark, setIsDark] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        // Check initial theme
        setIsDark(document.documentElement.classList.contains("dark"));
    }, [supabase]);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setMessage(null);

        // In a real app, you'd update the profile here
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setMessage({ type: "success", text: "Settings saved successfully!" });
        setIsSaving(false);
    };

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Manage your account and preferences
                </p>
            </div>

            {message && (
                <div
                    className={`p-4 rounded-xl ${message.type === "success"
                            ? "bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300"
                            : "bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-300"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Profile Section */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                        <User className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Profile
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your personal information
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <Input
                        label="Full Name"
                        defaultValue={user?.user_metadata?.full_name || ""}
                        placeholder="Your name"
                    />
                    <Input
                        label="Email"
                        type="email"
                        defaultValue={user?.email || ""}
                        disabled
                    />
                </div>
            </div>

            {/* Appearance Section */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-accent-100 dark:bg-accent-900/30">
                        <Palette className="h-5 w-5 text-accent-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Appearance
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Customize how TaskFlow looks
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-900 dark:text-white">
                            Dark Mode
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Toggle between light and dark themes
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors"
                    >
                        <div
                            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-md transition-all flex items-center justify-center ${isDark ? "left-7" : "left-1"
                                }`}
                        >
                            {isDark ? (
                                <Moon className="h-3.5 w-3.5 text-slate-600" />
                            ) : (
                                <Sun className="h-3.5 w-3.5 text-amber-500" />
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-warning-100 dark:bg-warning-900/30">
                        <Bell className="h-5 w-5 text-warning-600" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">
                            Notifications
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Configure your reminder preferences
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                                Push Notifications
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Receive browser notifications for reminders
                            </p>
                        </div>
                        <button className="relative w-14 h-8 rounded-full bg-primary-500 transition-colors">
                            <div className="absolute top-1 left-7 w-6 h-6 rounded-full bg-white shadow-md transition-all" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                                Email Reminders
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Get email notifications for upcoming tasks
                            </p>
                        </div>
                        <button className="relative w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors">
                            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-md transition-all" />
                        </button>
                    </div>

                    <Select
                        label="Default Reminder Time"
                        options={[
                            { value: "5", label: "5 minutes before" },
                            { value: "15", label: "15 minutes before" },
                            { value: "30", label: "30 minutes before" },
                            { value: "60", label: "1 hour before" },
                            { value: "1440", label: "1 day before" },
                        ]}
                        defaultValue="30"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSaveProfile} isLoading={isSaving}>
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
