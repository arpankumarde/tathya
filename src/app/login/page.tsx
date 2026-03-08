"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
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
          <h1 className="text-xl font-semibold text-black mb-6 text-center">Login to Tathya</h1>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-[#10b981] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                className="focus-visible:border-[#10b981] focus-visible:ring-[#10b981]/20"
                required 
              />
            </div>

            <Button className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-medium rounded-md h-10 mt-2">
              Login
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
            <p className="text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[#10b981] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} Tathya BI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
