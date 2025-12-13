"use client";

import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Bell, Trash2 } from "lucide-react";
import { Button, Input, Textarea, Select, Modal } from "@/components/ui";
import { useTaskStore } from "@/store/taskStore";
import { PRIORITIES, REMINDER_PRESETS } from "@/lib/constants";
import type { Task, Priority } from "@/lib/types";

// Helper to format Date object to local datetime-local input value (YYYY-MM-DDTHH:mm)
function formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["high", "medium", "low"]),
    due_date: z.string().optional(),
    category_id: z.string().optional(),
    tags: z.string().optional(),
    subtasks: z.array(
        z.object({
            title: z.string().min(1),
            is_completed: z.boolean(),
        })
    ),
    reminder_minutes: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
    onSubmit: (data: Partial<Task>) => Promise<void>;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
    const { isTaskFormOpen, closeTaskForm, editingTask, categories } = useTaskStore();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "medium",
            due_date: "",
            category_id: "",
            tags: "",
            subtasks: [],
            reminder_minutes: "0",
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "subtasks",
    });

    // Reset form when editing task changes
    useEffect(() => {
        if (editingTask) {
            reset({
                title: editingTask.title,
                description: editingTask.description || "",
                priority: editingTask.priority,
                due_date: editingTask.due_date
                    ? formatDateForInput(new Date(editingTask.due_date))
                    : "",
                category_id: editingTask.category_id || "",
                tags: editingTask.tags?.join(", ") || "",
                subtasks:
                    editingTask.subtasks?.map((s) => ({
                        title: s.title,
                        is_completed: s.is_completed,
                    })) || [],
                reminder_minutes: "0",
            });
        } else {
            reset({
                title: "",
                description: "",
                priority: "medium",
                due_date: "",
                category_id: "",
                tags: "",
                subtasks: [],
                reminder_minutes: "0",
            });
        }
    }, [editingTask, reset]);

    const handleFormSubmit = async (data: TaskFormData) => {
        // Convert local datetime-local value to ISO string with timezone
        let dueDateISO: string | undefined;
        if (data.due_date) {
            // datetime-local gives us local time, create a Date object from it
            const localDate = new Date(data.due_date);
            dueDateISO = localDate.toISOString();
        }

        const taskData: Partial<Task> & { reminder_minutes?: number } = {
            title: data.title,
            description: data.description,
            priority: data.priority as Priority,
            due_date: dueDateISO,
            category_id: data.category_id || undefined,
            tags: data.tags
                ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [],
            reminder_minutes: data.reminder_minutes ? parseInt(data.reminder_minutes) : undefined,
        };

        if (editingTask) {
            taskData.id = editingTask.id;
        }

        await onSubmit(taskData);
        closeTaskForm();
    };

    const priorityOptions = PRIORITIES.map((p) => ({
        value: p.value,
        label: p.label,
    }));

    const categoryOptions = [
        { value: "", label: "No category" },
        ...categories.map((c) => ({ value: c.id, label: c.name })),
    ];

    const reminderOptions = REMINDER_PRESETS.map((r) => ({
        value: r.value.toString(),
        label: r.label,
    }));

    return (
        <Modal
            isOpen={isTaskFormOpen}
            onClose={closeTaskForm}
            title={editingTask ? "Edit Task" : "Create New Task"}
            size="lg"
        >
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                {/* Title */}
                <Input
                    {...register("title")}
                    label="Title"
                    placeholder="What needs to be done?"
                    error={errors.title?.message}
                    autoFocus
                />

                {/* Description */}
                <Textarea
                    {...register("description")}
                    label="Description"
                    placeholder="Add more details..."
                    rows={3}
                />

                {/* Priority & Category */}
                <div className="grid grid-cols-2 gap-4">
                    <Select
                        {...register("priority")}
                        label="Priority"
                        options={priorityOptions}
                    />
                    <Select
                        {...register("category_id")}
                        label="Category"
                        options={categoryOptions}
                    />
                </div>

                {/* Due Date & Reminder */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        {...register("due_date")}
                        type="datetime-local"
                        label="Due Date"
                    />
                    <Select
                        {...register("reminder_minutes")}
                        label="Reminder"
                        options={reminderOptions}
                    />
                </div>

                {/* Tags */}
                <Input
                    {...register("tags")}
                    label="Tags"
                    placeholder="Enter tags separated by commas"
                />

                {/* Subtasks */}
                <div>
                    <label className="label">Subtasks</label>
                    <div className="space-y-2">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex items-center gap-2">
                                <Input
                                    {...register(`subtasks.${index}.title`)}
                                    placeholder="Subtask title"
                                    className="flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 text-slate-400 hover:text-danger-500 transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => append({ title: "", is_completed: false })}
                            className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add subtask
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={closeTaskForm}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        {editingTask ? "Update Task" : "Create Task"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
