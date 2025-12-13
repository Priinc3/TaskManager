"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    Settings,
    Plus,
    Sun,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";
import { Button } from "@/components/ui";

const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasks", label: "All Tasks", icon: CheckSquare },
    { href: "/calendar", label: "Calendar", icon: Calendar },
];

const quickFilters = [
    { id: "today", label: "Today", icon: Sun },
    { id: "upcoming", label: "Upcoming", icon: Clock },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
];

export function Sidebar() {
    const pathname = usePathname();
    const { openTaskForm, categories, getTaskStats } = useTaskStore();
    const stats = getTaskStats();

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-fuchsia-500 flex items-center justify-center">
                        <CheckSquare className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gradient">TaskFlow</span>
                </Link>
            </div>

            {/* Add Task Button */}
            <div className="px-4 mb-4">
                <Button onClick={() => openTaskForm()} className="w-full" size="md">
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 overflow-y-auto scrollbar-thin">
                <div className="mb-6">
                    <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Menu
                    </p>
                    <ul className="space-y-1">
                        {mainNavItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        pathname === item.href ? "sidebar-link-active" : "sidebar-link"
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Filters */}
                <div className="mb-6">
                    <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Quick Filters
                    </p>
                    <ul className="space-y-1">
                        {quickFilters.map((filter) => (
                            <li key={filter.id}>
                                <button className="sidebar-link w-full justify-between">
                                    <span className="flex items-center gap-3">
                                        <filter.icon className="h-5 w-5" />
                                        {filter.label}
                                    </span>
                                    {filter.id === "today" && stats.pending > 0 && (
                                        <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs font-medium">
                                            {stats.pending}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Categories */}
                <div className="mb-6">
                    <p className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Categories
                    </p>
                    <ul className="space-y-1">
                        {categories.length > 0 ? (
                            categories.map((category) => (
                                <li key={category.id}>
                                    <button className="sidebar-link w-full">
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: category.color }}
                                        />
                                        {category.name}
                                    </button>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-sm text-slate-400">No categories yet</li>
                        )}
                    </ul>
                </div>
            </nav>

            {/* Settings */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                <Link href="/settings" className="sidebar-link">
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}
