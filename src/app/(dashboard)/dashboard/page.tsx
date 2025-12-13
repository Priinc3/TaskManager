"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTaskStore } from "@/store/taskStore";
import { TaskForm, TaskList, TaskFilters } from "@/components/tasks";
import {
    CheckCircle2,
    Clock,
    AlertCircle,
    TrendingUp,
    Calendar,
    Plus,
} from "lucide-react";
import { Button } from "@/components/ui";
import { isToday, isPast } from "date-fns";
import type { Task } from "@/lib/types";

export default function DashboardPage() {
    const supabase = createClient();
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
    const stats = getTaskStats();
    const filteredTasks = getFilteredTasks();

    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from("tasks")
                .select("*, subtasks(*), category:categories(*)")
                .order("created_at", { ascending: false });

            if (data && !error) {
                setTasks(data as Task[]);
            }
            setIsLoading(false);
        };

        fetchTasks();

        const channel = supabase
            .channel("tasks")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "tasks" },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        addTask(payload.new as Task);
                    } else if (payload.eventType === "UPDATE") {
                        updateTask(payload.new.id, payload.new as Task);
                    } else if (payload.eventType === "DELETE") {
                        deleteTask(payload.old.id);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, setTasks, addTask, updateTask, deleteTask]);

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

    const handleCreateTask = async (data: Partial<Task>) => {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: newTask, error } = await supabase
            .from("tasks")
            .insert({
                ...data,
                user_id: user.id,
                status: "todo",
            })
            .select()
            .single();

        if (newTask && !error) {
            addTask(newTask as Task);
        }
    };

    const handleUpdateTask = async (task: Task) => {
        if (!supabase) return;
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
    };

    const handleDeleteTask = async (id: string) => {
        if (!supabase) return;
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (!error) {
            deleteTask(id);
        }
    };

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
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <TaskList
                        tasks={todayTasks}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                    />
                )}
            </div>

            <div className="card p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    All Tasks
                </h2>
                <TaskFilters />
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <TaskList
                        tasks={filteredTasks}
                        onUpdate={handleUpdateTask}
                        onDelete={handleDeleteTask}
                    />
                )}
            </div>

            <TaskForm onSubmit={handleCreateTask} />
        </div>
    );
}
