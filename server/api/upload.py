from datetime import datetime, timezone

from fastapi import APIRouter, Form, HTTPException, UploadFile

from core.database import get_db
from core.models import DatasetSchema, FieldInfo, UploadResponse
from core.session import register_dataset
from services import csv_ingester

router = APIRouter()

MAX_SIZE = 200 * 1024 * 1024  # 200 MB


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(file: UploadFile, user_id: str | None = Form(None)):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted")

    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 200 MB limit")

    try:
        result = await csv_ingester.ingest(contents, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    register_dataset(result["dataset_id"], result["db_path"])

    if user_id:
        await get_db()["datasets"].insert_one({
            "dataset_id": result["dataset_id"],
            "user_id": user_id,
            "filename": result["filename"],
            "row_count": result["row_count"],
            "uploaded_at": datetime.now(timezone.utc),
        })

    schema_info = DatasetSchema(
        dataset_id=result["dataset_id"],
        filename=result["filename"],
        columns=[FieldInfo(**col) for col in result["columns"]],
        row_count=result["row_count"],
    )

    return UploadResponse(
        success=True,
        dataset_id=result["dataset_id"],
        filename=result["filename"],
        schema_info=schema_info,
    )
