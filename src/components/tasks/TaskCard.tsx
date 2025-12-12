"use client";

import { useState } from "react";
import {
    Calendar,
    Clock,
    MoreHorizontal,
    Trash2,
    Edit2,
    CheckCircle2,
    Circle,
    AlertCircle,
    Flag,
} from "lucide-react";
import { cn, formatDueDate, isOverdue } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";
import { Badge } from "@/components/ui";
import type { Task } from "@/lib/types";

interface TaskCardProps {
    task: Task;
    onUpdate?: (task: Task) => void;
    onDelete?: (id: string) => void;
}

const priorityIcons = {
    high: <Flag className="h-3.5 w-3.5 text-danger-500" />,
    medium: <Flag className="h-3.5 w-3.5 text-warning-500" />,
    low: <Flag className="h-3.5 w-3.5 text-success-500" />,
};

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const { openTaskForm, updateTask } = useTaskStore();

    const isTaskOverdue = task.due_date && isOverdue(task.due_date) && task.status !== "completed";
    const completedSubtasks = task.subtasks?.filter((s) => s.is_completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    const handleToggleComplete = () => {
        const newStatus = task.status === "completed" ? "todo" : "completed";
        updateTask(task.id, {
            status: newStatus,
            completed_at: newStatus === "completed" ? new Date().toISOString() : undefined,
        });
        onUpdate?.({ ...task, status: newStatus });
    };

    const handleEdit = () => {
        openTaskForm(task);
        setShowMenu(false);
    };

    const handleDelete = () => {
        onDelete?.(task.id);
        setShowMenu(false);
    };

    return (
        <div
            className={cn(
                "card-hover p-4 animate-fade-in group",
                task.status === "completed" && "opacity-60"
            )}
        >
            <div className="flex items-start gap-3">
                {/* Checkbox */}
                <button
                    onClick={handleToggleComplete}
                    className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-primary-500 transition-colors"
                >
                    {task.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-success-500" />
                    ) : (
                        <Circle className="h-5 w-5" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3
                            className={cn(
                                "font-medium text-slate-900 dark:text-slate-100",
                                task.status === "completed" && "line-through text-slate-500"
                            )}
                        >
                            {task.title}
                        </h3>

                        {/* Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                            >
                                <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-full mt-1 w-36 card p-1 z-10 animate-scale-in">
                                    <button
                                        onClick={handleEdit}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    {/* Meta info */}
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                        {/* Priority */}
                        <Badge variant="priority" priority={task.priority}>
                            {priorityIcons[task.priority]}
                            <span className="ml-1 capitalize">{task.priority}</span>
                        </Badge>

                        {/* Due date */}
                        {task.due_date && (
                            <span
                                className={cn(
                                    "flex items-center gap-1 text-xs",
                                    isTaskOverdue
                                        ? "text-danger-500"
                                        : "text-slate-500 dark:text-slate-400"
                                )}
                            >
                                {isTaskOverdue ? (
                                    <AlertCircle className="h-3.5 w-3.5" />
                                ) : (
                                    <Calendar className="h-3.5 w-3.5" />
                                )}
                                {formatDueDate(task.due_date)}
                            </span>
                        )}

                        {/* Subtasks progress */}
                        {totalSubtasks > 0 && (
                            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {completedSubtasks}/{totalSubtasks}
                            </span>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                            <div className="flex gap-1">
                                {task.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                                {task.tags.length > 2 && (
                                    <Badge className="text-xs">+{task.tags.length - 2}</Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
