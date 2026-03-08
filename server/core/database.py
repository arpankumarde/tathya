import aiosqlite
from pymongo import AsyncMongoClient

from core.config import settings

client: AsyncMongoClient | None = None
db = None


async def connect_mongo():
    global client, db
    client = AsyncMongoClient(settings.MONGO_URI)
    db = client.get_database("tathya")


async def close_mongo():
    if client:
        await client.close()


def get_db():
    return db


async def get_sqlite_connection(db_path: str):
    return await aiosqlite.connect(db_path)
