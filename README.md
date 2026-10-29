# Sin2Times (Past Prism) - AI-Powered Historical Causality and Timeline Explorer

An interactive full-stack historical research and visualization tool that decomposes complex historical events, movements, and conflicts into interactive causal graphs, timeline flows, and dependency networks using Google Gemini and React Flow.

---

## Overview

Understanding historical events requires tracing complex webs of causality rather than reading linear text alone. Sin2Times (Past Prism) translates unstructured historical inquiries into structured knowledge graphs. 

When a user queries a topic (e.g., "Causes of the French Revolution", "The Silk Road trade impacts", "Scientific Revolution breakthroughs"), the system generates a directed graph detailing:
- **Root Drivers**: Foundational socio-economic or philosophical factors.
- **Direct Causes**: Immediate catalyst events triggering conflict or transformation.
- **Key Entities**: Historical actors, organizations, and geographic coordinates.
- **Effects and Repercussions**: Short-term outcomes and long-term historical consequences.

---

## System Architecture

```
                  ┌─────────────────────────────────────────┐
                  │          React Frontend (Past Prism)    │
                  │  • Historian View (Query Interface)     │
                  │  • TimelineFlow (Interactive Graph)     │
                  └────────────────────┬────────────────────┘
                                       │  POST /query
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            Flask REST API               │
                  │  • CORS Enabled                         │
                  │  • Prompt Engineering & Graph Schema    │
                  └────────────────────┬────────────────────┘
                                       │  Structured Generation
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │       Google Gemini (gemini-2.0-flash)  │
                  │  • Extracts Nodes (Categories, Metadata)│
                  │  • Computes Directed Causal Edges       │
                  └─────────────────────────────────────────┘
```

---

## Technical Stack

- **Backend**: Python, Flask, Flask-CORS, `google-generativeai` (Gemini 2.0 Flash).
- **Frontend**: React, TypeScript, React Flow / SVG Canvas for interactive graph physics and directed connections.
- **Data Model**: Directed Acyclic Graph (DAG) schema with typed nodes (`root`, `cause`, `effect`, `major`, `minor`, `child`) and typed relational edges.

---

## Repository Structure

```
.
├── backend/
│   └── main.py              # Flask server and Gemini API prompt orchestrator
├── past-prism/
│   └── src/
│       ├── api.tsx          # TypeScript HTTP client for graph queries
│       ├── components/
│       │   └── Historian/
│       │       └── TimelineFlow.tsx  # Interactive node-edge canvas renderer
│       └── pages/
│           └── Historian.tsx         # Main inquiry interface and state manager
└── README.md
```

---

## Setup and Running Locally

### 1. Backend Setup

Prerequisites: Python 3.9+ and a Google Gemini API Key.

```bash
cd backend

# Install dependencies
pip install flask flask-cors google-generativeai python-dotenv

# Set your Gemini API Key
# On Windows PowerShell:
$env:GEMINI_API_KEY="your_api_key_here"

# On Linux/macOS:
export GEMINI_API_KEY="your_api_key_here"

# Start the Flask API (runs on http://127.0.0.1:5000)
python main.py
```

### 2. Frontend Setup

Prerequisites: Node.js 18+ and npm.

```bash
cd past-prism

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` or `http://localhost:3000` in your browser.
