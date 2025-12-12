import Link from "next/link";
import { CheckSquare, ArrowRight, Zap, Bell, Calendar, BarChart3 } from "lucide-react";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                            <CheckSquare className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gradient">TaskFlow</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                        >
                            Log in
                        </Link>
                        <Link href="/signup" className="btn-primary btn-md">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8 animate-fade-in">
                        <Zap className="h-4 w-4" />
                        Smart task management for modern teams
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 animate-slide-up">
                        Organize your work,{" "}
                        <span className="text-gradient">achieve more</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto animate-slide-up">
                        TaskFlow helps you manage tasks with intelligent reminders, beautiful
                        views, and seamless collaboration. Never miss a deadline again.
                    </p>
                    <div className="flex items-center justify-center gap-4 animate-slide-up">
                        <Link href="/signup" className="btn-primary btn-lg">
                            Start for free
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                        <Link href="/login" className="btn-secondary btn-lg">
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
                        Everything you need to stay productive
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Bell,
                                title: "Smart Reminders",
                                description:
                                    "Never miss a deadline with intelligent notifications that keep you on track.",
                            },
                            {
                                icon: Calendar,
                                title: "Multiple Views",
                                description:
                                    "Switch between list, board, and calendar views to see your tasks your way.",
                            },
                            {
                                icon: BarChart3,
                                title: "Progress Tracking",
                                description:
                                    "Visualize your productivity with beautiful charts and statistics.",
                            },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="card p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4">
                                    <feature.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="card bg-gradient-to-r from-primary-500 to-accent-500 p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to boost your productivity?
                        </h2>
                        <p className="text-primary-100 mb-8 max-w-xl mx-auto">
                            Join thousands of users who have transformed their workflow with TaskFlow.
                        </p>
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
                        >
                            Get Started Free
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-6 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-6xl mx-auto text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} TaskFlow. Built with ❤️ using Next.js and Supabase.
                </div>
            </footer>
        </main>
    );
}
