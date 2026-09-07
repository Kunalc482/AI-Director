import { NextResponse } from 'next/server'
import type { WorkflowNode } from '@/lib/generate-workflow'

export const runtime = 'nodejs'

const SYSTEM_PROMPT = `You are the generation engine behind HexNodes, a tool that turns a short creative concept into a node-based AI video generation pipeline.

Given a user's concept, return a JSON array of exactly 4 workflow nodes representing a real production pipeline:
1. "Script & Beats" (accent 1) — story architecture: logline, 8-beat structure, brief voiceover
2. "Visual Style & Image Prompts" (accent 2) — look development: palette, lighting, lens, composition, a copy-ready image-gen prompt
3. "Camera Motion & LTX Specs" (accent 3) — motion generation spec for a video model: shot type, camera movement, resolution, fps, frame count
4. "Upscale & Refinement" (accent 4) — finishing pass: upscaler, denoise, target resolution, frame interpolation, color grade

Tailor every field specifically to the user's concept — genre, mood, palette, and camera choices should clearly reflect what they described, not a generic template.

Respond with ONLY a raw JSON array (no markdown fences, no prose) matching this exact TypeScript shape:

{
  id: string
  index: number        // 1-4
  title: string
  subtitle: string
  accent: 1 | 2 | 3 | 4
  params: { key: string; value: string }[]   // 4-5 short key/value pairs per node
  prompt: string        // a full, copy-ready generation prompt for that stage
}[]`

export async function POST(req: Request) {
  try {
    const { concept } = await req.json()

    if (!concept || typeof concept !== 'string' || !concept.trim()) {
      return NextResponse.json({ error: 'A concept is required.' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Server is missing ANTHROPIC_API_KEY. Set it in your Vercel project env vars.' },
        { status: 500 },
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: concept.trim() }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic API error:', response.status, errText)
      return NextResponse.json({ error: 'Generation failed upstream.' }, { status: 502 })
    }

    const data = await response.json()
    const raw: string =
      data?.content?.find((b: { type: string }) => b.type === 'text')?.text ?? ''

    const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim()

    let nodes: WorkflowNode[]
    try {
      nodes = JSON.parse(cleaned)
    } catch {
      console.error('Failed to parse model output as JSON:', cleaned)
      return NextResponse.json({ error: 'Model returned malformed output.' }, { status: 502 })
    }

    if (!Array.isArray(nodes) || nodes.length === 0) {
      return NextResponse.json({ error: 'Model returned an empty workflow.' }, { status: 502 })
    }

    return NextResponse.json({ nodes })
  } catch (err) {
    console.error('generate-workflow route error:', err)
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 })
  }
}
