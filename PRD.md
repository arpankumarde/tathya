# Product Requirements Document — Tathya

## 1. Overview

Tathya is a conversational BI tool that transforms natural language queries into interactive data dashboards. It bridges the gap between business users who have questions and the technical skills typically required to answer them.

## 2. Problem

- Data teams are bottlenecked by basic reporting requests from non-technical stakeholders
- Business users wait days for simple dashboards
- Existing BI tools (Tableau, PowerBI, Looker) have steep learning curves
- SQL knowledge is a prerequisite for self-service analytics

## 3. Target Persona

**The Non-Technical Executive (CXO)**

- Knows what business questions to ask
- Cannot write SQL or configure BI tools
- Needs answers in minutes, not days
- Values clarity and visual appeal over raw data

## 4. Core User Flow

```
User enters natural language query
    → Backend receives query + dataset context (schema, sample rows)
    → LLM (Gemini via OpenRouter) generates:
        1. MongoDB aggregation pipeline to fetch relevant data
        2. Chart configuration (type, axes, grouping, colors)
    → Backend executes pipeline, returns data + chart config
    → Frontend renders interactive dashboard
    → User can ask follow-up questions to refine
```

## 5. Functional Requirements

### 5.1 Natural Language Input

- FR-1: Text input field accepting plain English queries
- FR-2: Support for complex multi-part queries (e.g. "Show sales by region AND highlight top category")
- FR-3: Follow-up queries that refine/filter the current dashboard
- FR-4: Query history for the current session

### 5.2 Data Processing

- FR-5: LLM generates valid MongoDB aggregation pipelines from natural language
- FR-6: System validates generated pipelines before execution (reject write operations like $out, $merge)
- FR-7: Support querying MongoDB collections
- FR-8: Support user-uploaded CSV files as data sources
- FR-9: Schema introspection — system understands collection structures, field types, and data shape

### 5.3 Intelligent Visualization

- FR-10: Auto-select chart type based on data characteristics:
  - Time-series data → Line chart
  - Categorical comparison → Bar chart
  - Part-of-whole → Pie/Donut chart
  - Distribution → Histogram
  - Correlation → Scatter plot
  - KPIs/single values → Stat cards
- FR-11: Support multi-chart dashboards from a single query
- FR-12: Sensible defaults for axis labels, legends, colors, and titles

### 5.4 Interactivity

- FR-13: Hover tooltips on all chart elements
- FR-14: Click-to-filter on chart segments
- FR-15: Zoom and pan on applicable charts
- FR-16: Responsive layout that adapts to screen size

### 5.5 Error Handling

- FR-17: Graceful handling of vague or ambiguous queries — ask clarifying questions
- FR-18: Report when a query cannot be answered from available data (no hallucination)
- FR-19: User-friendly error messages for invalid queries or data issues
- FR-20: Loading states and progress indicators during generation

### 5.6 Data Upload (Bonus)

- FR-21: CSV file upload with drag-and-drop
- FR-22: Auto-detect column types (numeric, categorical, date, text)
- FR-23: Preview uploaded data before querying
- FR-24: Support multiple uploaded files in a session

## 6. Non-Functional Requirements

- NFR-1: Dashboard generation in under 10 seconds for typical queries
- NFR-2: Support concurrent users (at least 5 simultaneous)
- NFR-3: No sensitive data stored beyond the session (uploaded CSVs are ephemeral)
- NFR-4: HTTPS for all API communication
- NFR-5: Mobile-responsive frontend

## 7. Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│          (Next.js + Recharts — UI only)          │
│                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Chat UI  │  │  Dashboard   │  │  Data      │ │
│  │          │  │  Renderer    │  │  Upload    │ │
│  └────┬─────┘  └──────┬───────┘  └─────┬──────┘ │
└───────┼────────────────┼────────────────┼────────┘
        │                │                │
        ▼                ▼                ▼
┌─────────────────────────────────────────────────┐
│                  Backend API                     │
│                  (FastAPI)                        │
│                                                  │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Query    │  │  LLM         │  │  CSV       │ │
│  │ Router   │  │  Service     │  │  Ingester  │ │
│  └────┬─────┘  └──────┬───────┘  └─────┬──────┘ │
│       │               │                │         │
│       ▼               ▼                ▼         │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Query    │  │  OpenRouter  │  │  SQLite    │ │
│  │ Executor │  │              │  │  (temp)    │ │
│  └────┬─────┘  └──────────────┘  └────────────┘ │
│       │                                          │
│       ▼                                          │
│  ┌──────────┐                                    │
│  │ MongoDB  │                                    │
│  └──────────┘                                    │
└─────────────────────────────────────────────────┘
```

## 8. API Contract (Backend → Frontend)

### POST /api/query

```json
// Request
{
  "query": "Compare claim settlement ratios of top 5 insurers in 2021-22",
  "session_id": "uuid",
  "conversation_history": [...]
}

// Response
{
  "success": true,
  "data": {
    "pipeline": [{"$match": {"year": "2021-22"}}, {"$sort": {"claims_paid_ratio_no": -1}}, {"$limit": 5}],
    "charts": [
      {
        "type": "bar",
        "title": "Claim Settlement Ratio — Top 5 Insurers (2021-22)",
        "x_axis": { "field": "life_insurer", "label": "Insurer" },
        "y_axis": { "field": "claims_paid_ratio_no", "label": "Settlement Ratio" },
        "group_by": null,
        "data": [
          { "life_insurer": "Max", "claims_paid_ratio_no": 0.993 },
          ...
        ]
      }
    ],
    "summary": "Max Life leads with a 99.3% settlement ratio, followed by...",
    "follow_up_suggestions": [
      "How have these ratios changed over the last 3 years?",
      "Which insurer has the highest rejection rate?"
    ]
  }
}
```

### POST /api/upload

```json
// Request: multipart/form-data with CSV file

// Response
{
  "success": true,
  "dataset_id": "uuid",
  "schema": {
    "columns": [
      { "name": "date", "type": "date", "sample": "2024-07-01" },
      { "name": "revenue", "type": "numeric", "sample": 45000 }
    ],
    "row_count": 1250
  }
}
```

### GET /api/schema

```json
// Response — available collections and fields for querying
{
  "collections": [
    {
      "name": "life_insurance_claims",
      "fields": [
        { "name": "life_insurer", "type": "string" },
        { "name": "year", "type": "string" },
        { "name": "claims_paid_no", "type": "float" },
        { "name": "claims_paid_ratio_no", "type": "float" },
        { "name": "category", "type": "string" }
      ],
      "document_count": 150
    }
  ]
}
```

## 9. Evaluation Criteria (from problem statement)

| Category                  | Weight | Key Metrics                                                           |
| ------------------------- | ------ | --------------------------------------------------------------------- |
| **Accuracy**              | 40%    | Correct SQL generation, appropriate chart selection, no hallucination |
| **Aesthetics & UX**       | 30%    | Clean design, interactive charts, intuitive flow, loading states      |
| **Approach & Innovation** | 30%    | Robust pipeline, prompt engineering quality, error handling           |

## 10. Demo Queries (for 10-min presentation)

**Simple:** "Which insurer paid the most claims in 2021-22?"
→ Bar chart ranking insurers by claims_paid_no + stat card for the top insurer

**Medium:** "Compare the claim settlement ratios of the top 10 insurers over the last 3 years"
→ Grouped bar chart with insurer × year breakdown of claims_paid_ratio_no

**Complex:** "Show me the overall industry trend in claim denials, break down repudiation vs rejection rates by year, and highlight which insurer has the highest denial rate"
→ Multi-chart dashboard: line chart (industry denial trend) + stacked bar (repudiated vs rejected by year) + stat card (worst denier)

## 11. Milestones

| Phase       | Scope                                                | Target |
| ----------- | ---------------------------------------------------- | ------ |
| **Phase 1** | Backend API: query → SQL → data pipeline with Gemini via OpenRouter | Week 1 |
| **Phase 2** | Frontend: chat UI + dashboard renderer with Recharts | Week 2 |
| **Phase 3** | CSV upload, follow-up queries, polish & demo prep    | Week 3 |
