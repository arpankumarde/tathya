# Tathya

**Conversational AI for Instant Business Intelligence Dashboards**

Tathya (Sanskrit for "fact" / "truth") lets non-technical users generate fully interactive data dashboards using plain English. Type a question, get a dashboard — no SQL, no BI tools, no waiting.

## What it does

1. User types a natural language query (e.g. _"Compare claim settlement ratios of the top 5 insurers over the last 3 years"_)
2. The system interprets the intent, generates the right database query, selects appropriate chart types, and renders an interactive dashboard in real-time
3. Users can follow up conversationally to refine, filter, or drill down into the generated charts

## Tech Stack

| Layer           | Technology                                                   |
| --------------- | ------------------------------------------------------------ |
| **Frontend**    | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui              |
| **Charting**    | Recharts (planned)                                           |
| **Backend**     | Python 3.13, FastAPI                                         |
| **LLM**         | Gemini (via OpenRouter + OpenAI SDK)                         |
| **Database**    | MongoDB (primary), SQLite for uploaded CSVs (all DB work on server) |
| **Data Upload** | CSV file upload support                                      |

## Project Structure

```
tathya/
├── client/          # Next.js frontend
│   ├── src/
│   │   ├── app/         # App router pages & API routes
│   │   ├── components/  # UI components (shadcn/ui)
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities
├── server/          # Python FastAPI backend
│   ├── main.py          # Entry point
│   └── data/            # Seed dataset (India Life Insurance Claims)
└── Problem Statement.md
```

## Getting Started

### Prerequisites

- Node.js 20+ and pnpm
- Python 3.13+ and uv
- MongoDB (local or Atlas)
- OpenRouter API key

### Backend

```bash
cd server
uv sync
uv run main.py
```

### Frontend

```bash
cd client
pnpm install
pnpm dev
```

### Environment Variables

```
# server/.env
OPENROUTER_API_KEY=your_openrouter_api_key
MONGODB_URI=mongodb://localhost:27017/tathya
```

## Target Users

Non-technical executives and business users who know what questions to ask but don't know SQL or BI tools.

## License

MIT
