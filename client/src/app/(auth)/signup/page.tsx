"use client"

import { useRouter } from "next/navigation";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { hashPassword, getStoredUsers, saveUser, setCurrentUser } from "@/lib/auth-client";

export default function SignupPage() {
    const router = useRouter();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const users = getStoredUsers();
            if (users.find(u => u.email === email)) {
                setError("User already exists");
                setLoading(false);
                return;
            }

            const passwordHash = await hashPassword(password);
            const newUser = { email, passwordHash, name };

            saveUser(newUser);
            setCurrentUser(newUser);

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
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 size-80 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 size-64 bg-black/10 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl font-bold leading-tight">Start your 14-day free trial today.</h2>
                        <p className="text-white/80 text-lg">
                            Get full access to all features. No credit card required. Cancel anytime.
                        </p>

                        <div className="space-y-6 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="size-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Enterprise Security</h4>
                                    <p className="text-sm text-white/70">Your data is encrypted and protected with industry-leading standards.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                                    <Zap className="size-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold">Instant Insights</h4>
                                    <p className="text-sm text-white/70">Go from connection to dashboard in under 60 seconds using natural language.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-12 border-t border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full border-2 border-white/20 bg-zinc-200 overflow-hidden">
                                {/* Placeholder for avatar */}
                                <div className="w-full h-full bg-zinc-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Arpan Kumar De</p>
                                <p className="text-xs text-white/60">Lead Developer at Uncodixify</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-[#212121] mb-2">Create your account</h1>
                        <p className="text-zinc-500 text-sm">Join the next generation of data-driven teams</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="size-4" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-zinc-700 font-medium">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 border-zinc-200 focus-visible:border-[#2f8d46] focus-visible:ring-[#2f8d46]/10 rounded-lg"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-700 font-medium">Email address</Label>
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
                            <Label htmlFor="password" className="text-zinc-700 font-medium">Password</Label>
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

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password" className="text-zinc-700 font-medium">Confirm Password</Label>
                            <Input
                                id="confirm-password"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-11 border-zinc-200 focus-visible:border-[#2f8d46] focus-visible:ring-[#2f8d46]/10 rounded-lg"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#2f8d46] hover:bg-[#256d36] text-white font-bold h-11 rounded-lg mt-6 shadow-md hover:shadow-lg transition-all"
                        >
                            {loading ? "Creating Account..." : "Create My Account"}
                        </Button>

                        <p className="text-[11px] text-center text-zinc-400 mt-4 leading-relaxed">
                            By signing up, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                        </p>
                    </form>

                    <p className="mt-8 text-center text-sm text-zinc-500">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#2f8d46] font-bold hover:underline">
                            Log in
                        </Link>
                    </p>

                    <div className="mt-12 flex items-center gap-4 text-xs text-zinc-400 font-medium uppercase tracking-[0.1em] justify-center md:justify-start">
                        <span>© {new Date().getFullYear()} Tathya BI</span>
                        <span className="size-1 bg-zinc-200 rounded-full" />
                        <span>Privacy Focused</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
