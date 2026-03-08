// Types mirroring the server's QueryResponse / ChartConfig models

export type AxisConfig = {
    field: string
    label: string
}

export type ChartConfig = {
    type: "bar" | "line" | "pie" | "scatter"
    title: string
    x_axis: AxisConfig | null
    y_axis: AxisConfig | null
    group_by: string | null
    data: Record<string, unknown>[]
}

export type QueryResponse = {
    success: boolean
    session_id: string
    charts: ChartConfig[]
    summary: string
    follow_up_suggestions: string[]
    error: string | null
}

export type QueryRequest = {
    query: string
    session_id?: string
    dataset_id?: string
    conversation_history?: { role: string; content: string }[]
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export async function postQuery(req: QueryRequest): Promise<QueryResponse> {
    const res = await fetch(`${API_BASE}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
    })
    if (!res.ok) throw new Error(`Server error ${res.status}`)
    return res.json()
}
