"use client";

import { useEffect, useState } from "react";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useTaskStore } from "@/store/taskStore";
import { TaskForm, TaskList, TaskFilters } from "@/components/tasks";
import { Button } from "@/components/ui";
import { Plus, Loader2, AlertTriangle } from "lucide-react";
import type { Task } from "@/lib/types";

export default function TasksPage() {
    const { supabase, isLoading: supabaseLoading, error: supabaseError } = useSupabase();
    const {
        setTasks,
        getFilteredTasks,
        openTaskForm,
        addTask,
        updateTask,
        deleteTask,
    } = useTaskStore();

    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const filteredTasks = getFilteredTasks();

    useEffect(() => {
        if (supabaseLoading) return;
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        const fetchTasks = async () => {
            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .select("*, subtasks(*), category:categories(*)")
                    .order("created_at", { ascending: false });

                if (error) {
                    setFetchError(error.message);
                } else if (data) {
                    setTasks(data as Task[]);
                }
            } catch (err) {
                setFetchError("Failed to fetch tasks");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [supabase, supabaseLoading, setTasks]);

    const handleCreateTask = async (data: Partial<Task>) => {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: newTask, error } = await supabase
            .from("tasks")
            .insert({ ...data, user_id: user.id, status: "todo" })
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

    if (supabaseLoading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="h-8 w-8 text-sky-500 animate-spin mb-4" />
                <p className="text-slate-500">Loading tasks...</p>
            </div>
        );
    }

    if (supabaseError || fetchError) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <AlertTriangle className="h-8 w-8 text-amber-500 mb-4" />
                <p className="text-slate-500">{supabaseError || fetchError}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        All Tasks
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Manage and organize all your tasks
                    </p>
                </div>
                <Button onClick={() => openTaskForm()}>
                    <Plus className="h-4 w-4" />
                    Add Task
                </Button>
            </div>

            <div className="card p-6">
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
