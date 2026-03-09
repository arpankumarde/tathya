"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      const code = err?.code;
      if (
        code === "auth/invalid-credential" ||
        code === "auth/user-not-found" ||
        code === "auth/wrong-password"
      ) {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("Google sign-in failed. Please try again.");
      }
      setGoogleLoading(false);
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
            <h2 className="text-3xl font-bold leading-tight">
              Master your business data with Tathya.
            </h2>
            <p className="text-white/80 text-lg">
              Join thousands of professionals already using our conversational
              BI to make faster, better decisions.
            </p>

            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-white/60" />
                <span className="font-medium text-white/90">
                  Instant AI-powered dashboards
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-white/60" />
                <span className="font-medium text-white/90">
                  Natural language data querying
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-white/60" />
                <span className="font-medium text-white/90">
                  Secure enterprise-grade integration
                </span>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-12">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="size-10 rounded-full border-2 border-[#2f8d46] bg-zinc-200 overflow-hidden"
                >
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
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#212121] mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-500 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full h-11 rounded-lg border-zinc-200 font-semibold text-zinc-700 hover:bg-zinc-50 gap-3 mb-5"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-zinc-100" />
            <span className="text-xs text-zinc-400 font-medium">
              or sign in with email
            </span>
            <div className="h-px flex-1 bg-zinc-100" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-700 font-medium">
                Email Address
              </Label>
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
                <Label htmlFor="password" className="text-zinc-700 font-medium">
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-xs font-semibold text-[#2f8d46] hover:underline"
                >
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
              disabled={loading || googleLoading}
              className="w-full bg-[#2f8d46] hover:bg-[#256d36] text-white font-bold h-11 rounded-lg mt-2 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#2f8d46] font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>

          <div className="mt-10 flex items-center gap-4 text-xs text-zinc-400 font-medium uppercase tracking-[0.1em] justify-center md:justify-start">
            <span>© {new Date().getFullYear()} Tathya BI</span>
            <span className="size-1 bg-zinc-200 rounded-full" />
            <span>Secure Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
