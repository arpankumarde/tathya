"""
Seed script: load data/data.csv into MongoDB as the life_insurance_claims collection.
Run once: uv run seed.py
"""

import asyncio
import os

import pandas as pd
from dotenv import load_dotenv
from pymongo import AsyncMongoClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "")
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "data.csv")

# Normalize insurer name variants
INSURER_ALIASES = {
    "ABSL": "Aditya Birla Sun Life",
    "Aditya Birla": "Aditya Birla Sun Life",
    "Baj Alz": "Bajaj Allianz",
    "Bajaj Alz": "Bajaj Allianz",
    "Kotak Mah": "Kotak Mahindra",
    "Kotak": "Kotak Mahindra",
    "Tata AIA": "Tata AIA Life",
    "PNB Met": "PNB MetLife",
    "PNB Metlife": "PNB MetLife",
    "Canara HSBC": "Canara HSBC OBC",
    "Future Gen": "Future Generali",
    "Shriram L": "Shriram Life",
    "Edelweiss T": "Edelweiss Tokio",
    "Ind First": "IndiaFirst Life",
    "Star Union": "Star Union Dai-ichi",
}


def normalize_insurer(name: str) -> str:
    if not isinstance(name, str):
        return name
    name = name.strip()
    for alias, canonical in INSURER_ALIASES.items():
        if name.lower().startswith(alias.lower()):
            return canonical
    return name


async def seed():
    df = pd.read_csv(DATA_PATH, encoding="latin-1")

    # Strip whitespace from string columns
    for col in df.select_dtypes(include="object").columns:
        df[col] = df[col].str.strip()

    # Normalize insurer names
    insurer_col = next((c for c in df.columns if "insurer" in c.lower()), None)
    if insurer_col:
        df[insurer_col] = df[insurer_col].apply(normalize_insurer)

    # Convert numeric-looking string columns to float
    for col in df.columns:
        if df[col].dtype == object:
            converted = pd.to_numeric(df[col], errors="coerce")
            if converted.notna().sum() / max(len(df), 1) > 0.8:
                df[col] = converted

    records = df.where(pd.notnull(df), None).to_dict(orient="records")

    client = AsyncMongoClient(MONGO_URI)
    db = client.get_database("tathya")
    collection = db["life_insurance_claims"]

    # Idempotent: drop and re-insert
    await collection.drop()
    await collection.insert_many(records)

    # Indexes
    await collection.create_index("life_insurer")
    await collection.create_index("year")
    await collection.create_index("category")
    await collection.create_index([("life_insurer", 1), ("year", 1)])

    count = await collection.count_documents({})
    distinct_insurers = await collection.distinct("life_insurer")
    years = await collection.distinct("year")

    print(f"Inserted {count} documents")
    distinct_insurers = [i for i in distinct_insurers if isinstance(i, str)]
    print(f"Insurers ({len(distinct_insurers)}): {sorted(distinct_insurers)}")
    years = [y for y in years if isinstance(y, str)]
    print(f"Years: {sorted(years)}")

    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
