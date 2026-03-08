import json
import logging

from openai import AsyncOpenAI

from core.config import settings

BLOCKED_STAGES = {"$out", "$merge", "$collStats", "$currentOp", "$planCacheStats"}
BLOCKED_SQL = ("insert", "update", "delete", "drop", "alter", "create", "replace", "truncate")

_client: AsyncOpenAI | None = None


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_API_BASE,
        )
    return _client


def validate_pipeline(pipeline: list[dict]) -> bool:
    for stage in pipeline:
        for key in stage:
            if key in BLOCKED_STAGES:
                raise ValueError(f"Blocked pipeline stage: {key}")
    return True


def validate_sql(sql: str) -> bool:
    lowered = sql.strip().lower()
    if not lowered.startswith("select"):
        raise ValueError("Only SELECT statements are allowed")
    for kw in BLOCKED_SQL:
        if f" {kw} " in f" {lowered} ":
            raise ValueError(f"Blocked SQL keyword: {kw}")
    return True


# ---------------------------------------------------------------------------
# MongoDB prompt
# ---------------------------------------------------------------------------

MONGO_SYSTEM_PROMPT = """\
You are Tathya, an expert business intelligence assistant that translates natural language questions into MongoDB aggregation pipelines and visualization configurations.

<capabilities>
- You have deep knowledge of MongoDB aggregation framework operators: $match, $group, $sort, $project, $limit, $unwind, $lookup, $facet, $bucket, $addFields, $count, etc.
- You understand data analysis patterns: ranking, time-series, comparisons, distributions, ratios, and running totals.
- You select the most insightful visualization for the data being returned.
</capabilities>

<constraints>
- ONLY generate read-only aggregation pipelines. Never use: $out, $merge, $collStats, $currentOp, $planCacheStats.
- Use ONLY collection names and field names that appear in the schema below. Never hallucinate field names.
- If the question references data or fields not present in the schema, set "error" to a clear explanation and return empty pipeline and charts.
- Cap result sets: always include a $limit stage when results could be unbounded.
</constraints>

<chart_selection_rules>
- Ranking / categorical comparison → "bar"
- Trend over time → "line"
- Part-of-whole (≤7 slices) → "pie"
- Single KPI or scalar metric → "stat"
- Value distribution → "histogram"
- Correlation between two numeric fields → "scatter"
- For complex queries, return MULTIPLE chart objects — one per insight.
</chart_selection_rules>

<schema>
{schema_json}
</schema>

<output_format>
Your entire response must be a single raw JSON object. Do NOT wrap it in ```json or any other markdown. Do NOT add any text before or after the JSON. Start your response with {{ and end with }}.

{{
  "collection": "<collection_name>",
  "pipeline": [ /* aggregation stages */ ],
  "charts": [
    {{
      "type": "bar | line | pie | scatter | stat | histogram",
      "title": "<descriptive title>",
      "x_axis": {{ "field": "<field_name>", "label": "<display label>" }},
      "y_axis": {{ "field": "<field_name>", "label": "<display label>" }},
      "group_by": "<field_name> | null"
    }}
  ],
  "summary": "<2-3 sentence plain-English summary of findings>",
  "follow_up_suggestions": ["<question>", "<question>", "<question>"],
  "error": null
}}

If you cannot answer: set "error" to a helpful message, "pipeline" to [], "charts" to [].
</output_format>"""


# ---------------------------------------------------------------------------
# SQL prompt (uploaded CSV → SQLite)
# ---------------------------------------------------------------------------

SQL_SYSTEM_PROMPT = """\
You are Tathya, an expert business intelligence assistant that translates natural language questions into SQL queries and visualization configurations.

<context>
The data lives in a SQLite database. The table is always named "data". You will be given its column schema.
</context>

<constraints>
- ONLY generate SELECT statements. Never use INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, REPLACE, or TRUNCATE.
- Use ONLY column names that appear in the schema below. Never hallucinate column names.
- Always add a LIMIT clause (default 1000) unless the query is an aggregation returning a small result set.
- If the question cannot be answered from the available columns, set "error" to a clear explanation.
</constraints>

<chart_selection_rules>
- Ranking / categorical comparison → "bar"
- Trend over time → "line"
- Part-of-whole (≤7 slices) → "pie"
- Single KPI or scalar metric → "stat"
- Value distribution → "histogram"
- Correlation between two numeric columns → "scatter"
</chart_selection_rules>

<schema>
{schema_json}
</schema>

<output_format>
Your entire response must be a single raw JSON object. Do NOT wrap it in ```json or any other markdown. Do NOT add any text before or after the JSON. Start your response with {{ and end with }}.

{{
  "sql": "SELECT ...",
  "charts": [
    {{
      "type": "bar | line | pie | scatter | stat | histogram",
      "title": "<descriptive title>",
      "x_axis": {{ "field": "<column_name>", "label": "<display label>" }},
      "y_axis": {{ "field": "<column_name>", "label": "<display label>" }},
      "group_by": "<column_name> | null"
    }}
  ],
  "summary": "<2-3 sentence plain-English summary of findings>",
  "follow_up_suggestions": ["<question>", "<question>", "<question>"],
  "error": null
}}

If you cannot answer: set "error" to a helpful message, "sql" to "", "charts" to [].
</output_format>"""


# ---------------------------------------------------------------------------
# LLM callers
# ---------------------------------------------------------------------------

_ERROR_BASE_MONGO = {"collection": "", "pipeline": [], "charts": [], "summary": "", "follow_up_suggestions": [], "error": None}
_ERROR_BASE_SQL   = {"sql": "", "charts": [], "summary": "", "follow_up_suggestions": [], "error": None}


async def _call(system_prompt: str, conversation_history: list[dict], user_query: str) -> str | None:
    messages = [
        {"role": "system", "content": system_prompt},
        *conversation_history[-20:],
        {"role": "user", "content": user_query},
    ]
    response = await get_client().chat.completions.create(
        model=settings.MODEL_NAME,
        messages=messages,
        response_format={"type": "json_object"},
        temperature=1,  # recommended for extended thinking models; low temp handled by top_p
        top_p=0.1,
    )
    raw = response.choices[0].message.content or ""
    # Strip markdown code fences the model sometimes wraps around JSON
    raw = raw.strip()
    if raw.startswith("```"):
        raw = raw.split("\n", 1)[-1]  # drop the opening ```json line
        raw = raw.rsplit("```", 1)[0]  # drop the closing ```
    return raw.strip()


async def call_llm(user_query: str, schema_json: str, conversation_history: list[dict]) -> dict:
    system_prompt = MONGO_SYSTEM_PROMPT.format(schema_json=schema_json)
    try:
        raw = await _call(system_prompt, conversation_history, user_query)
    except Exception as e:
        return {**_ERROR_BASE_MONGO, "error": f"LLM call failed: {e}"}

    try:
        # logging.info(f"LLM response: {raw}")
        data = json.loads(raw or "")
    except json.JSONDecodeError:
        return {**_ERROR_BASE_MONGO, "error": "LLM returned invalid JSON"}

    for key, default in _ERROR_BASE_MONGO.items():
        data.setdefault(key, default)
    return data


async def call_llm_sql(user_query: str, schema_json: str, conversation_history: list[dict]) -> dict:
    system_prompt = SQL_SYSTEM_PROMPT.format(schema_json=schema_json)
    try:
        raw = await _call(system_prompt, conversation_history, user_query)
    except Exception as e:
        return {**_ERROR_BASE_SQL, "error": f"LLM call failed: {e}"}

    try:
        # logging.debug(f"LLM response2: {raw}")
        data = json.loads(raw or "")
    except json.JSONDecodeError:
        return {**_ERROR_BASE_SQL, "error": "LLM returned invalid JSON"}

    for key, default in _ERROR_BASE_SQL.items():
        data.setdefault(key, default)
    return data
