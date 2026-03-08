import json
from datetime import datetime

from fastapi import APIRouter

from core.database import get_db
from core.models import CollectionInfo, FieldInfo, SchemaResponse

router = APIRouter()

# Simple in-process cache
_schema_cache: SchemaResponse | None = None


def infer_type(value) -> str:
    if isinstance(value, float):
        return "float"
    if isinstance(value, int):
        return "int"
    if isinstance(value, datetime):
        return "date"
    if isinstance(value, str):
        try:
            datetime.fromisoformat(value)
            return "date"
        except ValueError:
            pass
        return "string"
    return "string"


async def build_schema() -> SchemaResponse:
    db = get_db()
    collection_names = await db.list_collection_names()

    collections = []
    for name in collection_names:
        if name.startswith("system."):
            continue
        collection = db[name]
        count = await collection.estimated_document_count()

        # Sample up to 5 docs to infer fields
        sample_docs = await collection.find({}, {"_id": 0}).limit(5).to_list(length=5)

        fields_map: dict[str, FieldInfo] = {}
        for doc in sample_docs:
            for field, value in doc.items():
                if field not in fields_map:
                    fields_map[field] = FieldInfo(
                        name=field,
                        type=infer_type(value),
                        sample=str(value) if value is not None else None,
                    )

        collections.append(
            CollectionInfo(
                name=name,
                fields=list(fields_map.values()),
                document_count=count,
            )
        )

    return SchemaResponse(collections=collections)


def schema_to_json(schema: SchemaResponse) -> str:
    """Convert schema to a compact JSON string suitable for LLM injection."""
    data = {}
    for col in schema.collections:
        data[col.name] = {
            "document_count": col.document_count,
            "fields": {f.name: {"type": f.type, "sample": f.sample} for f in col.fields},
        }
    return json.dumps(data, indent=2)


@router.get("/schema", response_model=SchemaResponse)
async def get_schema():
    global _schema_cache
    if _schema_cache is None:
        _schema_cache = await build_schema()
    return _schema_cache


def invalidate_schema_cache():
    global _schema_cache
    _schema_cache = None
