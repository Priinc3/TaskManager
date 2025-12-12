"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTaskStore } from "@/store/taskStore";
import { TaskForm } from "@/components/tasks";
import { Button } from "@/components/ui";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Circle,
    CheckCircle2,
} from "lucide-react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addMonths,
    subMonths,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

export default function CalendarPage() {
    const supabase = createClient();
    const { tasks, setTasks, openTaskForm, addTask } = useTaskStore();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .order("due_date", { ascending: true });

            if (data && !error) {
                setTasks(data as Task[]);
            }
            setIsLoading(false);
        };

        fetchTasks();
    }, [supabase, setTasks]);

    const handleCreateTask = async (data: Partial<Task>) => {
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

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    const getTasksForDay = (date: Date) => {
        return tasks.filter((task) =>
            task.due_date && isSameDay(new Date(task.due_date), date)
        );
    };

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Calendar
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        View your tasks by date
                    </p>
                </div>
                <Button onClick={() => openTaskForm()}>
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </div>

            <div className="card p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setCurrentMonth(new Date())}
                            className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Week Days */}
                        <div className="grid grid-cols-7 mb-2">
                            {weekDays.map((day) => (
                                <div
                                    key={day}
                                    className="py-2 text-center text-sm font-medium text-slate-500 dark:text-slate-400"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day) => {
                                const dayTasks = getTasksForDay(day);
                                const isCurrentMonth = isSameMonth(day, currentMonth);
                                const isCurrentDay = isToday(day);

                                return (
                                    <div
                                        key={day.toISOString()}
                                        className={cn(
                                            "min-h-[100px] p-2 rounded-lg border transition-colors",
                                            isCurrentMonth
                                                ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                                                : "bg-slate-50 dark:bg-slate-900 border-transparent",
                                            isCurrentDay && "ring-2 ring-primary-500"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium mb-1",
                                                isCurrentDay
                                                    ? "bg-primary-500 text-white"
                                                    : isCurrentMonth
                                                        ? "text-slate-900 dark:text-white"
                                                        : "text-slate-400 dark:text-slate-500"
                                            )}
                                        >
                                            {format(day, "d")}
                                        </div>
                                        <div className="space-y-1">
                                            {dayTasks.slice(0, 3).map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={cn(
                                                        "flex items-center gap-1 px-1.5 py-0.5 rounded text-xs truncate",
                                                        task.status === "completed"
                                                            ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300"
                                                            : task.priority === "high"
                                                                ? "bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300"
                                                                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                                    )}
                                                >
                                                    {task.status === "completed" ? (
                                                        <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                                                    ) : (
                                                        <Circle className="h-3 w-3 flex-shrink-0" />
                                                    )}
                                                    <span className="truncate">{task.title}</span>
                                                </div>
                                            ))}
                                            {dayTasks.length > 3 && (
                                                <div className="text-xs text-slate-500 dark:text-slate-400 px-1.5">
                                                    +{dayTasks.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <TaskForm onSubmit={handleCreateTask} />
        </div>
    );
}
