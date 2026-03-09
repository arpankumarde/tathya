"use client"

import * as React from "react"
import { getShowcase, type ShowcaseData } from "@/lib/publish-api"
import { ChartBody } from "@/components/dashboard-canvas"
import { Loader2, Globe, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ShowcasePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const [data, setData] = React.useState<ShowcaseData | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        getShowcase(id)
            .then(setData)
            .catch((e) => setError(e.message))
    }, [id])

    return (
        <div
            className="min-h-screen bg-zinc-50 dark:bg-zinc-950"
            style={{
                backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                backgroundSize: "20px 20px",
            }}
        >
            {/* Top bar */}
            <div className="h-11 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex items-center px-4 gap-3 sticky top-0 z-10">
                <Link href="/">
                    <Image src="/brand/logo.png" alt="Tathya" width={22} height={22} className="rounded-md" />
                </Link>
                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
                <span className="text-[12px] font-bold text-zinc-700 dark:text-zinc-300 truncate">
                    {data?.dashboard_name ?? "Loading…"}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full ml-1">
                    <Globe className="size-2.5" />
                    Published
                </span>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-5 py-8">
                {/* Loading */}
                {!data && !error && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                        <Loader2 className="size-8 text-[#2f8d46] animate-spin" />
                        <p className="text-sm text-zinc-500">Loading showcase…</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                        <AlertTriangle className="size-8 text-zinc-400" />
                        <p className="text-sm font-semibold text-zinc-500">Showcase not found</p>
                        <p className="text-xs text-zinc-400">{error}</p>
                        <Link href="/" className="mt-2 text-sm font-semibold text-[#2f8d46] hover:underline">
                            Go home
                        </Link>
                    </div>
                )}

                {/* Charts */}
                {data && data.charts.length === 0 && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
                        <p className="text-sm text-zinc-500">This showcase has no charts.</p>
                    </div>
                )}

                {data && data.charts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {data.charts.map((chart, i) => (
                            <div
                                key={i}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col min-h-[300px] shadow-sm"
                            >
                                <div className="flex items-center gap-2 mb-4 shrink-0">
                                    <p className="flex-1 text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                                        {chart.title}
                                    </p>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700 shrink-0">
                                        {chart.type}
                                    </span>
                                </div>
                                <div className="flex-1 min-h-0">
                                    <ChartBody chart={chart} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
