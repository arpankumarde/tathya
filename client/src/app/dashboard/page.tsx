"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import {
    MessageSquare,
    Database,
    Clock,
    Upload,
    Trash2,
    CheckCircle2,
    Loader2,
    Table2,
    Sparkles,
    ArrowRight,
    BarChart3,
    FileText,
    Zap,
    Plus,
} from "lucide-react"
import {
    uploadDataset,
    getStoredDatasets,
    storeDataset,
    removeStoredDataset,
    type UploadedDataset,
} from "@/lib/upload-api"
import { getUserRecent, type RecentConversation, type RecentDataset } from "@/lib/user-api"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import { v7 as uuidv7 } from "uuid"

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function getGreeting(): string {
    const h = new Date().getHours()
    if (h < 12) return "Good morning"
    if (h < 17) return "Good afternoon"
    return "Good evening"
}

function getInitials(name: string | null): string {
    if (!name) return "U"
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
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
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        return onAuthStateChanged(auth, (u) => setUser(u))
    }, [])

    React.useEffect(() => {
        setDatasets(getStoredDatasets())
    }, [])

    React.useEffect(() => {
        if (!user) return
        setLoading(true)
        getUserRecent(user.uid)
            .then((data) => {
                setRecentConversations(data.conversations)
                setRecentDatasets(data.datasets)
            })
            .catch(() => { })
            .finally(() => setLoading(false))
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
            if (user) {
                getUserRecent(user.uid)
                    .then((data) => {
                        setRecentConversations(data.conversations)
                        setRecentDatasets(data.datasets)
                    })
                    .catch(() => { })
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

    const totalQueries = recentConversations.length
    const totalDatasets = mergedDatasets.length
    const lastActive =
        recentConversations[0]?.last_accessed
            ? timeAgo(recentConversations[0].last_accessed)
            : null

    const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? null

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 relative overflow-hidden">
            {/* Background dot pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.07]"
                style={{
                    backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[360px] bg-[#2f8d46]/6 blur-[130px] rounded-full pointer-events-none" />

            <Navbar />

            <main className="relative pt-24 pb-20 px-5 md:px-12 max-w-7xl mx-auto space-y-10">

                {/* ── Welcome Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="size-12 rounded-2xl bg-gradient-to-br from-[#2f8d46] to-[#1a6b30] flex items-center justify-center text-white text-lg font-black shadow-lg shadow-[#2f8d46]/20 shrink-0">
                            {user?.photoURL ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={user.photoURL} alt="avatar" className="size-12 rounded-2xl object-cover" />
                            ) : (
                                getInitials(displayName)
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-zinc-400 font-medium">
                                {getGreeting()}{displayName ? `, ${displayName.split(" ")[0]}` : ""}
                            </p>
                            <h1 className="text-2xl font-extrabold text-[#212121] dark:text-zinc-100 tracking-tight leading-tight">
                                Your Dashboard
                            </h1>
                        </div>
                    </div>

                    <Link href={`/app/${uuidv7()}`}>
                        <button className="flex items-center gap-2 h-10 bg-[#2f8d46] text-white px-5 rounded-xl text-sm font-bold hover:bg-[#256d36] shadow-md shadow-[#2f8d46]/20 hover:shadow-lg transition-all active:scale-[0.98]">
                            <Plus className="size-4" />
                            New Report
                        </button>
                    </Link>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatCard
                        icon={<BarChart3 className="size-5 text-[#2f8d46]" />}
                        label="Total Queries"
                        value={loading ? "—" : String(totalQueries)}
                        sub={totalQueries === 0 ? "No queries yet" : totalQueries === 1 ? "1 conversation" : `${totalQueries} conversations`}
                    />
                    <StatCard
                        icon={<Database className="size-5 text-[#2f8d46]" />}
                        label="My Datasets"
                        value={loading ? "—" : String(totalDatasets)}
                        sub={totalDatasets === 0 ? "No datasets uploaded" : `${totalDatasets} CSV file${totalDatasets !== 1 ? "s" : ""} available`}
                    />
                    <StatCard
                        icon={<Clock className="size-5 text-[#2f8d46]" />}
                        label="Last Active"
                        value={loading ? "—" : (lastActive ?? "Never")}
                        sub={lastActive ? "Most recent query" : "Start a new report!"}
                    />
                </div>

                {/* ── Main Content Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* LEFT: Datasets Manager (spans 3 cols) */}
                    <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-[#212121] dark:text-zinc-100 flex items-center gap-2">
                                    <FileText className="size-4 text-[#2f8d46]" />
                                    My Datasets
                                </h2>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Upload CSVs and query them with AI</p>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 h-8 px-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-[#2f8d46]/10 hover:border-[#2f8d46]/30 hover:text-[#2f8d46] transition-all"
                            >
                                <Upload className="size-3.5" />
                                Upload
                            </button>
                        </div>

                        <div className="p-5 flex flex-col gap-4 flex-1">
                            {/* Hidden file input */}
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

                            {/* Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    setDragging(false)
                                    const file = e.dataTransfer.files[0]
                                    if (file) handleFile(file)
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                    "border-2 border-dashed rounded-xl py-5 flex items-center justify-center gap-3 cursor-pointer transition-all",
                                    dragging
                                        ? "border-[#2f8d46] bg-[#2f8d46]/5"
                                        : "border-zinc-200 dark:border-zinc-700 hover:border-[#2f8d46]/40 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                )}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="size-5 text-[#2f8d46] animate-spin" />
                                        <span className="text-sm font-semibold text-zinc-500">Uploading & processing…</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="size-10 bg-[#2f8d46]/10 rounded-xl flex items-center justify-center">
                                            <Upload className="size-4 text-[#2f8d46]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                                Drag & drop or <span className="text-[#2f8d46] underline">browse</span>
                                            </p>
                                            <p className="text-[11px] text-zinc-400 mt-0.5">Max 200 MB · .csv files only</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Status Messages */}
                            {uploadSuccess && (
                                <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 className="size-4 shrink-0" />
                                    {uploadSuccess}
                                </div>
                            )}
                            {uploadError && (
                                <div className="px-3 py-2.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
                                    {uploadError}
                                </div>
                            )}

                            {/* Dataset List */}
                            {mergedDatasets.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-6 gap-3">
                                    <div className="size-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center">
                                        <Database className="size-5 text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                    <p className="text-sm text-zinc-400 text-center">
                                        No datasets yet. Upload a CSV to get started.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {mergedDatasets.map((ds) => (
                                        <DatasetCard
                                            key={ds.dataset_id}
                                            ds={ds}
                                            onDelete={() => deleteDataset(ds.dataset_id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: Recent Queries (spans 2 cols) */}
                    <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-[#212121] dark:text-zinc-100 flex items-center gap-2">
                                    <MessageSquare className="size-4 text-[#2f8d46]" />
                                    Recent Queries
                                </h2>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Continue from where you left off</p>
                            </div>
                            <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex items-center justify-center h-32">
                                    <Loader2 className="size-5 text-zinc-300 animate-spin" />
                                </div>
                            ) : recentConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-32 gap-3 px-6">
                                    <Sparkles className="size-6 text-zinc-200 dark:text-zinc-700" />
                                    <p className="text-sm text-zinc-400 text-center">
                                        No queries yet. Start your first report!
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
                                    {recentConversations.slice(0, 8).map((conv, i) => {
                                        const firstMsg =
                                            conv.conversation_history[0]?.content ?? "Untitled query"
                                        const label =
                                            firstMsg.length > 52
                                                ? firstMsg.slice(0, 52) + "…"
                                                : firstMsg
                                        const sessionLink = `/app/${conv.session_id}`
                                        return (
                                            <Link key={conv.session_id} href={sessionLink}>
                                                <div className="group flex items-start gap-3.5 px-5 py-3.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors cursor-pointer">
                                                    <div
                                                        className={cn(
                                                            "size-8 rounded-xl shrink-0 flex items-center justify-center",
                                                            i === 0
                                                                ? "bg-[#2f8d46] text-white"
                                                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                                                        )}
                                                    >
                                                        <MessageSquare className="size-3.5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug truncate">
                                                            {label}
                                                        </p>
                                                        <p className="text-[11px] text-zinc-400 mt-0.5">
                                                            {timeAgo(conv.last_accessed)}
                                                            {conv.active_dataset && (
                                                                <span className="ml-1.5 inline-flex items-center gap-0.5 text-[#2f8d46]">
                                                                    · <Database className="size-2.5" /> dataset
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="size-3.5 text-zinc-300 group-hover:text-[#2f8d46] transition-colors shrink-0 mt-1" />
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800">
                            <Link href={`/app/${uuidv7()}`}>
                                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-[#2f8d46]/10 hover:border-[#2f8d46]/30 hover:text-[#2f8d46] transition-all">
                                    <Zap className="size-3.5" />
                                    Start New Report
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

/* ─── Sub-components ─── */

function StatCard({
    icon,
    label,
    value,
    sub,
}: {
    icon: React.ReactNode
    label: string
    value: string
    sub: string
}) {
    return (
        <div className="group bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:shadow-[#2f8d46]/5 hover:border-[#2f8d46]/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="size-9 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl flex items-center justify-center group-hover:bg-[#2f8d46]/10 group-hover:border-[#2f8d46]/20 transition-colors">
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-black text-[#212121] dark:text-zinc-100 tracking-tight">{value}</p>
            <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mt-0.5">{label}</p>
            <p className="text-[11px] text-zinc-400 mt-1">{sub}</p>
        </div>
    )
}

function DatasetCard({
    ds,
    onDelete,
}: {
    ds: UploadedDataset
    onDelete: () => void
}) {
    const newSessionId = uuidv7()
    return (
        <div className="group relative bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700 rounded-xl p-4 hover:border-[#2f8d46]/30 hover:bg-white dark:hover:bg-zinc-800 transition-all">
            <div className="flex items-start justify-between mb-3">
                <div className="size-8 bg-[#2f8d46]/10 rounded-lg flex items-center justify-center">
                    <Table2 className="size-4 text-[#2f8d46]" />
                </div>
                <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                >
                    <Trash2 className="size-3.5" />
                </button>
            </div>

            <p
                className="text-sm font-bold text-zinc-800 dark:text-zinc-100 truncate"
                title={ds.filename}
            >
                {ds.filename}
            </p>

            <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                    <Database className="size-3" />
                    {ds.row_count.toLocaleString()} rows
                </span>
                {ds.columns.length > 0 && (
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                        {ds.columns.length} cols
                    </span>
                )}
            </div>

            <Link href={`/app/${newSessionId}?dataset=${ds.dataset_id}`}>
                <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-[11px] font-bold text-zinc-500 dark:text-zinc-300 hover:bg-[#2f8d46] hover:border-[#2f8d46] hover:text-white transition-all">
                    <Sparkles className="size-3" />
                    Query this dataset
                </button>
            </Link>
        </div>
    )
}

function cn(...classes: (string | undefined | false | null)[]) {
    return classes.filter(Boolean).join(" ")
}
