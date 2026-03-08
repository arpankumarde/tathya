from datetime import datetime

from bson import Decimal128, ObjectId

from core.database import get_db
from services.llm import validate_pipeline


def serialize_doc(doc: dict) -> dict:
    result = {}
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, Decimal128):
            result[key] = float(value.to_decimal())
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        else:
            result[key] = value
    return result


async def execute_pipeline(collection_name: str, pipeline: list[dict]) -> list[dict]:
    validate_pipeline(pipeline)

    db = get_db()
    collection = db[collection_name]

    cursor = await collection.aggregate(pipeline, maxTimeMS=5000)
    results = await cursor.to_list(length=1000)

    return [serialize_doc(doc) for doc in results]
