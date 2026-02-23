# RTYI Documentary Research Workspace

> [!NOTE]
> Beyond the cartridge: A research and preparation workspace for the **Return to Yoshi's Island** documentary.

[![Documentation](https://img.shields.io/badge/docs-rtyi.land-blue)](https://rtyi.land)

## About

This repository is the working hub for a long-form documentary about **Return to Yoshi's Island**, the Mario 64 ROM hack led by Kaze Emanuar.

It is built to support real interview and writing work: preparing question sets, tracking open questions, reviewing stream evidence, collecting quotes, and shaping narrative arcs.

Planned interviews include:

- Kaze Emanuar
- Biobak
- Badub
- Kaze and Zeina together

## What This Repository Is For

- Maintain a single source of truth for documentary research notes
- Build interview question sets per contributor
- Analyze development streams and extract reusable findings
- Connect quotes, themes, and timeline context for story development

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm

### Installation

```bash
git clone git@github.com:johannschopplich/rtyi-doc.git
cd rtyi-doc
pnpm install
```

### Local Documentation Workflow

```bash
# Start the VitePress research site
pnpm docs:dev

# Build the docs site
pnpm docs:build

# Preview the built site locally
pnpm docs:preview
```

### Transcript Analysis Workflow

Create a `.env` file in the repository root with the API keys you use for transcript analysis.

```bash
# Analyze transcripts and write structured output into .data/streams/
pnpm stream-analysis
```

### Quality Checks

```bash
pnpm lint
pnpm format:check
pnpm test:types
```

## Project Structure

```text
rtyi-doc/
├── docs/                         # VitePress documentary research workspace
│   ├── .vitepress/               # Site config, theme, data loaders
│   ├── drafts/                   # Narrative drafts and chapter planning
│   ├── interviews/               # Interview questions by person and topic
│   ├── streams/                  # Stream pages, summaries, and dashboards
│   ├── topics/                   # Findings grouped by documentary theme
│   ├── team/                     # Contributor profiles and per-person context
│   ├── quotes/                   # Quote collections for narration and trailers
│   ├── questions/                # Open question tracking
│   ├── prompts/                  # Prompt and extraction documentation
│   ├── research/                 # External documentary and background research
│   ├── public/                   # Static assets
│   └── index.md
├── scripts/
│   └── stream-analysis.ts        # Batch transcript analysis CLI
├── src/
│   ├── analysis/
│   │   ├── prompt.ts             # Prompt template for per-stream extraction
│   │   └── runner.ts             # Transcript processing and output writing
│   ├── aggregation/
│   │   ├── prompts.ts            # Prompt templates for aggregation tasks
│   │   ├── schemas.ts            # Zod schemas for aggregation output
│   │   └── runner.ts             # Aggregation task execution
│   ├── schemas.ts                # Shared Zod schemas and type definitions
│   ├── stt-corrections.ts        # Speech-to-text cleanup rules
│   ├── constants.ts              # Paths and model labels/defaults
│   └── utils.ts                  # Provider and model helpers
├── transcripts/                  # Raw stream transcript files (.txt)
├── .data/                        # Generated analysis artifacts
│   └── streams/                  # Structured transcript output by model
├── package.json
├── pnpm-workspace.yaml
├── wrangler.toml
└── README.md
```

## Transcript Analysis Output

Running `pnpm stream-analysis` generates structured JSON artifacts in `.data/streams/`.

Typical output includes:

- Development findings (technical decisions and implementation details)
- Context findings (motivation, emotions, philosophy)
- Contributor findings (roles, collaboration, ownership)
- Key stories (self-contained narrative arcs)
- Open questions (targets for follow-up interviews)

## Optional Deployment

The project can be deployed to Cloudflare as a static docs site. Routing and asset settings live in `wrangler.toml`.

## License

This project is for internal documentary research and preparation. Content related to the RTYI team and project is used with permission for documentary purposes.
