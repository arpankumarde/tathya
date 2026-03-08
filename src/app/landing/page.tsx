"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, MessageSquare, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00ff9f] selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-900 bg-black h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="size-5 bg-[#00ff9f] rounded-sm" />
          <span className="font-bold text-lg">Tathya</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/login">
            <Button variant="outline" className="text-xs h-8 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-white rounded-md">
              Sign In
            </Button>
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-44 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8">
            Tathya – Conversational Business Intelligence
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Generate powerful data dashboards using natural language prompts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="bg-[#00ff9f] hover:bg-[#00e68e] text-black font-semibold h-12 px-8 rounded-md text-base transition-colors w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Button variant="outline" className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 h-12 px-8 rounded-md text-base w-full sm:w-auto">
              Documentation
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 border-t border-zinc-900 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden shadow-2xl">
              <div className="p-10 bg-black group">
                <div className="mb-10 inline-flex size-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50">
                  <MessageSquare className="size-6 text-[#00ff9f]" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-white">Natural language dashboard generation</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Describe the data you want to see in plain English. Tathya builds your dashboard in seconds, no SQL or technical expertise required.
                </p>
              </div>
              <div className="p-10 bg-black group">
                <div className="mb-10 inline-flex size-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50">
                  <Zap className="size-6 text-[#00ff9f]" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-white">AI-powered data insights</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Go beyond basic charts. Our engine identifies trends, anomalies, and opportunities buried deep within your business data.
                </p>
              </div>
              <div className="p-10 bg-black group">
                <div className="mb-10 inline-flex size-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50">
                  <BarChart3 className="size-6 text-[#00ff9f]" />
                </div>
                <h3 className="text-xl font-medium mb-4 text-white">Instant visual analytics</h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  Beautiful, interactive visualizations that provide clarity at a glance. Purpose-built for speed and executive decision-making.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-20 border-t border-zinc-900">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="size-4 bg-[#00ff9f] rounded-sm" />
              <span className="font-bold text-sm tracking-tight">Tathya</span>
            </div>
            <div className="flex gap-10">
              <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Twitter</Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">GitHub</Link>
              <Link href="#" className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors">Privacy</Link>
            </div>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest">
              © {new Date().getFullYear()} Tathya BI • Built for Performance
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
