"use client";

import { TaskCard } from "./TaskCard";
import { useTaskStore } from "@/store/taskStore";
import { Inbox } from "lucide-react";
import type { Task } from "@/lib/types";

interface TaskListProps {
    tasks: Task[];
    onUpdate?: (task: Task) => void;
    onDelete?: (id: string) => void;
}

export function TaskList({ tasks, onUpdate, onDelete }: TaskListProps) {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Inbox className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-1">
                    No tasks yet
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Create your first task to get started
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
