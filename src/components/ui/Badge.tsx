import { cn } from "@/lib/utils";
import type { Priority } from "@/lib/types";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "priority" | "status";
    priority?: Priority;
    className?: string;
}

export function Badge({
    children,
    variant = "default",
    priority,
    className,
}: BadgeProps) {
    const priorityClasses = {
        high: "badge-priority-high",
        medium: "badge-priority-medium",
        low: "badge-priority-low",
    };

    return (
        <span
            className={cn(
                "badge",
                variant === "priority" && priority && priorityClasses[priority],
                variant === "default" &&
                "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
                className
            )}
        >
            {children}
        </span>
    );
}
