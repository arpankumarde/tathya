"use client"

import * as React from "react"
import { Loader2, Sparkles, PlusCircle, X, GripVertical } from "lucide-react"
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    SortableContext,
    useSortable,
    rectSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import type { ChartInstance } from "@/app/app/[id]/page"

const PIE_COLORS = [
    "#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6",
    "#06b6d4", "#f97316", "#ec4899", "#84cc16", "#14b8a6",
]

type Props = {
    charts: ChartInstance[]
    summary: string
    isLoading: boolean
    columns: number
    onRemove: (instanceId: string) => void
    onReorder: (newOrder: ChartInstance[]) => void
    suggestions: string[]
    onSuggestionClick: (query: string) => void
}

export function DashboardCanvas({ charts, summary, isLoading, columns, onRemove, onReorder, suggestions, onSuggestionClick }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over || active.id === over.id) return
        const oldIndex = charts.findIndex((c) => c.instanceId === active.id)
        const newIndex = charts.findIndex((c) => c.instanceId === over.id)
        onReorder(arrayMove(charts, oldIndex, newIndex))
    }

    return (
        <div
            className="flex-1 min-h-0 overflow-auto bg-zinc-50 dark:bg-zinc-950 relative"
            style={{
                backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
                backgroundSize: "20px 20px",
            }}
        >
            {/* Loading overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="size-8 text-emerald-500 animate-spin" />
                        <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Generating charts...</p>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && charts.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="size-16 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                        <PlusCircle className="size-8 text-zinc-300 dark:text-zinc-600" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">No charts yet</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 max-w-xs">
                            Use the chat panel or click a suggestion below.
                        </p>
                    </div>
                    {/* Suggestion pills */}
                    {suggestions.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm">
                            {suggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => onSuggestionClick(s)}
                                    className="cursor-pointer px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all shadow-sm"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Charts */}
            {charts.length > 0 && (
                <div className="p-5 flex flex-col gap-4">
                    {/* Latest summary */}
                    {summary && (
                        <div className="flex items-start gap-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 shrink-0">
                            <Sparkles className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[12px] text-zinc-600 dark:text-zinc-300 leading-relaxed">{summary}</p>
                        </div>
                    )}

                    {/* DnD sortable grid */}
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={charts.map((c) => c.instanceId)} strategy={rectSortingStrategy}>
                            <div
                                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                                className="grid gap-4"
                            >
                                {charts.map((chart) => (
                                    <SortableChartCard
                                        key={chart.instanceId}
                                        chart={chart}
                                        onRemove={onRemove}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            )}
        </div>
    )
}

// ── Sortable wrapper ──────────────────────────────────────────────────────────

function SortableChartCard({ chart, onRemove }: { chart: ChartInstance; onRemove: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: chart.instanceId,
    })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : undefined,
    }

    return (
        <div ref={setNodeRef} style={style} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col min-h-[300px] group/card relative shadow-sm hover:shadow-md transition-shadow">
            {/* Card header */}
            <div className="flex items-center gap-2 mb-4 shrink-0">
                {/* Drag handle */}
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 transition-colors touch-none"
                    title="Drag to reorder"
                >
                    <GripVertical className="size-4" />
                </button>

                <p className="flex-1 text-[12px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight pr-1 truncate">
                    {chart.title}
                </p>

                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-0.5 rounded-full border border-zinc-100 dark:border-zinc-700 shrink-0">
                    {chart.type}
                </span>

                {/* Remove button */}
                <button
                    onClick={() => onRemove(chart.instanceId)}
                    className="size-5 rounded-md flex items-center justify-center text-zinc-300 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                    title="Remove chart"
                >
                    <X className="size-3.5" />
                </button>
            </div>

            {/* Chart body */}
            <div className="flex-1 min-h-0">
                <ChartBody chart={chart} />
            </div>
        </div>
    )
}

// ── Chart body switcher ────────────────────────────────────────────────────────

function ChartBody({ chart }: { chart: ChartInstance }) {
    const xField = chart.x_axis?.field ?? ""
    const yField = chart.y_axis?.field ?? ""
    const xLabel = chart.x_axis?.label ?? xField
    const yLabel = chart.y_axis?.label ?? yField
    const data = chart.data.slice(0, 25)

    switch (chart.type) {
        case "line":
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey={xField}
                            tick={{ fontSize: 9, fill: "#a1a1aa" }}
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} width={48} />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }}
                            labelStyle={{ fontWeight: 700 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
                        <Line
                            type="monotone"
                            dataKey={yField}
                            name={yLabel}
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 2.5, fill: "#10b981" }}
                            activeDot={{ r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )

        case "pie":
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={yField}
                            nameKey={xField}
                            cx="50%"
                            cy="45%"
                            outerRadius="65%"
                            label={({ name, percent }) =>
                                `${String(name).slice(0, 10)} ${((percent ?? 0) * 100).toFixed(1)}%`
                            }
                            labelLine={false}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }}
                            formatter={(v: unknown) => (typeof v === "number" ? v : Number(v)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        />
                        <Legend wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                    </PieChart>
                </ResponsiveContainer>
            )

        default: // "bar" and any unrecognised types
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey={xField}
                            tick={{ fontSize: 9, fill: "#a1a1aa" }}
                            angle={-35}
                            textAnchor="end"
                            interval={0}
                        />
                        <YAxis tick={{ fontSize: 9, fill: "#a1a1aa" }} width={48} />
                        <Tooltip
                            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }}
                            labelStyle={{ fontWeight: 700 }}
                            formatter={(v: unknown) => (typeof v === "number" ? v : Number(v)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        />
                        <Bar dataKey={yField} name={yLabel} fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )
    }
}
