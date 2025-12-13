"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useTaskStore } from "@/store/taskStore";
import { TaskForm, TaskList, TaskFilters } from "@/components/tasks";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Calendar,
    Plus,
    Loader2,
    AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui";
import { isToday, isPast } from "date-fns";
import type { Task } from "@/lib/types";

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 text-sky-500 animate-spin mb-4" />
            <p className="text-slate-500">Loading dashboard...</p>
        </div>
    );
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24">
            <div className="p-4 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Connection Error
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-4">
                {message}
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}

export default function DashboardPage() {
    const { supabase, isLoading: supabaseLoading, error: supabaseError } = useSupabase();
    const {
        tasks,
        setTasks,
        getFilteredTasks,
        getTaskStats,
        openTaskForm,
        addTask,
        updateTask,
        deleteTask,
    } = useTaskStore();

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const stats = getTaskStats();
    const filteredTasks = getFilteredTasks();

    useEffect(() => {
        if (supabaseLoading) return;

        if (!supabase) {
            setIsLoading(false);
            return;
        }

        const fetchTasks = async () => {
            try {
                console.log("Fetching tasks...");
                const { data, error } = await supabase
                    .from("tasks")
                    .select("*, subtasks(*), category:categories(*)")
                    .order("created_at", { ascending: false });

                if (error) {
                    console.error("Error fetching tasks:", error);
                    setFetchError(error.message);
                } else if (data) {
                    console.log("Tasks fetched:", data.length);
                    setTasks(data as Task[]);
                }
            } catch (err) {
                console.error("Exception fetching tasks:", err);
                setFetchError("Failed to fetch tasks");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();

        const channel = supabase
            .channel("tasks-realtime")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "tasks" },
                (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
                    console.log("Realtime event:", payload.eventType);
                    if (payload.eventType === "INSERT") {
                        addTask(payload.new as unknown as Task);
                    } else if (payload.eventType === "UPDATE") {
                        updateTask(payload.new.id as string, payload.new as unknown as Task);
                    } else if (payload.eventType === "DELETE") {
                        deleteTask(payload.old.id as string);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, supabaseLoading, setTasks, addTask, updateTask, deleteTask]);

    const todayTasks = tasks.filter(
        (t) => t.due_date && isToday(new Date(t.due_date)) && t.status !== "completed"
    );

    const overdueTasks = tasks.filter(
        (t) =>
            t.due_date &&
            isPast(new Date(t.due_date)) &&
            !isToday(new Date(t.due_date)) &&
            t.status !== "completed"
    );

    const handleCreateTask = async (data: Partial<Task> & { reminder_minutes?: number }) => {
        if (!supabase) return;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Extract reminder_minutes before inserting task
            const { reminder_minutes, ...taskData } = data;
            console.log("Creating task with reminder_minutes:", reminder_minutes);

            const { data: newTask, error } = await supabase
                .from("tasks")
                .insert({
                    ...taskData,
                    user_id: user.id,
                    status: "todo",
                })
                .select()
                .single();

            if (newTask && !error) {
                addTask(newTask as Task);
                console.log("Task created:", newTask.id, "due_date:", newTask.due_date);

                // Create a reminder if reminder_minutes is set (>= 0) and task has a due_date
                if (reminder_minutes !== undefined && reminder_minutes >= 0 && newTask.due_date) {
                    const dueDate = new Date(newTask.due_date);
                    const remindAt = new Date(dueDate.getTime() - reminder_minutes * 60 * 1000);
                    console.log("Creating reminder for:", remindAt.toISOString());

                    const { error: reminderError } = await supabase.from("reminders").insert({
                        task_id: newTask.id,
                        user_id: user.id,
                        remind_at: remindAt.toISOString(),
                        is_sent: false,
                    });

                    if (reminderError) {
                        console.error("Error creating reminder:", reminderError);
                    } else {
                        console.log("Reminder created successfully!");
                    }
                }
            } else if (error) {
                console.error("Error creating task:", error);
            }
        } catch (err) {
            console.error("Error creating task:", err);
        }
    };

    const handleUpdateTask = async (task: Task) => {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from("tasks")
                .update({
                    status: task.status,
                    completed_at: task.completed_at,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", task.id);

            if (!error) {
                updateTask(task.id, task);
            }
        } catch (err) {
            console.error("Error updating task:", err);
        }
    };

    const handleDeleteTask = async (id: string) => {
        if (!supabase) return;
        try {
            const { error } = await supabase.from("tasks").delete().eq("id", id);
            if (!error) {
                deleteTask(id);
            }
        } catch (err) {
            console.error("Error deleting task:", err);
        }
    };

    // Show loading state
    if (supabaseLoading || isLoading) {
        return <LoadingState />;
    }

    // Show error state
    if (supabaseError || fetchError) {
        return <ErrorState message={supabaseError || fetchError || "Unknown error"} />;
    }

    const statCards = [
        {
            label: "Total Tasks",
            value: stats.total,
            icon: CheckCircle2,
            color: "text-sky-500",
            bgColor: "bg-sky-50 dark:bg-sky-900/20",
        },
        {
            label: "In Progress",
            value: stats.in_progress,
            icon: Clock,
            color: "text-amber-500",
            bgColor: "bg-amber-50 dark:bg-amber-900/20",
        },
        {
            label: "Completed",
            value: stats.completed,
            icon: TrendingUp,
            color: "text-green-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
        },
        {
            label: "Overdue",
            value: stats.overdue,
            icon: AlertCircle,
            color: "text-red-500",
            bgColor: "bg-red-50 dark:bg-red-900/20",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Welcome back! Here&apos;s your task overview.
                    </p>
                </div>
                <Button onClick={() => openTaskForm()}>
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div key={stat.label} className="card p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {overdueTasks.length > 0 && (
                <div className="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        <div>
                            <p className="font-medium text-red-700 dark:text-red-300">
                                You have {overdueTasks.length} overdue task{overdueTasks.length > 1 ? "s" : ""}
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400">
                                Review and update your task deadlines
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="h-5 w-5 text-sky-500" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Today&apos;s Tasks
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-sm font-medium">
                        {todayTasks.length}
                    </span>
                </div>
                <TaskList
                    tasks={todayTasks}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                />
            </div>

            <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    All Tasks
                </h2>
                <TaskFilters />
                <TaskList
                    tasks={filteredTasks}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                />
            </div>

            <TaskForm onSubmit={handleCreateTask} />
        </div>
    );
}
