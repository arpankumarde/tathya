"use client"

import * as React from "react"
import { RibbonToolbar } from "@/components/ribbon-toolbar"
import { DashboardCanvas } from "@/components/dashboard-canvas"
import { NarrowChat, type NarrowChatHandle } from "@/components/narrow-chat"
import { ArrowLeft } from "lucide-react"
import { postQuery, type ChartConfig } from "@/lib/query-api"
import { publishDashboard } from "@/lib/publish-api"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"

const INSURANCE_SUGGESTIONS = [
    "Top 5 insurers by amount in pie graph",
    "Top 10 insurers by pending claims",
    "Describe the dataset"
]

const GENERIC_SUGGESTIONS = [
    "Show distribution of values",
    "Top 10 rows by highest value",
    "Compare columns across categories",
]

// Each chart card gets a unique instance id so it can be removed/reordered
export type ChartInstance = ChartConfig & { instanceId: string }

export default function AppPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params)
    const [user, setUser] = React.useState<User | null>(null)
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u)
        })
        return unsub
    }, [])
    const [chartInstances, setChartInstances] = React.useState<ChartInstance[]>([])
    const [sessionId, setSessionId] = React.useState<string | undefined>(undefined)
    const [isLoading, setIsLoading] = React.useState(false)
    const [summary, setSummary] = React.useState<string>("")
    const [columns, setColumns] = React.useState(2)

    const [dashboardName, setDashboardName] = React.useState("Untitled Dashboard")
    const [datasetId, setDatasetId] = React.useState<string | null>(null)
    const [isPreview, setIsPreview] = React.useState(false)
    const chatRef = React.useRef<NarrowChatHandle>(null)

    // When datasetId changes, reset session so charts use the new data source
    const prevDatasetRef = React.useRef<string | null>(null)
    React.useEffect(() => {
        if (prevDatasetRef.current !== datasetId) {
            prevDatasetRef.current = datasetId
            setSessionId(undefined)
            setChartInstances([])
            setSummary("")
        }
    }, [datasetId])

    const handleQuery = React.useCallback(async (query: string): Promise<{
        summary: string
        suggestions: string[]
        error: string | null
    }> => {
        setIsLoading(true)
        try {
            const result = await postQuery({ query, session_id: sessionId, dataset_id: datasetId ?? undefined, user_id: user?.uid })
            if (result.success) {
                // Accumulate: append new charts to existing ones
                const newInstances: ChartInstance[] = result.charts.map((c) => ({
                    ...c,
                    instanceId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                }))
                setChartInstances((prev) => [...prev, ...newInstances])
                setSummary(result.summary)
                setSessionId(result.session_id)
                return {
                    summary: result.summary,
                    suggestions: result.follow_up_suggestions,
                    error: null,
                }
            } else {
                return { summary: "", suggestions: [], error: result.error ?? "Unknown error" }
            }
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to reach the server."
            return { summary: "", suggestions: [], error: msg }
        } finally {
            setIsLoading(false)
        }
    }, [sessionId, datasetId, user?.uid])

    const removeChart = React.useCallback((instanceId: string) => {
        setChartInstances((prev) => prev.filter((c) => c.instanceId !== instanceId))
    }, [])

    const reorderCharts = React.useCallback((newOrder: ChartInstance[]) => {
        setChartInstances(newOrder)
    }, [])

    const handlePublish = React.useCallback(async () => {
        return publishDashboard({
            user_id: user?.uid,
            dataset_id: datasetId,
            dashboard_name: dashboardName,
            charts: chartInstances,
        })
    }, [user, datasetId, dashboardName, chartInstances])

    const activeSuggestions = datasetId === null ? INSURANCE_SUGGESTIONS : GENERIC_SUGGESTIONS

    if (isPreview) {
        return (
            <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
                <div className="h-9 border-b border-border bg-background flex items-center justify-between px-4 shrink-0">
                    <span className="text-sm font-bold text-foreground truncate">{dashboardName || "Untitled Dashboard"}</span>
                    <button
                        onClick={() => setIsPreview(false)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
                    >
                        <ArrowLeft className="size-3.5" />
                        Exit Preview
                    </button>
                </div>
                <DashboardCanvas
                    charts={chartInstances}
                    summary={summary}
                    isLoading={isLoading}
                    columns={columns}
                    onRemove={removeChart}
                    onReorder={reorderCharts}
                    suggestions={activeSuggestions}
                    onSuggestionClick={() => {}}
                />
            </div>
        )
    }

    return (
        <div className="h-screen w-screen overflow-hidden flex bg-background text-foreground">
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                <RibbonToolbar
                    columns={columns}
                    onColumnsChange={setColumns}
                    name={dashboardName}
                    onNameChange={setDashboardName}
                    datasetId={datasetId}
                    onDatasetChange={setDatasetId}
                    onPublish={handlePublish}
                    hasCharts={chartInstances.length > 0}
                    onPreview={() => setIsPreview(true)}
                />
                <DashboardCanvas
                    charts={chartInstances}
                    summary={summary}
                    isLoading={isLoading}
                    columns={columns}
                    onRemove={removeChart}
                    onReorder={reorderCharts}
                    suggestions={activeSuggestions}
                    onSuggestionClick={(q) => { chatRef.current?.populate(q) }}
                />
            </div>
            <NarrowChat ref={chatRef} onQuery={handleQuery} datasetId={datasetId} />
        </div>
    )
}
