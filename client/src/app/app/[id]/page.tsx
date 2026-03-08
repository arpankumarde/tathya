"use client"

import * as React from "react"
import { RibbonToolbar } from "@/components/ribbon-toolbar"
import { DashboardCanvas } from "@/components/dashboard-canvas"
import { NarrowChat } from "@/components/narrow-chat"
import { postQuery, type ChartConfig } from "@/lib/query-api"

const INSURANCE_SUGGESTIONS = [
    "Show average claims per insurer",
    "Compare revenue by quarter",
    "Top 10 insurers by pending claims",
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
    const [chartInstances, setChartInstances] = React.useState<ChartInstance[]>([])
    const [sessionId, setSessionId] = React.useState<string | undefined>(undefined)
    const [isLoading, setIsLoading] = React.useState(false)
    const [summary, setSummary] = React.useState<string>("")
    const [columns, setColumns] = React.useState(2)

    const [dashboardName, setDashboardName] = React.useState("Untitled Dashboard")
    const [datasetId, setDatasetId] = React.useState<string | null>(null)

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
            const result = await postQuery({ query, session_id: sessionId, dataset_id: datasetId ?? undefined })
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
    }, [sessionId, datasetId])

    const removeChart = React.useCallback((instanceId: string) => {
        setChartInstances((prev) => prev.filter((c) => c.instanceId !== instanceId))
    }, [])

    const reorderCharts = React.useCallback((newOrder: ChartInstance[]) => {
        setChartInstances(newOrder)
    }, [])

    const activeSuggestions = datasetId === null ? INSURANCE_SUGGESTIONS : GENERIC_SUGGESTIONS

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
                />
                <DashboardCanvas
                    charts={chartInstances}
                    summary={summary}
                    isLoading={isLoading}
                    columns={columns}
                    onRemove={removeChart}
                    onReorder={reorderCharts}
                    suggestions={activeSuggestions}
                    onSuggestionClick={(q) => { handleQuery(q) }}
                />
            </div>
            <NarrowChat onQuery={handleQuery} datasetId={datasetId} />
        </div>
    )
}
