import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, Category, TaskFilters, ViewMode, TaskStats } from "@/lib/types";

interface TaskState {
    // Data
    tasks: Task[];
    categories: Category[];

    // UI State
    viewMode: ViewMode;
    filters: TaskFilters;
    selectedTaskId: string | null;
    isTaskFormOpen: boolean;
    editingTask: Task | null;

    // Actions
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;

    setCategories: (categories: Category[]) => void;
    addCategory: (category: Category) => void;

    setViewMode: (mode: ViewMode) => void;
    setFilters: (filters: TaskFilters) => void;
    setSelectedTask: (id: string | null) => void;
    openTaskForm: (task?: Task) => void;
    closeTaskForm: () => void;

    // Computed
    getFilteredTasks: () => Task[];
    getTaskStats: () => TaskStats;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            // Initial state
            tasks: [],
            categories: [],
            viewMode: "list",
            filters: { status: "all", priority: "all" },
            selectedTaskId: null,
            isTaskFormOpen: false,
            editingTask: null,

            // Actions
            setTasks: (tasks) => set({ tasks }),

            addTask: (task) =>
                set((state) => ({ tasks: [task, ...state.tasks] })),

            updateTask: (id, updates) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, ...updates } : task
                    ),
                })),

            deleteTask: (id) =>
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                })),

            setCategories: (categories) => set({ categories }),

            addCategory: (category) =>
                set((state) => ({ categories: [...state.categories, category] })),

            setViewMode: (viewMode) => set({ viewMode }),

            setFilters: (filters) => set({ filters }),

            setSelectedTask: (selectedTaskId) => set({ selectedTaskId }),

            openTaskForm: (task) =>
                set({ isTaskFormOpen: true, editingTask: task || null }),

            closeTaskForm: () =>
                set({ isTaskFormOpen: false, editingTask: null }),

            // Computed
            getFilteredTasks: () => {
                const { tasks, filters } = get();
                let filtered = [...tasks];

                if (filters.status && filters.status !== "all") {
                    filtered = filtered.filter((t) => t.status === filters.status);
                }

                if (filters.priority && filters.priority !== "all") {
                    filtered = filtered.filter((t) => t.priority === filters.priority);
                }

                if (filters.category_id) {
                    filtered = filtered.filter((t) => t.category_id === filters.category_id);
                }

                if (filters.search) {
                    const search = filters.search.toLowerCase();
                    filtered = filtered.filter(
                        (t) =>
                            t.title.toLowerCase().includes(search) ||
                            t.description?.toLowerCase().includes(search)
                    );
                }

                return filtered;
            },

            getTaskStats: () => {
                const { tasks } = get();
                const now = new Date();

                return {
                    total: tasks.length,
                    completed: tasks.filter((t) => t.status === "completed").length,
                    pending: tasks.filter((t) => t.status === "todo").length,
                    in_progress: tasks.filter((t) => t.status === "in_progress").length,
                    overdue: tasks.filter(
                        (t) =>
                            t.due_date &&
                            new Date(t.due_date) < now &&
                            t.status !== "completed"
                    ).length,
                };
            },
        }),
        {
            name: "task-store",
            partialize: (state) => ({
                viewMode: state.viewMode,
                filters: state.filters,
            }),
        }
    )
);
