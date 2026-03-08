import asyncio
import io
import os
import sqlite3
import uuid

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


def _write_to_sqlite(df: pd.DataFrame, db_path: str) -> None:
    """Run entirely in a single thread so SQLite is happy."""
    con = sqlite3.connect(db_path)
    try:
        con.execute("PRAGMA journal_mode=WAL")
        df.to_sql("data", con, index=False, if_exists="replace")
        con.commit()
    finally:
        con.close()


async def ingest(file_bytes: bytes, filename: str) -> dict:
    # Try utf-8 first, fall back to latin-1
    try:
        df = pd.read_csv(io.BytesIO(file_bytes), encoding="utf-8")
    except UnicodeDecodeError:
        try:
            df = pd.read_csv(io.BytesIO(file_bytes), encoding="latin-1")
        except Exception as e:
            raise ValueError(f"Could not parse CSV: {e}")

    # Convert datetime columns to strings for SQLite compatibility
    for col in df.columns:
        if pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = df[col].astype(str)

    dataset_id = str(uuid.uuid4())
    uploads_dir = os.path.join(os.path.dirname(__file__), "..", "data", "uploads")
    os.makedirs(uploads_dir, exist_ok=True)
    db_path = os.path.join(uploads_dir, f"{dataset_id}.db")

    # Offload blocking SQLite write to a thread — everything stays in the SAME thread
    await asyncio.to_thread(_write_to_sqlite, df, db_path)

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
