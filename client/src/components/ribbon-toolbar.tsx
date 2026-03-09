"use client"

import * as React from "react"
import Link from "next/link"
import {
    MousePointer2,
    SquarePlus,
    Layers2,
    SlidersHorizontal,
    Undo2,
    Redo2,
    Globe,
    Eye,
    ChevronDown,
    Database,
    Copy,
    ExternalLink,
    Loader2,
    Check,
} from "lucide-react"
import { getStoredDatasets, type UploadedDataset } from "@/lib/upload-api"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Image from "next/image"

type Tool = "select" | "add" | "layers" | "settings"
type PublishState = "idle" | "confirming" | "publishing" | "done" | "error"

export function RibbonToolbar({
    columns,
    onColumnsChange,
    name,
    onNameChange,
    datasetId,
    onDatasetChange,
    onPublish,
    hasCharts,
    onPreview,
}: {
    columns: number
    onColumnsChange: (n: number) => void
    name: string
    onNameChange: (val: string) => void
    datasetId: string | null
    onDatasetChange: (id: string | null) => void
    onPublish: () => Promise<string>
    hasCharts: boolean
    onPreview: () => void
}) {
    const [activeTool, setActiveTool] = React.useState<Tool>("select")
    const [dsMenuOpen, setDsMenuOpen] = React.useState(false)
    const [uploadedDatasets, setUploadedDatasets] = React.useState<UploadedDataset[]>([])
    const [publishState, setPublishState] = React.useState<PublishState>("idle")
    const [showcaseId, setShowcaseId] = React.useState<string | null>(null)
    const [publishError, setPublishError] = React.useState<string | null>(null)
    const [copied, setCopied] = React.useState(false)

    const showcaseUrl = showcaseId
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/showcase/${showcaseId}`
        : ""

    const handlePublishConfirm = async () => {
        setPublishState("publishing")
        setPublishError(null)
        try {
            const id = await onPublish()
            setShowcaseId(id)
            setPublishState("done")
        } catch (err) {
            setPublishError(err instanceof Error ? err.message : "Publish failed")
            setPublishState("error")
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(showcaseUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const resetPublish = () => {
        setPublishState("idle")
        setShowcaseId(null)
        setPublishError(null)
    }

    React.useEffect(() => {
        setUploadedDatasets(getStoredDatasets())
        const onStorage = () => setUploadedDatasets(getStoredDatasets())
        window.addEventListener("storage", onStorage)
        return () => window.removeEventListener("storage", onStorage)
    }, [])

    const activeDatasetName = datasetId
        ? (uploadedDatasets.find((d) => d.dataset_id === datasetId)?.filename ?? datasetId)
        : "Insurance (Default)"

    return (
        <TooltipProvider delayDuration={500}>
            <div className="h-9 border-b border-border bg-background flex items-center px-3 gap-1 shrink-0">
                {/* Brand / Home */}
                <Link href="/">
                    <Image src="/brand/logo.png" alt="Tathya" width={24} height={24} className="rounded-md" />
                </Link>

                <Separator orientation="vertical" className="h-4 mr-2 ml-1" />

                {/* Left tool group */}
                <div className="flex items-center gap-0.5">
                    <RibbonBtn
                        icon={<MousePointer2 className="size-[14px]" />}
                        label="Select"
                        active={activeTool === "select"}
                        onClick={() => setActiveTool("select")}
                    />
                    <RibbonBtn
                        icon={<SquarePlus className="size-[14px]" />}
                        label="Add Widget"
                        active={activeTool === "add"}
                        onClick={() => setActiveTool("add")}
                    />
                    <RibbonBtn
                        icon={<Layers2 className="size-[14px]" />}
                        label="Layers"
                        active={activeTool === "layers"}
                        onClick={() => setActiveTool("layers")}
                    />
                </div>

                <Separator orientation="vertical" className="h-4 mx-1.5" />

                <div className="flex items-center gap-0.5">
                    <RibbonBtn icon={<Undo2 className="size-[14px]" />} label="Undo" disabled />
                    <RibbonBtn icon={<Redo2 className="size-[14px]" />} label="Redo" disabled />
                </div>

                <Separator orientation="vertical" className="h-4 mx-1.5" />

                <RibbonBtn
                    icon={<SlidersHorizontal className="size-[14px]" />}
                    label="Chart Settings"
                    active={activeTool === "settings"}
                    onClick={() => setActiveTool("settings")}
                />

                <Separator orientation="vertical" className="h-4 mx-1.5" />

                {/* Dataset Selector */}
                <div className="relative">
                    <button
                        onClick={() => setDsMenuOpen((v) => !v)}
                        className="flex items-center gap-1.5 px-2.5 py-1 h-7 rounded-md text-[11px] font-semibold bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-[#2f8d46]/50 hover:text-[#2f8d46] transition-colors max-w-[180px]"
                    >
                        <Database className="size-3 shrink-0" />
                        <span className="truncate">{activeDatasetName}</span>
                        <ChevronDown className="size-3 shrink-0" />
                    </button>
                    {dsMenuOpen && (
                        <div className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                            <button
                                onClick={() => { onDatasetChange(null); setDsMenuOpen(false) }}
                                className={cn(
                                    "w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left",
                                    datasetId === null && "text-[#2f8d46] font-bold"
                                )}
                            >
                                <Database className="size-3.5 shrink-0 text-[#2f8d46]" />
                                <span>Insurance (Default)</span>
                                {datasetId === null && <span className="ml-auto text-[9px] bg-[#2f8d46]/10 text-[#2f8d46] px-1.5 py-0.5 rounded font-bold uppercase">Active</span>}
                            </button>
                            {uploadedDatasets.length > 0 && (
                                <>
                                    <div className="mx-3 my-1 border-t border-zinc-100 dark:border-zinc-800" />
                                    {uploadedDatasets.map((ds) => (
                                        <button
                                            key={ds.dataset_id}
                                            onClick={() => { onDatasetChange(ds.dataset_id); setDsMenuOpen(false) }}
                                            className={cn(
                                                "w-full flex items-center gap-2.5 px-3 py-2 text-[12px] font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-left",
                                                datasetId === ds.dataset_id && "text-[#2f8d46] font-bold"
                                            )}
                                        >
                                            <Database className="size-3.5 shrink-0 text-zinc-400" />
                                            <span className="truncate flex-1">{ds.filename}</span>
                                            {datasetId === ds.dataset_id && <span className="ml-auto text-[9px] bg-[#2f8d46]/10 text-[#2f8d46] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">Active</span>}
                                        </button>
                                    ))}
                                </>
                            )}
                            {uploadedDatasets.length === 0 && (
                                <div className="px-3 py-2.5">
                                    <p className="text-[11px] text-zinc-400 mb-2">No uploads yet</p>
                                    <a
                                        href="/dashboard"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 w-full px-2.5 py-1.5 rounded-md bg-[#2f8d46] text-white text-[11px] font-bold hover:bg-[#256d36] transition-colors"
                                    >
                                        <ExternalLink className="size-3 shrink-0" />
                                        Add dataset
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Dashboard Name Input */}
                <div className="flex items-center gap-2 group/title ml-1 max-w-[300px]">
                    <input
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="Untitled Dashboard"
                        className="bg-transparent border-none text-[13px] font-bold text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground w-full transition-all group-hover/title:bg-accent/30 rounded px-2 py-0.5"
                    />
                </div>

                {/* Right actions */}
                <div className="ml-auto flex items-center gap-3">
                    {/* Columns per row picker */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Cols</span>
                        <div className="flex items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden">
                            {[1, 2, 3, 4].map((n) => (
                                <button
                                    key={n}
                                    onClick={() => onColumnsChange(n)}
                                    className={cn(
                                        "w-6 h-6 text-[11px] font-bold transition-colors",
                                        columns === n
                                            ? "bg-foreground text-background"
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator orientation="vertical" className="h-4" />

                    <button
                        onClick={onPreview}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Eye className="size-3.5" />
                        Preview
                    </button>
                    <button
                        onClick={() => setPublishState("confirming")}
                        disabled={!hasCharts}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                        <Globe className="size-3" />
                        Publish
                    </button>
                </div>
            </div>

            {/* Publish Modal */}
            {publishState !== "idle" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
                        {publishState === "confirming" && (
                            <>
                                <div className="size-12 bg-[#2f8d46]/10 rounded-xl flex items-center justify-center mb-4">
                                    <Globe className="size-5 text-[#2f8d46]" />
                                </div>
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Publish dashboard?</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                                    This will create a public, read-only link for <span className="font-semibold text-zinc-700 dark:text-zinc-300">{name || "Untitled Dashboard"}</span> with all {`current charts`}.
                                </p>
                                <div className="flex gap-2.5">
                                    <button
                                        onClick={resetPublish}
                                        className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePublishConfirm}
                                        className="flex-1 py-2 rounded-lg bg-[#2f8d46] text-white text-sm font-bold hover:bg-[#256d36] transition-colors"
                                    >
                                        Publish
                                    </button>
                                </div>
                            </>
                        )}

                        {publishState === "publishing" && (
                            <div className="flex flex-col items-center gap-3 py-4">
                                <Loader2 className="size-8 text-[#2f8d46] animate-spin" />
                                <p className="text-sm font-semibold text-zinc-500">Publishing…</p>
                            </div>
                        )}

                        {publishState === "done" && (
                            <>
                                <div className="size-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4">
                                    <Check className="size-5 text-emerald-600" />
                                </div>
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Dashboard published!</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Your dashboard is now publicly viewable.</p>

                                <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 mb-4">
                                    <span className="flex-1 text-[11px] font-mono text-zinc-600 dark:text-zinc-300 truncate">{showcaseUrl}</span>
                                </div>

                                <div className="flex gap-2 mb-4">
                                    <button
                                        onClick={handleCopy}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                                        {copied ? "Copied!" : "Copy URL"}
                                    </button>
                                    <a
                                        href={showcaseUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#2f8d46] text-white text-sm font-bold hover:bg-[#256d36] transition-colors"
                                    >
                                        <ExternalLink className="size-3.5" />
                                        Open
                                    </a>
                                </div>
                                <button onClick={resetPublish} className="w-full text-center text-[11px] text-zinc-400 hover:text-zinc-600 transition-colors">
                                    Close
                                </button>
                            </>
                        )}

                        {publishState === "error" && (
                            <>
                                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">Publish failed</h2>
                                <p className="text-sm text-red-500 mb-4">{publishError}</p>
                                <div className="flex gap-2">
                                    <button onClick={resetPublish} className="flex-1 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors">
                                        Close
                                    </button>
                                    <button onClick={handlePublishConfirm} className="flex-1 py-2 rounded-lg bg-[#2f8d46] text-white text-sm font-bold hover:bg-[#256d36] transition-colors">
                                        Retry
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </TooltipProvider>
    )
}

function RibbonBtn({
    icon,
    label,
    active,
    onClick,
    disabled,
}: {
    icon: React.ReactNode
    label: string
    active?: boolean
    onClick?: () => void
    disabled?: boolean
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <button
                    onClick={onClick}
                    disabled={disabled}
                    className={cn(
                        "p-1.5 rounded-md transition-colors",
                        active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        disabled && "opacity-35 cursor-not-allowed pointer-events-none"
                    )}
                >
                    {icon}
                </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[10px] font-semibold py-1">
                {label}
            </TooltipContent>
        </Tooltip>
    )
}
