"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Zap, AlertCircle } from "lucide-react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }
      router.push("/dashboard");
    } catch (err: any) {
      const code = err?.code;
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError("Google sign-up failed. Please try again.");
      }
      setGoogleLoading(false);
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
            <h2 className="text-3xl font-bold leading-tight">
              Start your 14-day free trial today.
            </h2>
            <p className="text-white/80 text-lg">
              Get full access to all features. No credit card required. Cancel
              anytime.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="size-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Enterprise Security</h4>
                  <p className="text-sm text-white/70">
                    Your data is encrypted and protected with industry-leading
                    standards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="size-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Zap className="size-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold">Instant Insights</h4>
                  <p className="text-sm text-white/70">
                    Go from connection to dashboard in under 60 seconds using
                    natural language.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full border-2 border-white/20 bg-zinc-200 overflow-hidden">
                <div className="w-full h-full bg-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Arpan Kumar De</p>
                <p className="text-xs text-white/60">
                  Lead Developer at Uncodixify
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#212121] mb-2">
              Create your account
            </h1>
            <p className="text-zinc-500 text-sm">
              Join the next generation of data-driven teams
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Google Sign Up */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignUp}
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
            {googleLoading ? "Signing up..." : "Continue with Google"}
          </Button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-zinc-100" />
            <span className="text-xs text-zinc-400 font-medium">
              or sign up with email
            </span>
            <div className="h-px flex-1 bg-zinc-100" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-700 font-medium">
                Full Name
              </Label>
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
              <Label htmlFor="email" className="text-zinc-700 font-medium">
                Email address
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
              <Label htmlFor="password" className="text-zinc-700 font-medium">
                Password
              </Label>
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
              <Label
                htmlFor="confirm-password"
                className="text-zinc-700 font-medium"
              >
                Confirm Password
              </Label>
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
              disabled={loading || googleLoading}
              className="w-full bg-[#2f8d46] hover:bg-[#256d36] text-white font-bold h-11 rounded-lg mt-2 shadow-md hover:shadow-lg transition-all"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-[11px] text-center text-zinc-400 leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="#" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline">
                Privacy Policy
              </Link>
              .
            </p>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#2f8d46] font-bold hover:underline"
            >
              Log in
            </Link>
          </p>

          <div className="mt-8 flex items-center gap-4 text-xs text-zinc-400 font-medium uppercase tracking-[0.1em] justify-center md:justify-start">
            <span>© {new Date().getFullYear()} Tathya BI</span>
            <span className="size-1 bg-zinc-200 rounded-full" />
            <span>Privacy Focused</span>
          </div>
        </div>
      </div>
    </div>
  );
}
