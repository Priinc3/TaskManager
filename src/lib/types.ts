export type Priority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "completed" | "archived";
export type Recurrence = "none" | "daily" | "weekly" | "monthly" | "custom";

export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    settings: UserSettings;
    created_at: string;
}

export interface UserSettings {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    default_reminder_time: number; // minutes before due date
}

export interface Category {
    id: string;
    user_id: string;
    name: string;
    color: string;
    icon?: string;
    created_at: string;
}

export interface Task {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    due_date?: string;
    category_id?: string;
    category?: Category;
    tags: string[];
    created_at: string;
    updated_at: string;
    completed_at?: string;
    subtasks?: Subtask[];
    reminders?: Reminder[];
}

export interface Subtask {
    id: string;
    task_id: string;
    title: string;
    is_completed: boolean;
    sort_order: number;
    created_at: string;
}

export interface Reminder {
    id: string;
    task_id: string;
    user_id: string;
    remind_at: string;
    recurrence: Recurrence;
    recurrence_config?: RecurrenceConfig;
    is_sent: boolean;
    created_at: string;
}

export interface RecurrenceConfig {
    interval?: number;
    days_of_week?: number[];
    day_of_month?: number;
    end_date?: string;
}

export interface TaskFilters {
    status?: TaskStatus | "all";
    priority?: Priority | "all";
    category_id?: string;
    search?: string;
    date_range?: {
        start: Date;
        end: Date;
    };
    tags?: string[];
}

export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
    in_progress: number;
}

export type ViewMode = "list" | "board" | "calendar";
