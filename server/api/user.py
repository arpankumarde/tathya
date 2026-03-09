from fastapi import APIRouter

from core.database import get_db

router = APIRouter()


def _serialize(doc: dict) -> dict:
    """Convert MongoDB doc to JSON-safe dict."""
    out = {}
    for k, v in doc.items():
        if k == "_id":
            out["session_id"] = str(v)
        elif hasattr(v, "isoformat"):
            out[k] = v.isoformat()
        else:
            out[k] = v
    return out


@router.get("/user/{user_id}/recent")
async def get_user_recent(user_id: str):
    db = get_db()

    # Last 5 sessions that have at least one conversation turn
    sessions_cursor = db["sessions"].find(
        {"user_id": user_id, "conversation_history.0": {"$exists": True}},
        {"conversation_history": {"$slice": 1}, "last_accessed": 1, "active_dataset": 1},
    ).sort("last_accessed", -1).limit(5)
    sessions = [_serialize(s) async for s in sessions_cursor]

    # Last 5 datasets uploaded by this user
    datasets_cursor = db["datasets"].find(
        {"user_id": user_id},
        {"_id": 0},
    ).sort("uploaded_at", -1).limit(5)
    datasets = [_serialize(d) async for d in datasets_cursor]

    return {"conversations": sessions, "datasets": datasets}
