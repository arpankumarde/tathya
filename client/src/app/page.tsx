import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { ArrowRight, BarChart3, MessageSquare, Zap, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#212121] selection:bg-[#2f8d46] selection:text-white font-sans">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto border-b border-zinc-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#212121] leading-tight">
                Understand your business data through conversation.
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-xl leading-relaxed">
                Tathya turns your natural language questions into powerful, interactive data dashboards. No SQL, no technical hurdles, just instant insights.
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button className="bg-[#2f8d46] hover:bg-[#256d36] text-white font-bold h-12 px-8 rounded-md text-base transition-all w-full sm:w-auto shadow-md hover:shadow-lg">
                    Get Started for Free
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" className="border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-12 px-8 rounded-md text-base w-full sm:w-auto font-semibold">
                    Explore Features
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-4 text-sm text-zinc-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#2f8d46]" />
                  No credit card required
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-[#2f8d46]" />
                  14-day free trial
                </div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="aspect-[4/3] bg-zinc-50 border border-zinc-100 rounded-xl shadow-2xl p-4 overflow-hidden">
                <div className="w-full h-full bg-white border border-zinc-100 rounded-lg shadow-sm p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-zinc-50 pb-4">
                    <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-[#2f8d46]/10 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-32 bg-zinc-50 rounded-lg p-4">
                      <div className="h-2 w-16 bg-zinc-200 rounded mb-2" />
                      <div className="h-6 w-12 bg-zinc-300 rounded" />
                    </div>
                    <div className="h-32 bg-zinc-50 rounded-lg p-4">
                      <div className="h-2 w-20 bg-zinc-200 rounded mb-2" />
                      <div className="h-6 w-16 bg-zinc-300 rounded" />
                    </div>
                  </div>
                  <div className="h-40 bg-zinc-50 rounded-lg flex items-end justify-around p-4 gap-2">
                    <div className="w-full bg-[#2f8d46]/60 rounded-t h-1/2" />
                    <div className="w-full bg-[#2f8d46]/40 rounded-t h-3/4" />
                    <div className="w-full bg-[#2f8d46]/80 rounded-t h-2/3" />
                    <div className="w-full bg-[#2f8d46]/20 rounded-t h-1/3" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white border border-zinc-100 p-4 rounded-lg shadow-xl flex items-center gap-3">
                <div className="size-10 bg-[#2f8d46] rounded-full flex items-center justify-center">
                  <MessageSquare className="size-5 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">Live Prompt</p>
                  <p className="text-sm font-semibold text-[#212121]">"Show monthly revenue trends"</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-24 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#212121]">Built for speed and clarity</h2>
              <p className="text-lg text-zinc-500 max-w-2xl mx-auto">Transform raw data into meaningful visual stories with tools designed for functional excellence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg border border-zinc-100 bg-white shadow-sm group-hover:bg-[#2f8d46] transition-colors">
                  <MessageSquare className="size-6 text-[#2f8d46] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#212121]">Conversational AI Interface</h3>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  Describe what you need in plain English. Tathya understands context and builds tailored visualizations instantly.
                </p>
              </div>
              <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg border border-zinc-100 bg-white shadow-sm group-hover:bg-[#2f8d46] transition-colors">
                  <Zap className="size-6 text-[#2f8d46] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#212121]">Predictive Data Insights</h3>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  Uncover trends before they happen. Our AI engine scans your datasets for anomalies and growth opportunities automatically.
                </p>
              </div>
              <div className="p-8 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="mb-6 inline-flex size-12 items-center justify-center rounded-lg border border-zinc-100 bg-white shadow-sm group-hover:bg-[#2f8d46] transition-colors">
                  <BarChart3 className="size-6 text-[#2f8d46] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-[#212121]">Interactive Visuals</h3>
                <p className="text-zinc-600 leading-relaxed text-sm">
                  Every chart is a conversation. Drill down, filter, and explore your data points with beautiful, lightning-fast interactivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="px-6 py-24 bg-zinc-50 border-t border-zinc-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-16 text-[#212121]">How it works</h2>
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8 text-left">
                <div className="size-12 bg-[#2f8d46] text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Connect your data</h4>
                  <p className="text-zinc-600">Securely link your databases, spreadsheets, or cloud storage. We support PostgreSQL, MySQL, CSV, and more.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 text-left">
                <div className="size-12 bg-[#2f8d46] text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Ask a question</h4>
                  <p className="text-zinc-600">Type a query like "What was our quarterly growth across Asian markets?" and let our AI handle the rest.</p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-8 text-left">
                <div className="size-12 bg-[#2f8d46] text-white rounded-full flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Build your dashboard</h4>
                  <p className="text-zinc-600">Save your visualizations to a custom dashboard. Share insights with your team with a single click.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-5xl mx-auto bg-[#2f8d46] rounded-2xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-80 bg-black/10 rounded-full blur-3xl" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to master your data?</h2>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">Join thousands of data-driven teams who use Tathya to simplify their business intelligence.</p>
              <Link href="/signup" className="inline-block">
                <Button className="bg-white hover:bg-zinc-100 text-[#2f8d46] font-extrabold h-14 px-10 rounded-lg text-lg transition-transform hover:scale-105 shadow-lg">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-16 border-t border-zinc-100 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-2 md:col-span-1 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="size-5 bg-[#2f8d46] rounded flex items-center justify-center">
                    <div className="size-1.5 bg-white rounded-full" />
                  </div>
                  <span className="font-bold text-lg text-[#212121]">Tathya</span>
                </div>
                <p className="text-sm text-zinc-500 max-w-xs">Building the future of conversational BI. Insights for everyone, everywhere.</p>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Product</h5>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li><Link href="#" className="hover:text-[#2f8d46]">Features</Link></li>
                  <li><Link href="#" className="hover:text-[#2f8d46]">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-[#2f8d46]">Integrations</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Company</h5>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li><Link href="#" className="hover:text-[#2f8d46]">About</Link></li>
                  <li><Link href="#" className="hover:text-[#2f8d46]">Blog</Link></li>
                  <li><Link href="#" className="hover:text-[#2f8d46]">Careers</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h5 className="font-bold text-sm uppercase tracking-wider text-zinc-400">Support</h5>
                <ul className="space-y-2 text-sm text-zinc-600">
                  <li><Link href="#" className="hover:text-[#2f8d46]">Docs</Link></li>
                  <li><Link href="#" className="hover:text-[#2f8d46]">Contact</Link></li>
                  <li><Link href="#" className="hover:text-[#2f8d46]">API Status</Link></li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-zinc-50">
              <p className="text-zinc-400 text-xs">
                © {new Date().getFullYear()} Tathya BI. All rights reserved. Professional Grade Analytics.
              </p>
              <div className="flex gap-8">
                <Link href="#" className="text-zinc-500 hover:text-[#2f8d46] text-xs transition-colors">Privacy Policy</Link>
                <Link href="#" className="text-zinc-500 hover:text-[#2f8d46] text-xs transition-colors">Terms of Service</Link>
                <Link href="#" className="text-zinc-500 hover:text-[#2f8d46] text-xs transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
