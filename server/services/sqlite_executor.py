import aiosqlite


async def get_sqlite_schema(db_path: str) -> list[dict]:
    """Return column info for the 'data' table in a SQLite DB."""
    async with aiosqlite.connect(db_path) as conn:
        async with conn.execute("PRAGMA table_info(data)") as cursor:
            rows = await cursor.fetchall()
    # rows: (cid, name, type, notnull, dflt_value, pk)
    return [{"name": row[1], "type": row[2]} for row in rows]


async def execute_sql(db_path: str, sql: str) -> list[dict]:
    async with aiosqlite.connect(db_path) as conn:
        conn.row_factory = aiosqlite.Row
        async with conn.execute(sql) as cursor:
            rows = await cursor.fetchmany(1000)
            return [dict(row) for row in rows]
