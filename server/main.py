import logging
import os
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.database import close_mongo, connect_mongo, get_db
from core.logging_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up — connecting to MongoDB")
    await connect_mongo()
    os.makedirs(os.path.join(os.path.dirname(__file__), "data", "uploads"), exist_ok=True)
    await get_db()["sessions"].create_index("last_accessed", expireAfterSeconds=3600)
    logger.info("Startup complete")
    yield
    logger.info("Shutting down")
    await close_mongo()


app = FastAPI(title="Tathya API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from api.query import router as query_router
from api.schema import router as schema_router
from api.upload import router as upload_router

app.include_router(query_router, prefix="/api")
app.include_router(schema_router, prefix="/api")
app.include_router(upload_router, prefix="/api")


@app.get("/")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, limit_max_requests=None)
