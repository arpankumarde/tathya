import io
import os
import uuid

import aiosqlite
import pandas as pd


def detect_column_type(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        if pd.api.types.is_float_dtype(series):
            return "float"
        return "int"
    if pd.api.types.is_datetime64_any_dtype(series):
        return "date"
    try:
        pd.to_datetime(series.dropna().head(20))
        return "date"
    except Exception:
        pass
    if len(series) > 0 and series.nunique() / len(series) < 0.5:
        return "categorical"
    return "text"


async def ingest(file_bytes: bytes, filename: str) -> dict:
    # Try utf-8 first, fall back to latin-1
    try:
        df = pd.read_csv(io.BytesIO(file_bytes), encoding="utf-8")
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin-1")
        except Exception as e:
            raise ValueError(f"Could not parse CSV: {e}")

    dataset_id = str(uuid.uuid4())
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "data", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    db_path = os.path.join(uploads_dir, f"{dataset_id}.db")

    async with aiosqlite.connect(db_path) as conn:
        # Convert datetime columns to strings for SQLite compatibility
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                df[col] = df[col].astype(str)
        await conn.execute("PRAGMA journal_mode=WAL")
        # Use pandas to_sql via a sync connection — aiosqlite exposes the raw sqlite3 conn
        df.to_sql("data", conn._conn, index=False, if_exists="replace")
        await conn.commit()

    columns = []
    for col in df.columns:
        col_type = detect_column_type(df[col])
        sample = str(df[col].dropna().iloc[0]) if not df[col].dropna().empty else None
        columns.append({"name": col, "type": col_type, "sample": sample})

    return {
        "dataset_id": dataset_id,
        "filename": filename,
        "columns": columns,
        "row_count": len(df),
        "db_path": db_path,
    }
