"use client";

import { Select } from "@/components/ui";
import { useTaskStore } from "@/store/taskStore";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import { LayoutList, Kanban, Calendar, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/lib/types";

export function TaskFilters() {
    const { filters, setFilters, viewMode, setViewMode, categories } = useTaskStore();

    const priorityOptions = [
        { value: "all", label: "All Priorities" },
        ...PRIORITIES.map((p) => ({ value: p.value, label: p.label })),
    ];

    const statusOptions = [
        { value: "all", label: "All Statuses" },
        ...STATUSES.filter((s) => s.value !== "archived").map((s) => ({
            value: s.value,
            label: s.label,
        })),
    ];

    const categoryOptions = [
        { value: "", label: "All Categories" },
        ...categories.map((c) => ({ value: c.id, label: c.name })),
    ];

    const viewModes: { value: ViewMode; icon: typeof LayoutList; label: string }[] = [
        { value: "list", icon: LayoutList, label: "List" },
        { value: "board", icon: Kanban, label: "Board" },
        { value: "calendar", icon: Calendar, label: "Calendar" },
    ];

    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            {/* Filters */}
            <div className="flex items-center gap-3">
                <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                <div className="flex gap-2">
                    <select
                        value={filters.status || "all"}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                        className="input py-1.5 px-3 text-sm w-auto"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.priority || "all"}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                        className="input py-1.5 px-3 text-sm w-auto"
                    >
                        {priorityOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {categories.length > 0 && (
                        <select
                            value={filters.category_id || ""}
                            onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}
                            className="input py-1.5 px-3 text-sm w-auto"
                        >
                            {categoryOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {viewModes.map((mode) => (
                    <button
                        key={mode.value}
                        onClick={() => setViewMode(mode.value)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                            viewMode === mode.value
                                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                        )}
                    >
                        <mode.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
