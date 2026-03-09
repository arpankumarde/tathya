import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from core.database import get_db
from core.models import PublishRequest, PublishResponse

router = APIRouter()


@router.post("/publish", response_model=PublishResponse)
async def publish_dashboard(req: PublishRequest):
    if not req.charts:
        raise HTTPException(status_code=400, detail="No charts to publish")

    showcase_id = str(uuid.uuid4())
    await get_db()["showcases"].insert_one({
        "_id": showcase_id,
        "user_id": req.user_id,
        "dataset_id": req.dataset_id,
        "dashboard_name": req.dashboard_name,
        "charts": req.charts,
        "created_at": datetime.now(timezone.utc),
    })
    return PublishResponse(showcase_id=showcase_id)


@router.get("/showcase/{showcase_id}")
async def get_showcase(showcase_id: str):
    doc = await get_db()["showcases"].find_one({"_id": showcase_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Showcase not found")

    created = doc.get("created_at")
    return {
        "showcase_id": doc["_id"],
        "dashboard_name": doc.get("dashboard_name", "Dashboard"),
        "charts": doc.get("charts", []),
        "created_at": created.isoformat() if hasattr(created, "isoformat") else str(created),
    }
