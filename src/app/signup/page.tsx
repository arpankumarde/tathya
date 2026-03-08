"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-[#10b981] selection:text-white">
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="size-5 bg-[#10b981] rounded-sm" />
          <span className="font-bold text-xl tracking-tight text-black">Tathya</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-zinc-200 rounded-lg p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-black mb-6 text-center">Create your Tathya account</h1>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                className="focus-visible:border-[#10b981] focus-visible:ring-[#10b981]/20"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="focus-visible:border-[#10b981] focus-visible:ring-[#10b981]/20"
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="focus-visible:border-[#10b981] focus-visible:ring-[#10b981]/20"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••" 
                className="focus-visible:border-[#10b981] focus-visible:ring-[#10b981]/20"
                required 
              />
            </div>

            <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-md h-10 mt-2">
              Sign up
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-[#10b981] font-medium hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-zinc-400">
          By signing up, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
