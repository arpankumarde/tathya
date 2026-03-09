from pydantic import BaseModel


# --- Request models ---

class QueryRequest(BaseModel):
    query: str
    session_id: str | None = None
    dataset_id: str | None = None
    conversation_history: list[dict] = []
    user_id: str | None = None


# --- Schema models ---

class FieldInfo(BaseModel):
    name: str
    type: str
    sample: str | None = None


class CollectionInfo(BaseModel):
    name: str
    fields: list[FieldInfo]
    document_count: int


class SchemaResponse(BaseModel):
    collections: list[CollectionInfo]


# --- Dataset schema (for uploads) ---

class DatasetSchema(BaseModel):
    dataset_id: str
    filename: str
    columns: list[FieldInfo]
    row_count: int


class UploadResponse(BaseModel):
    success: bool
    dataset_id: str
    filename: str
    schema_info: DatasetSchema


# --- Chart models ---

class AxisConfig(BaseModel):
    field: str
    label: str


class ChartConfig(BaseModel):
    type: str
    title: str
    x_axis: AxisConfig | None = None
    y_axis: AxisConfig | None = None
    group_by: str | None = None
    data: list[dict] = []


# --- Query response ---

class QueryResponse(BaseModel):
    success: bool
    session_id: str = ""
    charts: list[ChartConfig] = []
    summary: str = ""
    follow_up_suggestions: list[str] = []
    error: str | None = None


# --- Publish / Showcase ---

class PublishRequest(BaseModel):
    user_id: str | None = None
    dataset_id: str | None = None
    dashboard_name: str = "Untitled Dashboard"
    charts: list[dict] = []


class PublishResponse(BaseModel):
    showcase_id: str
