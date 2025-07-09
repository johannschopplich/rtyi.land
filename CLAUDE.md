# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a documentation project for a Mario 64 modding documentary called "Right to You's Island". The project analyzes stream transcripts using AI to extract structured information for documentary research.

## Key Commands

### Development

- `pnpm docs:dev` - Start VitePress development server for documentation
- `pnpm docs:build` - Build documentation site
- `pnpm docs:preview` - Preview built documentation

### Analysis Scripts

- `pnpm stream-analysis` - Run AI analysis on stream transcripts
- `pnpm combine-stream-extracts` - Combine extracted analysis data

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check formatting without fixing

## Project Structure

### Core Components

- `src/` - Core TypeScript utilities and schemas
  - `schemas.ts` - Zod schemas for stream analysis data structure
  - `utils.ts` - Utility functions for AI model providers (Anthropic, Google, OpenAI)
  - `constants.ts` - Configuration constants
  - `context/transcripts.ts` - Transcript processing logic
- `scripts/` - CLI scripts for analysis tasks
- `transcripts/` - Raw stream transcript files (.txt)
- `docs/` - VitePress documentation site
- `worker/` - Cloudflare Worker configuration

### AI Analysis Architecture

The project uses multiple AI providers (Anthropic Claude, Google Gemini, OpenAI) to analyze stream transcripts and extract structured data including:

- Development findings and technical insights
- Context about the creator and project
- Contributor information (Biobak, Badub, Zeina)
- Key stories and narrative arcs
- Open questions for interviews

### Data Flow

1. Raw transcripts in `transcripts/` directory
2. Analysis scripts process using AI models
3. Structured data extracted using Zod schemas
4. Results stored in `docs/streams/` for documentation

## Environment Setup

Requires environment variables for AI providers:

- `ANTHROPIC_API_KEY`
- `GOOGLE_API_KEY`
- `OPENAI_API_KEY`

## Package Management

Uses pnpm with workspace configuration. The docs subdirectory has its own package.json for VitePress dependencies.
