from fastapi import APIRouter, HTTPException, UploadFile

from core.models import DatasetSchema, FieldInfo, UploadResponse
from core.session import register_dataset
from services import csv_ingester

router = APIRouter()

MAX_SIZE = 50 * 1024 * 1024  # 50 MB


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(file: UploadFile):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted")

    contents = await file.read()

    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(contents) > MAX_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 50 MB limit")

    try:
        result = await csv_ingester.ingest(contents, file.filename)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    register_dataset(result["dataset_id"], result["db_path"])

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
