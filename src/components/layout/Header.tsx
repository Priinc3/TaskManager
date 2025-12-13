"use client";

import { useState } from "react";
import { Search, Bell, Moon, Sun, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui";
import { useTaskStore } from "@/store/taskStore";

interface HeaderProps {
    user?: {
        email?: string;
        full_name?: string;
    };
}

export function Header({ user }: HeaderProps) {
    const [isDark, setIsDark] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { setFilters, filters } = useTaskStore();
    const router = useRouter();
    const supabase = createClient();

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
    };

    const handleSignOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        }
        router.push("/login");
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ ...filters, search: e.target.value });
    };

    return (
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
            {/* Search */}
            <div className="w-96">
                <Input
                    type="search"
                    placeholder="Search tasks..."
                    icon={<Search className="h-4 w-4" />}
                    onChange={handleSearch}
                    value={filters.search || ""}
                />
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {isDark ? (
                        <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    ) : (
                        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    )}
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                    <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                </button>

                {/* User menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-fuchsia-400 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {user?.full_name || user?.email?.split("@")[0] || "User"}
                        </span>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 card p-1 animate-slide-down z-50">
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
