export const APP_NAME = "TaskFlow";
export const APP_DESCRIPTION = "Smart task management with intelligent reminders";

export const PRIORITIES = [
    { value: "high", label: "High", color: "danger" },
    { value: "medium", label: "Medium", color: "warning" },
    { value: "low", label: "Low", color: "success" },
] as const;

export const STATUSES = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "archived", label: "Archived" },
] as const;

export const RECURRENCE_OPTIONS = [
    { value: "none", label: "Don't repeat" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "custom", label: "Custom" },
] as const;

export const REMINDER_PRESETS = [
    { value: 0, label: "At time of event" },
    { value: 5, label: "5 minutes before" },
    { value: 15, label: "15 minutes before" },
    { value: 30, label: "30 minutes before" },
    { value: 60, label: "1 hour before" },
    { value: 1440, label: "1 day before" },
] as const;

export const DEFAULT_CATEGORIES = [
    { name: "Work", color: "#3b82f6", icon: "briefcase" },
    { name: "Personal", color: "#8b5cf6", icon: "user" },
    { name: "Shopping", color: "#f59e0b", icon: "shopping-cart" },
    { name: "Health", color: "#22c55e", icon: "heart" },
    { name: "Finance", color: "#06b6d4", icon: "dollar-sign" },
];

export const KEYBOARD_SHORTCUTS = {
    newTask: "n",
    search: "/",
    toggleSidebar: "b",
    today: "t",
    upcoming: "u",
};
