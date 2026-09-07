# HexNodes

AI workflow generator that turns a short creative concept into a node-based
video generation pipeline — script, visual style, camera motion, and
finishing — each stage with a copy-ready generation prompt.

**Live:** https://hexnodes.vercel.app

## How it works

You type a concept (e.g. "a neon-noir detective chasing a rogue AI"). That's
sent to a server route (`app/api/generate-workflow/route.ts`), which calls
Claude with a system prompt describing the 4-stage pipeline shape. Claude
returns structured JSON tailored to your concept — genre, mood, palette,
camera choice, and a full prompt for each stage — which renders as a node
chain in the UI.

This is a real model call on every generation, not a template lookup — genre,
palette, and camera specs are derived by the model from the actual concept
text, not matched against a fixed keyword list.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind v4, shadcn-style components
- Claude (Anthropic API) for generation, called server-side

## Running locally

```bash
pnpm install
cp .env.example .env.local   # add your ANTHROPIC_API_KEY
pnpm dev
```

## Why this shape

Maps to HexCoded's node-based Creative Studio direction: each pipeline stage
is a discrete node with its own params and prompt, meant to sit next to (or
feed into) the kind of generation tools HexCoded is building.
