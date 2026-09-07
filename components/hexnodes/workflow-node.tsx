'use client'

import { useState } from 'react'
import { Check, Copy, FileText, Palette, Video, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/hexnodes/toast'
import type { WorkflowNode } from '@/lib/generate-workflow'

const ICONS = {
  script: FileText,
  style: Palette,
  camera: Video,
  upscale: Sparkles,
} as const

export function WorkflowNodeCard({ node }: { node: WorkflowNode }) {
  const [copied, setCopied] = useState(false)
  const { notify } = useToast()
  const Icon = ICONS[node.id as keyof typeof ICONS] ?? FileText
  const accent = `var(--chart-${node.accent})`

  async function handleCopy() {
    const label = `NODE_${String(node.index).padStart(2, '0')} · ${node.title}`
    const params = node.params
      .map((p) => `${p.key}: ${p.value}`)
      .join('\n')
    const contents = `${label}\n${'-'.repeat(label.length)}\n${params}\n\nPROMPT:\n${node.prompt}`

    try {
      await navigator.clipboard.writeText(contents)
      setCopied(true)
      notify(`Copied ${node.title}`)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
      notify('Copy failed — check clipboard permissions')
    }
  }

  return (
    <div
      className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_0_oklch(1_0_0_/_5%)_inset,0_20px_40px_-24px_oklch(0_0_0_/_70%)] transition-colors"
      style={{ ['--node-accent' as string]: accent }}
    >
      {/* accent top edge */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        aria-hidden
      />

      {/* connection ports */}
      <span
        className="absolute -left-[5px] top-1/2 hidden size-2.5 -translate-y-1/2 rounded-full border-2 border-background xl:block"
        style={{ backgroundColor: accent }}
        aria-hidden
      />
      <span
        className="absolute -right-[5px] top-1/2 hidden size-2.5 -translate-y-1/2 rounded-full border-2 border-background xl:block"
        style={{ backgroundColor: accent }}
        aria-hidden
      />

      <div className="flex items-start gap-3 px-4 pt-4">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border"
          style={{ backgroundColor: `color-mix(in oklch, ${accent} 16%, transparent)` }}
        >
          <Icon className="size-5" style={{ color: accent }} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[11px] font-medium tabular-nums"
              style={{ color: accent }}
            >
              {`NODE_${String(node.index).padStart(2, '0')}`}
            </span>
            <span className="text-[11px] text-muted-foreground">{node.subtitle}</span>
          </div>
          <h3 className="mt-0.5 text-pretty text-sm font-semibold leading-tight text-card-foreground">
            {node.title}
          </h3>
        </div>
      </div>

      <dl className="mt-4 flex flex-col gap-px bg-border/60">
        {node.params.map((param) => (
          <div
            key={param.key}
            className="flex items-baseline justify-between gap-3 bg-card px-4 py-2"
          >
            <dt className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              {param.key}
            </dt>
            <dd className="text-pretty text-right font-mono text-[11px] text-card-foreground/90">
              {param.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-auto p-3">
        <Button
          onClick={handleCopy}
          variant="secondary"
          size="sm"
          className="w-full justify-center gap-2 font-mono text-xs"
          aria-label={`Copy prompt for ${node.title}`}
        >
          {copied ? (
            <>
              <Check className="size-3.5" style={{ color: accent }} aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden />
              Copy Prompt
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
