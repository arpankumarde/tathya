const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export type ShowcaseChart = {
    type: string
    title: string
    x_axis?: { field: string; label: string } | null
    y_axis?: { field: string; label: string } | null
    group_by?: string | null
    data: Record<string, unknown>[]
}

export type ShowcaseData = {
    showcase_id: string
    dashboard_name: string
    charts: ShowcaseChart[]
    created_at: string
}

export async function publishDashboard(payload: {
    user_id?: string
    dataset_id?: string | null
    dashboard_name: string
    charts: ShowcaseChart[]
}): Promise<string> {
    const res = await fetch(`${API_BASE}/api/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Publish failed" }))
        throw new Error(err.detail ?? `HTTP ${res.status}`)
    }
    const data = await res.json()
    return data.showcase_id
}

export async function getShowcase(showcaseId: string): Promise<ShowcaseData> {
    const res = await fetch(`${API_BASE}/api/showcase/${encodeURIComponent(showcaseId)}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
