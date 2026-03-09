"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import {
    MessageSquare,
    PieChart,
    TrendingUp,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Upload,
    Database,
    Trash2,
    CheckCircle2,
    Loader2,
    Table2,
} from "lucide-react"
import {
    uploadDataset,
    getStoredDatasets,
    storeDataset,
    removeStoredDataset,
    type UploadedDataset,
} from "@/lib/upload-api"
import { getUserRecent, RecentDataset, type RecentConversation } from "@/lib/user-api"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

export default function DashboardPage() {
    const [user, setUser] = React.useState<User | null>(null)
    const [datasets, setDatasets] = React.useState<UploadedDataset[]>([])
    const [uploading, setUploading] = React.useState(false)
    const [uploadError, setUploadError] = React.useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = React.useState(false)
    const [recentConversations, setRecentConversations] = React.useState<RecentConversation[]>([])
    const [recentDatasets, setRecentDatasets] = React.useState<RecentDataset[]>([])

    // Track Firebase auth
    React.useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u))
    }, [])

    // Load localStorage datasets
    React.useEffect(() => {
        setDatasets(getStoredDatasets())
    }, [])

    // Fetch recent data from server when user is known
    React.useEffect(() => {
        if (!user) return
        getUserRecent(user.uid).then((data) => {
            setRecentConversations(data.conversations)
            setRecentDatasets(data.datasets)
        }).catch(() => {/* silently ignore if server unreachable */})
    }, [user])

    const handleFile = async (file: File) => {
        if (!file.name.toLowerCase().endsWith(".csv")) {
            setUploadError("Only .csv files are accepted")
            return
        }
        setUploading(true)
        setUploadError(null)
        setUploadSuccess(null)
        try {
            const res = await uploadDataset(file, user?.uid)
            const ds: UploadedDataset = {
                dataset_id: res.dataset_id,
                filename: res.filename,
                row_count: res.schema_info.row_count,
                columns: res.schema_info.columns,
                uploaded_at: new Date().toISOString(),
            }
            storeDataset(ds)
            setDatasets(getStoredDatasets())
            setUploadSuccess(`"${res.filename}" uploaded successfully!`)
            // Refresh recent datasets from server
            if (user) {
                getUserRecent(user.uid).then((data) => {
                    setRecentConversations(data.conversations)
                    setRecentDatasets(data.datasets)
                }).catch(() => {})
            }
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : "Upload failed")
        } finally {
            setUploading(false)
        }
    }

    const deleteDataset = (id: string) => {
        removeStoredDataset(id)
        setDatasets(getStoredDatasets())
    }

    // Merge localStorage + server datasets (server takes precedence for dedup)
    const mergedDatasets = React.useMemo(() => {
        const serverIds = new Set(recentDatasets.map((d) => d.dataset_id))
        const localOnly = datasets.filter((d) => !serverIds.has(d.dataset_id))
        const serverAsLocal: UploadedDataset[] = recentDatasets.map((d) => ({
            dataset_id: d.dataset_id,
            filename: d.filename,
            row_count: d.row_count,
            columns: [],
            uploaded_at: d.uploaded_at,
        }))
        return [...serverAsLocal, ...localOnly]
    }, [datasets, recentDatasets])

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.1]"
                style={{
                    backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                }}
            />

            {/* Aura Gloom */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[400px] bg-[#2f8d46]/5 blur-[120px] rounded-full pointer-events-none" />

            <Navbar />

            <main className="relative pt-24 pb-16 px-6 md:px-12 max-w-7xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-full bg-[#2f8d46]/10 text-[#2f8d46] text-[10px] font-bold uppercase tracking-wider">
                                Overview
                            </span>
                            <span className="text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">
                                Updated 2 mins ago
                            </span>
                        </div>
                        <h1 className="text-3xl font-extrabold text-[#212121] dark:text-zinc-100 tracking-tight">
                            Dashboard Overview
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1 max-w-md">
                            Welcome back! Here's a snapshot of your business performance today.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button className="h-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 rounded-lg text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm transition-all flex items-center gap-2">
                            <Calendar className="size-4" />
                            <span>This Month</span>
                        </button>
                        <Link href="/app">
                            <button className="h-10 bg-[#2f8d46] text-white px-5 rounded-lg text-sm font-bold hover:bg-[#256d36] shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                                New Report
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <StatCard
                        title="Total Revenue"
                        value="$48,260"
                        change="+12.5%"
                        data={[40, 35, 50, 45, 60, 55, 75, 70, 85]}
                        icon={<TrendingUp className="size-5 text-[#2f8d46]" />}
                    />
                    <StatCard
                        title="Active Users"
                        value="3,841"
                        change="+4.2%"
                        data={[30, 40, 35, 50, 45, 55, 50, 65, 60]}
                        icon={<Users className="size-5 text-[#2f8d46]" />}
                    />
                    <StatCard
                        title="Conv. Rate"
                        value="4.82%"
                        change="-0.4%"
                        data={[60, 55, 65, 50, 55, 45, 50, 40, 42]}
                        negative
                        icon={<PieChart className="size-5 text-[#2f8d46]" />}
                    />
                    <StatCard
                        title="Session Time"
                        value="12m 45s"
                        change="+18%"
                        data={[20, 30, 40, 35, 50, 45, 60, 55, 70]}
                        icon={<MessageSquare className="size-5 text-[#2f8d46]" />}
                    />
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Datasets */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-[#212121] dark:text-zinc-100">My Datasets</h3>
                            <p className="text-xs text-zinc-400 font-medium mt-0.5">Upload CSV files to query them in your dashboards</p>
                        </div>

                        {/* Upload Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault()
                                setDragging(false)
                                const file = e.dataTransfer.files[0]
                                if (file) handleFile(file)
                            }}
                            className={cn(
                                "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer",
                                dragging
                                    ? "border-[#2f8d46] bg-[#2f8d46]/5"
                                    : "border-zinc-200 dark:border-zinc-700 hover:border-[#2f8d46]/50 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            )}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFile(file)
                                    e.target.value = ""
                                }}
                            />
                            {uploading ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="size-10 text-[#2f8d46] animate-spin" />
                                    <p className="text-sm font-semibold text-zinc-500">Uploading & processing…</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-14 bg-[#2f8d46]/10 rounded-2xl flex items-center justify-center">
                                        <Upload className="size-6 text-[#2f8d46]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                            Drag & drop a CSV file here, or <span className="text-[#2f8d46] underline">browse</span>
                                        </p>
                                        <p className="text-xs text-zinc-400 mt-1">Max 200 MB · .csv files only</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status messages */}
                        {uploadSuccess && (
                            <div className="flex items-center gap-2.5 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-400">
                                <CheckCircle2 className="size-4 shrink-0" />
                                {uploadSuccess}
                            </div>
                        )}
                        {uploadError && (
                            <div className="flex items-center gap-2.5 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                                {uploadError}
                            </div>
                        )}

                        {/* Dataset list */}
                        {mergedDatasets.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {mergedDatasets.map((ds) => (
                                    <div key={ds.dataset_id} className="group bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700 rounded-xl p-4 hover:border-[#2f8d46]/30 transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="size-8 bg-[#2f8d46]/10 rounded-lg flex items-center justify-center">
                                                <Table2 className="size-4 text-[#2f8d46]" />
                                            </div>
                                            <button
                                                onClick={() => deleteDataset(ds.dataset_id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                                            >
                                                <Trash2 className="size-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate" title={ds.filename}>
                                            {ds.filename}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                                                <Database className="size-3" />
                                                {ds.row_count.toLocaleString()} rows
                                            </span>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                                                {ds.columns.length} cols
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Side Section / Recent Conversations */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-[#212121] dark:text-zinc-100 italic">Recent Queries</h3>
                            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="flex-1 space-y-7 relative">
                            {/* Timeline Line */}
                            <div className="absolute left-4 top-0 bottom-4 w-px bg-zinc-100 dark:bg-zinc-800" />

                            {recentConversations.length === 0 ? (
                                <p className="text-sm text-zinc-400 pl-10">No conversations yet. Start a new report!</p>
                            ) : (
                                recentConversations.map((conv, i) => {
                                    const firstMsg = conv.conversation_history[0]?.content ?? "Query"
                                    const label = firstMsg.length > 48 ? firstMsg.slice(0, 48) + "…" : firstMsg
                                    return (
                                        <ActivityItem
                                            key={conv.session_id}
                                            user={label}
                                            action=""
                                            time={timeAgo(conv.last_accessed)}
                                            avatar={<MessageSquare className="size-3.5" />}
                                            active={i === 0}
                                        />
                                    )
                                })
                            )}
                        </div>

                        <Link href="/app/new">
                            <button className="mt-8 w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all">
                                New Report
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

function StatCard({
    title,
    value,
    change,
    icon,
    data,
    negative
}: {
    title: string,
    value: string,
    change: string,
    icon: React.ReactNode,
    data: number[],
    negative?: boolean
}) {
    return (
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#2f8d46]/5 hover:border-[#2f8d46]/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-5">
                <div className="size-10 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700/50 rounded-xl flex items-center justify-center group-hover:bg-[#2f8d46]/10 group-hover:border-[#2f8d46]/20 transition-colors">
                    {icon}
                </div>
                <div className={cn(
                    "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
                    negative ? "bg-red-50 text-red-600" : "bg-emerald-50 text-[#2f8d46]"
                )}>
                    {negative ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
                    {change}
                </div>
            </div>

            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-zinc-400 dark:text-zinc-500 text-[10px] font-extrabold uppercase tracking-widest mb-1">{title}</p>
                    <p className="text-2xl font-black text-[#212121] dark:text-zinc-100 tracking-tight">{value}</p>
                </div>

                {/* Sparkline mini-chart */}
                <div className="flex items-end gap-0.5 h-8 w-20 pt-1">
                    {data.map((h, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex-1 rounded-t-[1px] transition-all",
                                negative ? "bg-red-200 group-hover:bg-red-400" : "bg-emerald-200 group-hover:bg-[#2f8d46]"
                            )}
                            style={{ height: `${h}%` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function ActivityItem({
    user,
    action,
    time,
    avatar,
    active
}: {
    user: string,
    action: string,
    time: string,
    avatar: string | React.ReactNode,
    active?: boolean
}) {
    return (
        <div className="flex items-start gap-4 relative z-10">
            <div className={cn(
                "size-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold transition-all shadow-sm",
                active
                    ? "bg-[#2f8d46] text-white ring-4 ring-[#2f8d46]/10"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            )}>
                {avatar}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-tight">
                    <span className="font-bold text-[#212121] dark:text-white">{user}</span> {action}
                </p>
                <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wide mt-1">{time}</p>
            </div>
        </div>
    )
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}
