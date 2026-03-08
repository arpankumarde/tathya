"use client"

import { useRouter } from "next/navigation";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { hashPassword, getStoredUsers, setCurrentUser } from "@/lib/auth-client";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const users = getStoredUsers();
            const user = users.find(u => u.email === email);

            if (!user) {
                setError("Invalid email or password");
                setLoading(false);
                return;
            }

            const passwordHash = await hashPassword(password);
            if (user.passwordHash !== passwordHash) {
                setError("Invalid email or password");
                setLoading(false);
                return;
            }

            setCurrentUser(user);
            router.push("/dashboard");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };
    return (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6 bg-zinc-50/50">
            <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100">

                {/* Left Side - Info/Brand */}
                <div className="hidden md:flex flex-col justify-center p-12 bg-[#2f8d46] text-white space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 size-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-80 bg-black/10 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl font-bold leading-tight">Master your business data with Tathya.</h2>
                        <p className="text-white/80 text-lg">
                            Join thousands of professionals already using our conversational BI to make faster, better decisions.
                        </p>

                        <ul className="space-y-4 pt-4">
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="size-5 text-white/60" />
                                <span className="font-medium text-white/90">Instant AI-powered dashboards</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="size-5 text-white/60" />
                                <span className="font-medium text-white/90">Natural language data querying</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="size-5 text-white/60" />
                                <span className="font-medium text-white/90">Secure enterprise-grade integration</span>
                            </li>
                        </ul>
                    </div>

                    <div className="relative z-10 pt-12">
                        <div className="flex -space-x-3 mb-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="size-10 rounded-full border-2 border-[#2f8d46] bg-zinc-200 overflow-hidden">
                                    <div className="w-full h-full bg-zinc-300" />
                                </div>
                            ))}
                            <div className="size-10 rounded-full border-2 border-[#2f8d46] bg-white/20 flex items-center justify-center text-xs font-bold">
                                +2k
                            </div>
                        </div>
                        <p className="text-sm font-medium text-white/70 italic">
                            "Tathya saved our team 20+ hours of manual reporting every week."
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-[#212121] mb-2">Welcome Back</h1>
                        <p className="text-zinc-500 text-sm">Enter your credentials to access your account</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="size-4" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-700 font-medium">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 border-zinc-200 focus-visible:border-[#2f8d46] focus-visible:ring-[#2f8d46]/10 rounded-lg"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-zinc-700 font-medium">Password</Label>
                                <Link href="#" className="text-xs font-semibold text-[#2f8d46] hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 border-zinc-200 focus-visible:border-[#2f8d46] focus-visible:ring-[#2f8d46]/10 rounded-lg"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2f8d46] hover:bg-[#256d36] text-white font-bold h-11 rounded-lg mt-4 transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? "Logging in..." : "Login to Account"}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-500">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="text-[#2f8d46] font-bold hover:underline">
                            Create an account
                        </Link>
                    </p>

                    <div className="mt-12 flex items-center gap-4 text-xs text-zinc-400 font-medium uppercase tracking-[0.1em] justify-center md:justify-start">
                        <span>© {new Date().getFullYear()} Tathya BI</span>
                        <span className="size-1 bg-zinc-200 rounded-full" />
                        <span>Secure Access</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
