# RTYI Documentary Research Platform

> [!NOTE]
> Beyond the cartridge: A comprehensive research and preparation platform for the Return to Yoshi's Island documentary.

[![Documentation](https://img.shields.io/badge/docs-rtyi.land-blue)](https://rtyi.land)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

## About

This project serves as a comprehensive research and preparation platform for creating a documentary about **Return to Yoshi's Island**, a major Mario 64 ROM hack by Kaze and his team. The platform leverages AI to analyze hundreds of development stream transcripts, extract key insights, and organize research materials for documentary production.

## Features

### 🤖 AI-Powered Analysis

- **Multi-Provider Support**: Google Gemini, OpenAI models
- **Structured Extraction**: Zod schemas ensure consistent data formatting
- **Stream Processing**: Automated analysis of 100+ development streams
- **Key Insights**: Development findings, team dynamics, and narrative arcs

### 📚 Research Documentation

- **Interview Questions**: Comprehensive questions organized by team member
- **Stream Analysis**: Detailed summaries with key quotes
- **Narrative Arcs**: Structured story elements for documentary production
- **Research Materials**: Video game documentary analysis and references

## Quick Start

### Prerequisites

- Node.js 22+ and pnpm
- AI API keys (Google, OpenAI)
- Cloudflare account (for deployment)

### Installation

```bash
# Clone the repository
git clone git@github.com:johannschopplich/rtyi-doc.git
cd rtyi-doc

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
```

### Development

```bash
# Start documentation development server
pnpm docs:dev

# Run stream analysis (requires API keys)
pnpm stream-analysis
```

### Production Build

```bash
# Build documentation
pnpm docs:build
```

## Project Structure

```
rtyi-doc/
├── src/                   # Core TypeScript utilities
│   ├── schemas.ts         # Zod schemas for data validation
│   ├── utils.ts           # AI provider utilities
│   ├── constants.ts       # Configuration constants
│   └── context/           # Transcript processing logic
├── scripts/               # CLI analysis tools
│   ├── stream-analysis.ts # Main analysis script
├── docs/                  # VitePress documentation site
│   ├── .vitepress/        # VitePress configuration
│   ├── interviews/        # Interview questions by team member
│   ├── streams/           # Stream analysis results
│   ├── questions/         # Generated interview questions
│   ├── prompts/           # AI prompts and methodology
│   ├── research/          # Background research materials
│   └── drafts/            # Narrative arcs and planning
├── worker/                # Cloudflare Worker for authentication
├── transcripts/           # Raw stream transcript files (.txt)
└── .data/                 # Processed analysis data
    ├── streams_v2/        # Stream analysis results by AI model
    └── kv/                # Key-value storage for questions
```

## AI Analysis Pipeline

To analyze stream transcripts and generate structured data, run the following command:

```bash
pnpm stream-analysis
```

After running this command, the analysis results will be stored in `.data/streams_v2/` with subdirectories for each AI provider (e.g., `gemini-2-5-pro`, `o3`). Each directory contains JSON files with structured insights.

- **Development Findings**: Technical insights, design decisions
- **Context Findings**: Personal insights, emotions, philosophy
- **Contributor Findings**: Team member contributions and dynamics
- **Key Stories**: Self-contained narrative arcs
- **Open Questions**: Topics requiring follow-up interviews

## Documentation Features

### Interview Preparation

- **Team-Specific Questions**: Tailored for each contributor
- **Central Themes**: Core questions for all team members
- **Follow-up Guidance**: Context-aware question suggestions
- **Global Audience Focus**: Accessible explanations for non-technical viewers

### Stream Analysis

- **Model Comparison**: Results from multiple AI providers
- **Temporal Organization**: Chronological stream progression
- **Key Insights**: Highlighted findings and quotes
- **Cross-Reference**: Links between related streams and topics

### Research Materials

- **Video Game Documentaries**: Analysis of successful documentary approaches
- **Narrative Planning**: Story structure and thematic organization
- **Technical Context**: ROM hacking and N64 development background

## License

This project is for internal documentary research and preparation. All content related to the RTYI team and project is used with permission for documentary purposes.

## Acknowledgments

- **Kaze and the RTYI Team** for their incredible work and openness
- **AI Providers** for enabling large-scale transcript analysis
- **VitePress** for excellent documentation tooling
- **Cloudflare** for reliable hosting and security

---

_Built with passion for documenting the art of game development and the people who make it possible._
