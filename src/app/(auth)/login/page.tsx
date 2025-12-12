"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { createBrowserClient } from "@supabase/ssr";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Create client only in browser
    const supabase = useMemo(() => {
        if (typeof window === "undefined") return null;
        return createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        if (!supabase) return;
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            setError(error.message);
            return;
        }

        router.push("/dashboard");
        router.refresh();
    };

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Welcome back
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Sign in to continue to TaskFlow
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <Input
                    {...register("email")}
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    error={errors.email?.message}
                />

                <div className="relative">
                    <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        placeholder="••••••••"
                        icon={<Lock className="h-4 w-4" />}
                        error={errors.password?.message}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                        />
                        <span className="text-slate-600 dark:text-slate-400">
                            Remember me
                        </span>
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-sky-600 hover:text-sky-700 font-medium"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                    Sign in
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                    href="/signup"
                    className="text-sky-600 hover:text-sky-700 font-medium"
                >
                    Sign up for free
                </Link>
            </p>
        </div>
    );
}
