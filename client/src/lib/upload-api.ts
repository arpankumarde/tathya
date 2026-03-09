const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export type UploadedDataset = {
    dataset_id: string
    filename: string
    row_count: number
    columns: { name: string; type: string }[]
    uploaded_at: string
}

export type UploadResponse = {
    success: boolean
    dataset_id: string
    filename: string
    schema_info: {
        dataset_id: string
        filename: string
        row_count: number
        columns: { name: string; type: string }[]
    }
}

/**
 * Upload a CSV file to the server.
 * Returns the server response including the dataset_id.
 */
export async function uploadDataset(file: File, userId?: string): Promise<UploadResponse> {
    const form = new FormData()
    form.append("file", file)
    if (userId) form.append("user_id", userId)

    const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: form,
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Upload failed" }))
        throw new Error(err.detail ?? `HTTP ${res.status}`)
    }

    return res.json()
}

// ------- localStorage helpers -------

const LS_KEY = "tathya_datasets"

export function getStoredDatasets(): UploadedDataset[] {
    if (typeof window === "undefined") return []
    try {
        return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]")
    } catch {
        return []
    }
}

export function storeDataset(ds: UploadedDataset): void {
    const current = getStoredDatasets()
    // Replace if same id, else append
    const updated = [ds, ...current.filter((d) => d.dataset_id !== ds.dataset_id)]
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
}

export function removeStoredDataset(id: string): void {
    const updated = getStoredDatasets().filter((d) => d.dataset_id !== id)
    localStorage.setItem(LS_KEY, JSON.stringify(updated))
}
