from dotenv import load_dotenv
import os

load_dotenv()


class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_API_BASE: str = os.getenv("OPENAI_API_BASE", "https://openrouter.ai/api/v1")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "google/gemini-2.0-flash-001")
    MONGO_URI: str = os.getenv("MONGO_URI", "")
    USE_REMOTE_UPLOAD: bool = os.getenv("USE_REMOTE_UPLOAD", "0") == "1"
    AWS_ACCESS_KEY_ID: str | None = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: str | None = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str | None = os.getenv("AWS_REGION")
    BUCKET_NAME: str | None = os.getenv("BUCKET_NAME")
    BUCKET_PREFIX: str | None = os.getenv("BUCKET_PREFIX")
    CDN_URL: str | None = os.getenv("CDN_URL")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO").upper()


settings = Settings()
