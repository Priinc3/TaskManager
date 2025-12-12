import Link from "next/link";
import { CheckSquare } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-accent-600 p-12 flex-col justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <CheckSquare className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">TaskFlow</span>
                </Link>

                <div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Organize your tasks,
                        <br />
                        achieve your goals
                    </h1>
                    <p className="text-primary-100 text-lg">
                        The smart way to manage your tasks and never miss a deadline.
                    </p>
                </div>

                <p className="text-primary-200 text-sm">
                    © {new Date().getFullYear()} TaskFlow. All rights reserved.
                </p>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <CheckSquare className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gradient">TaskFlow</span>
                        </Link>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
