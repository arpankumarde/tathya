import uuid
from datetime import datetime, timedelta, timezone

from core.database import get_db

SESSION_TTL = timedelta(hours=1)
MAX_HISTORY = 20  # messages (10 exchanges)

# In-memory store for uploaded dataset paths (not persisted — files are local)
_datasets: dict[str, str] = {}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _sessions():
    return get_db()["sessions"]


async def get_or_create_session(session_id: str | None, user_id: str | None = None) -> dict:
    sid = session_id or str(uuid.uuid4())
    col = _sessions()

    doc = await col.find_one({"_id": sid})

    if doc:
        if (
            _now() - doc["last_accessed"].replace(tzinfo=timezone.utc) > SESSION_TTL
            and not doc.get("conversation_history")
        ):
            await col.delete_one({"_id": sid})
            doc = None

    if not doc:
        doc = {
            "_id": sid,
            "conversation_history": [],
            "active_dataset": None,
            "user_id": user_id,
            "created_at": _now(),
            "last_accessed": _now(),
        }
        await col.insert_one(doc)
    else:
        update: dict = {"last_accessed": _now()}
        if user_id and not doc.get("user_id"):
            update["user_id"] = user_id
        await col.update_one({"_id": sid}, {"$set": update})

    return doc


async def add_turn(session_id: str, query: str, summary: str):
    col = _sessions()
    doc = await col.find_one({"_id": session_id})
    if not doc:
        return

    history: list[dict] = doc.get("conversation_history", [])
    history.append({"role": "user", "content": query})
    history.append({"role": "assistant", "content": summary})

    if len(history) > MAX_HISTORY:
        history = history[-MAX_HISTORY:]

    await col.update_one(
        {"_id": session_id},
        {"$set": {"conversation_history": history, "last_accessed": _now()}},
    )


def register_dataset(dataset_id: str, db_path: str):
    _datasets[dataset_id] = db_path


def get_dataset_path(dataset_id: str) -> str | None:
    return _datasets.get(dataset_id)
