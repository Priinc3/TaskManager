import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isPast, isThisWeek } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDueDate(date: Date | string | null): string {
    if (!date) return "";
    const d = new Date(date);

    if (isToday(d)) return `Today at ${format(d, "h:mm a")}`;
    if (isTomorrow(d)) return `Tomorrow at ${format(d, "h:mm a")}`;
    if (isThisWeek(d)) return format(d, "EEEE 'at' h:mm a");

    return format(d, "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(date: Date | string): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(date: Date | string | null): boolean {
    if (!date) return false;
    return isPast(new Date(date));
}

export function getPriorityColor(priority: string): string {
    switch (priority) {
        case "high":
            return "text-danger-500";
        case "medium":
            return "text-warning-500";
        case "low":
            return "text-success-500";
        default:
            return "text-slate-500";
    }
}

export function getStatusColor(status: string): string {
    switch (status) {
        case "todo":
            return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300";
        case "in_progress":
            return "bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400";
        case "completed":
            return "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400";
        case "archived":
            return "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

export function generateId(): string {
    return crypto.randomUUID();
}
