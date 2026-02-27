# RTYI Documentary Research Workspace

> [!NOTE]
> Beyond the cartridge: A research and preparation workspace for the **Return to Yoshi's Island** documentary.

[![Documentation](https://img.shields.io/badge/docs-rtyi.land-blue)](https://rtyi.land)

## About

This repository is the working hub for a long-form documentary about **Return to Yoshi's Island**, the Mario 64 ROM hack led by Kaze Emanuar. It holds everything needed to prepare for filming: interview question sets, narrative planning, stream evidence, contributor profiles, and curated quotes.

Planned interviews include:

- Kaze Emanuar
- Biobak
- Badub
- Kaze and Zeina together

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

### Documentation Site

```bash
pnpm docs:dev       # Start local dev server
pnpm docs:build     # Build the site
pnpm docs:preview   # Preview the built site
```

### Transcript Analysis

Raw stream transcripts live in `transcripts/`. Running the analysis pipeline extracts structured findings from each one and writes them to `.data/streams/` as JSON. The synthesis step then aggregates those findings into documentary-ready content.

Create a `.env` file in the repository root with your API keys, then:

```bash
pnpm stream-analysis    # Per-stream extraction → .data/streams/
pnpm stream-synthesis   # Cross-stream aggregation → .data/synthesis/
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
├── docs/                         # VitePress documentary research site
│   ├── .vitepress/               # Site config, theme, data loaders
│   ├── drafts/                   # Narrative arcs and chapter planning
│   ├── interviews/               # Per-person interview question sets
│   ├── synthesis/                # Documentary prep (generated from analysis)
│   ├── streams/                  # Stream pages and dashboard
│   ├── topics/                   # Findings grouped by documentary theme
│   ├── team/                     # Contributor profiles
│   ├── prompts/                  # Prompt and extraction documentation
│   ├── research/                 # Background research on documentary craft
│   ├── public/                   # Static assets
│   └── index.md
├── scripts/
│   ├── stream-analysis.ts        # Per-stream transcript extraction
│   └── stream-synthesis.ts       # Cross-stream aggregation
├── src/
│   ├── analysis/
│   │   ├── prompts.ts            # Prompt templates for stream extraction
│   │   ├── schemas.ts            # Zod schemas for analysis output
│   │   └── runner.ts             # Transcript processing and JSON output
│   ├── synthesis/
│   │   ├── prompts.ts            # Prompt templates for aggregation
│   │   ├── schemas.ts            # Zod schemas for synthesis output
│   │   └── runner.ts             # Aggregation execution
│   ├── stt-corrections.ts        # Speech-to-text cleanup rules
│   ├── constants.ts              # Paths and model defaults
│   └── utils.ts                  # Provider and model helpers
├── transcripts/                  # Raw stream transcript files (.txt)
├── .data/                        # Generated analysis artifacts
│   ├── streams/                  # Per-stream extraction output (JSON)
│   └── synthesis/                # Aggregated documentary prep (JSON)
├── package.json
├── pnpm-workspace.yaml
├── wrangler.toml
└── README.md
```

## Analysis Pipeline

The pipeline has two stages. The first reads each raw transcript and extracts structured findings – development decisions, context and motivation, contributor roles, key stories, and open questions for follow-up interviews. Output goes to `.data/streams/` as one JSON file per stream.

The second stage aggregates all per-stream output into documentary-ready material in `.data/synthesis/`:

- **Story Arcs** – arc-first narrative stories with embedded interview questions and quotes
- **Narrative Arcs** – thematic filming roadmap forming the documentary's high-level structure
- **Topic Arcs** – per-topic narrative summaries tracing how each theme evolved across streams

VitePress data loaders in `docs/synthesis/` read these JSON files and render them as browsable pages on the research site.

## Deployment

The site deploys to Cloudflare as a static build. Routing and asset configuration live in `wrangler.toml`, serving the site at [rtyi.land](https://rtyi.land).

## License

This project is for internal documentary research and preparation. Content related to the RTYI team and project is used with permission for documentary purposes.
