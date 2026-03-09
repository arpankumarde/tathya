import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import {
  ArrowRight,
  BarChart3,
  MessageSquare,
  Zap,
  CheckCircle2,
  Database,
  Layers,
  Github,
  Twitter,
  Linkedin,
  Upload,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-[#212121] selection:bg-[#2f8d46] selection:text-white font-sans">
      <Navbar />

      <main className="pt-16">

        {/* ── HERO (unchanged) ── */}
        <section className="px-6 py-24 md:py-32 max-w-6xl mx-auto border-b border-zinc-100">
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
                  <p className="text-sm font-semibold text-[#212121]">&quot;Show monthly revenue trends&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="relative bg-white overflow-hidden">
          {/* Subtle top radial green wash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(47,141,70,0.06) 0%, transparent 70%)",
            }}
          />
          {/* Dot texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.5]"
            style={{
              backgroundImage: "radial-gradient(circle, #e4e4e7 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-6 py-28">
            <div className="text-center mb-20 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#2f8d46]/10 text-[#2f8d46] text-xs font-bold uppercase tracking-widest border border-[#2f8d46]/20">
                Features
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#111] tracking-tight">
                Built for speed and clarity
              </h2>
              <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
                Transform raw data into meaningful visual stories with tools designed for functional excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <MessageSquare className="size-5" />,
                  title: "Conversational AI Interface",
                  desc: "Describe what you need in plain English. Tathya understands context and builds tailored visualizations instantly.",
                },
                {
                  icon: <Zap className="size-5" />,
                  title: "Predictive Data Insights",
                  desc: "Uncover trends before they happen. Our AI engine scans your datasets for anomalies and growth opportunities automatically.",
                },
                {
                  icon: <BarChart3 className="size-5" />,
                  title: "Interactive Visuals",
                  desc: "Every chart is a conversation. Drill down, filter, and explore your data points with beautiful, lightning-fast interactivity.",
                },
                {
                  icon: <Database className="size-5" />,
                  title: "Bring Your Own Data",
                  desc: "Upload any CSV or connect your cloud storage. Works with what you already have — zero migration needed.",
                },
                {
                  icon: <Layers className="size-5" />,
                  title: "Multi-Dataset Analysis",
                  desc: "Cross-reference multiple datasets in a single query. Combine sales, marketing, and ops data for unified insights.",
                },
                {
                  icon: <LayoutDashboard className="size-5" />,
                  title: "Persistent Dashboards",
                  desc: "Save any report as a reusable dashboard. Share with teammates via a link — no accounts required for viewers.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="group bg-white border border-zinc-200/70 rounded-2xl p-7 shadow-sm hover:shadow-xl hover:shadow-[#2f8d46]/8 hover:border-[#2f8d46]/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="mb-5 inline-flex size-11 items-center justify-center rounded-xl bg-[#2f8d46]/10 border border-[#2f8d46]/15 text-[#2f8d46] group-hover:bg-[#2f8d46] group-hover:text-white group-hover:border-[#2f8d46] transition-all duration-300 shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-[15px] font-bold text-[#111] mb-2 leading-snug">{f.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="relative bg-[#f8faf8] border-t border-zinc-100 overflow-hidden">
          {/* Subtle right-side wash */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 70% at 100% 50%, rgba(47,141,70,0.05) 0%, transparent 60%)",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-6 py-28">
            <div className="text-center mb-20 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#2f8d46]/10 text-[#2f8d46] text-xs font-bold uppercase tracking-widest border border-[#2f8d46]/20">
                How it works
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#111] tracking-tight">
                Three steps to insights
              </h2>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Connector line (desktop only) */}
              <div className="hidden md:block absolute top-9 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-[#2f8d46]/30 via-[#2f8d46]/60 to-[#2f8d46]/30" />

              {[
                {
                  step: "01",
                  icon: <Upload className="size-5" />,
                  title: "Connect your data",
                  desc: "Securely upload CSVs or link your databases. PostgreSQL, MySQL, spreadsheets — your data stays private.",
                },
                {
                  step: "02",
                  icon: <Sparkles className="size-5" />,
                  title: "Ask a question",
                  desc: "Type any business question in plain English and let our AI generate the exact charts and tables you need.",
                },
                {
                  step: "03",
                  icon: <LayoutDashboard className="size-5" />,
                  title: "Build your dashboard",
                  desc: "Save reports to a live dashboard. Share with your team instantly — no engineering effort required.",
                },
              ].map((item, i) => (
                <div key={i} className="group flex flex-col items-center text-center gap-5">
                  {/* Step circle */}
                  <div className="relative z-10 size-[72px] rounded-2xl bg-white border-2 border-[#2f8d46]/25 shadow-lg shadow-[#2f8d46]/10 flex flex-col items-center justify-center group-hover:bg-[#2f8d46] group-hover:border-[#2f8d46] group-hover:shadow-[#2f8d46]/25 transition-all duration-300">
                    <span className="text-[10px] font-black text-[#2f8d46] group-hover:text-white/70 tracking-[0.15em] leading-none mb-0.5">{item.step}</span>
                    <span className="text-[#2f8d46] group-hover:text-white transition-colors">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#111] mb-2">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative bg-white overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(47,141,70,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-5xl mx-auto px-6 py-28">
            <div className="relative bg-gradient-to-br from-[#2f8d46] to-[#1e6b30] rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl shadow-[#2f8d46]/20 overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 -mr-24 -mt-24 size-96 bg-white/[0.06] rounded-full" />
              <div className="absolute bottom-0 left-0 -ml-24 -mb-24 size-96 bg-black/[0.08] rounded-full" />
              {/* Dot pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />

              <div className="relative z-10 space-y-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest">
                  <span className="size-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Get started today
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
                  Ready to master<br />your data?
                </h2>
                <p className="text-white/75 text-lg max-w-xl mx-auto leading-relaxed">
                  Join data-driven teams who use Tathya to simplify their business intelligence — no engineers required.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link href="/signup">
                    <button className="flex items-center gap-2 h-13 px-9 bg-white text-[#2f8d46] font-extrabold text-base rounded-xl hover:bg-zinc-50 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-200 active:scale-[0.98] py-3.5">
                      Get Started for Free
                      <ArrowRight className="size-4" />
                    </button>
                  </Link>
                  <Link href="#features">
                    <button className="h-13 px-9 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base rounded-xl transition-all duration-200 py-3.5">
                      See Features
                    </button>
                  </Link>
                </div>
                <p className="text-white/50 text-sm flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="size-3.5" />
                  No credit card required · 14-day free trial
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="bg-white border-t border-zinc-100">
          <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">

            {/* Top grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">

              {/* Brand column */}
              <div className="col-span-2 space-y-5">
                <div className="flex items-center gap-2.5">
                  <Image src="/brand/logo.png" alt="Tathya" width={28} height={28} className="rounded-lg" />
                  <span className="font-extrabold text-xl text-[#111]">Tathya</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
                  The AI-powered conversational BI platform. Instant insights from your data — no SQL, no waiting.
                </p>
                {/* Social */}
                <div className="flex items-center gap-2.5">
                  {[
                    { icon: <Github className="size-4" />, label: "GitHub" },
                    { icon: <Twitter className="size-4" />, label: "Twitter" },
                    { icon: <Linkedin className="size-4" />, label: "LinkedIn" },
                  ].map((s) => (
                    <Link
                      key={s.label}
                      href="#"
                      aria-label={s.label}
                      className="size-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-[#2f8d46]/10 hover:border-[#2f8d46]/30 hover:text-[#2f8d46] transition-all"
                    >
                      {s.icon}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Link columns */}
              {[
                {
                  heading: "Product",
                  links: ["Features", "Pricing", "Integrations", "Changelog"],
                },
                {
                  heading: "Company",
                  links: ["About", "Blog", "Careers", "Press Kit"],
                },
                {
                  heading: "Support",
                  links: ["Documentation", "Contact Us", "API Status", "Community"],
                },
              ].map((col) => (
                <div key={col.heading} className="space-y-4">
                  <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{col.heading}</h5>
                  <ul className="space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l}>
                        <Link href="#" className="text-sm text-zinc-600 hover:text-[#2f8d46] transition-colors">
                          {l}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 w-fit mb-10">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">All systems operational</span>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-zinc-100">
              <p className="text-xs text-zinc-400">
                © {new Date().getFullYear()} Tathya BI, Inc. · All rights reserved.
              </p>
              <div className="flex flex-wrap gap-6">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                  <Link key={l} href="#" className="text-xs text-zinc-400 hover:text-[#2f8d46] transition-colors">
                    {l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
