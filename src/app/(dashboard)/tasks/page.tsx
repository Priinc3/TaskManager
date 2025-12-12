"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTaskStore } from "@/store/taskStore";
import { TaskForm, TaskList, TaskFilters } from "@/components/tasks";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import type { Task } from "@/lib/types";

export default function TasksPage() {
    const supabase = createClient();
    const {
        tasks,
        setTasks,
        getFilteredTasks,
        openTaskForm,
        addTask,
        updateTask,
        deleteTask,
    } = useTaskStore();

    const [isLoading, setIsLoading] = useState(true);
    const filteredTasks = getFilteredTasks();

    useEffect(() => {
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

    const handleUpdateTask = async (task: Task) => {
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
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (!error) {
            deleteTask(id);
        }
    };

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
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
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
