const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export type RecentConversation = {
    session_id: string
    last_accessed: string
    conversation_history: { role: string; content: string }[]
    active_dataset?: string | null
}

export type RecentDataset = {
    dataset_id: string
    filename: string
    row_count: number
    uploaded_at: string
}

export type UserRecent = {
    conversations: RecentConversation[]
    datasets: RecentDataset[]
}

export async function getUserRecent(userId: string): Promise<UserRecent> {
    const res = await fetch(`${API_BASE}/api/user/${encodeURIComponent(userId)}/recent`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
}
