import json
import logging

from fastapi import APIRouter, HTTPException

logger = logging.getLogger(__name__)

from api.schema import build_schema, schema_to_json
from core.models import ChartConfig, QueryRequest, QueryResponse
from core.session import add_turn, get_dataset_path, get_or_create_session
from services import llm, query_executor, sqlite_executor

router = APIRouter()


def _build_charts(llm_charts: list[dict], results: list[dict]) -> list[ChartConfig]:
    return [
        ChartConfig(
            type=c.get("type", "bar"),
            title=c.get("title", ""),
            x_axis=c.get("x_axis"),
            y_axis=c.get("y_axis"),
            group_by=c.get("group_by"),
            data=results,
        )
        for c in llm_charts
    ]


async def _handle_mongodb_query(request: QueryRequest, session: dict) -> QueryResponse:
    sid = session["_id"]
    history = request.conversation_history or session.get("conversation_history", [])

    try:
        schema = await build_schema()
        schema_json = schema_to_json(schema)
    except Exception as e:
        return QueryResponse(success=False, session_id=sid, error=f"Failed to fetch schema: {e}")

    try:
        llm_response = await llm.call_llm(request.query, schema_json, history)
    except Exception as e:
        return QueryResponse(success=False, session_id=sid, error=f"Failed to process query: {e}")

    if llm_response.get("error"):
        return QueryResponse(
            success=False,
            session_id=sid,
            error=llm_response["error"],
            summary=llm_response.get("summary", ""),
            follow_up_suggestions=llm_response.get("follow_up_suggestions", []),
        )

    collection = llm_response.get("collection", "")
    pipeline = llm_response.get("pipeline", [])

    try:
        llm.validate_pipeline(pipeline)
    except ValueError as e:
        return QueryResponse(success=False, session_id=sid, error=f"Generated query was unsafe: {e}")

    try:
        results = await query_executor.execute_pipeline(collection, pipeline)
    except Exception as e:
        logger.exception("MongoDB pipeline execution failed")
        return QueryResponse(success=False, session_id=sid, error=f"Database query failed: {e}")

    summary = llm_response.get("summary", "")
    await add_turn(sid, request.query, summary)

    return QueryResponse(
        success=True,
        session_id=sid,
        charts=_build_charts(llm_response.get("charts", []), results),
        summary=summary,
        follow_up_suggestions=llm_response.get("follow_up_suggestions", []),
    )


async def _handle_sqlite_query(request: QueryRequest, session: dict, db_path: str) -> QueryResponse:
    sid = session["_id"]
    history = request.conversation_history or session.get("conversation_history", [])

    try:
        columns = await sqlite_executor.get_sqlite_schema(db_path)
        schema_json = json.dumps({"data": {"columns": columns}}, indent=2)
    except Exception as e:
        return QueryResponse(success=False, session_id=sid, error=f"Failed to read dataset schema: {e}")

    try:
        llm_response = await llm.call_llm_sql(request.query, schema_json, history)
    except Exception as e:
        return QueryResponse(success=False, session_id=sid, error=f"Failed to process query: {e}")

    if llm_response.get("error"):
        return QueryResponse(
            success=False,
            session_id=sid,
            error=llm_response["error"],
            summary=llm_response.get("summary", ""),
            follow_up_suggestions=llm_response.get("follow_up_suggestions", []),
        )

    sql = llm_response.get("sql", "")

    try:
        llm.validate_sql(sql)
    except ValueError as e:
        return QueryResponse(success=False, session_id=sid, error=f"Generated query was unsafe: {e}")

    try:
        results = await sqlite_executor.execute_sql(db_path, sql)
    except Exception as e:
        logger.exception("SQLite query execution failed")
        return QueryResponse(success=False, session_id=sid, error=f"Dataset query failed: {e}")

    summary = llm_response.get("summary", "")
    await add_turn(sid, request.query, summary)

    return QueryResponse(
        success=True,
        session_id=sid,
        charts=_build_charts(llm_response.get("charts", []), results),
        summary=summary,
        follow_up_suggestions=llm_response.get("follow_up_suggestions", []),
    )


@router.post("/query", response_model=QueryResponse)
async def handle_query(request: QueryRequest):
    session = await get_or_create_session(request.session_id, request.user_id)

    if request.dataset_id:
        db_path = get_dataset_path(request.dataset_id)
        if not db_path:
            raise HTTPException(
                status_code=404,
                detail=f"Dataset '{request.dataset_id}' not found. It may have been lost on server restart.",
            )
        return await _handle_sqlite_query(request, session, db_path)

    return await _handle_mongodb_query(request, session)
