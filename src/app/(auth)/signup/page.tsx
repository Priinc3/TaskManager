"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button, Input } from "@/components/ui";

const signupSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        if (!supabase) return;
        setError(null);

        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.fullName,
                },
            },
        });

        if (error) {
            setError(error.message);
            return;
        }

        setSuccess(true);
    };

    if (success) {
        return (
            <div className="animate-fade-in text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Check your email
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    We&apos;ve sent you a confirmation link.
                </p>
                <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                    Back to login
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Create your account
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Start organizing your tasks today
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <Input
                    {...register("fullName")}
                    type="text"
                    label="Full name"
                    placeholder="John Doe"
                    icon={<User className="h-4 w-4" />}
                    error={errors.fullName?.message}
                />

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
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>

                <Input
                    {...register("confirmPassword")}
                    type={showPassword ? "text" : "password"}
                    label="Confirm password"
                    placeholder="••••••••"
                    icon={<Lock className="h-4 w-4" />}
                    error={errors.confirmPassword?.message}
                />

                <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
                    Create account
                </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{" "}
                <Link href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
