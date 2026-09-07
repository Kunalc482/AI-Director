'use client'

import { useState } from 'react'
import {
  Wand2,
  CornerDownLeft,
  Loader2,
  Cpu,
  Gem,
  Sparkle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const EXAMPLES = [
  'A sci-fi short about a cybernetic samurai',
  'A neon-noir detective chasing a rogue AI',
  'A fantasy epic about a dragon-tamer at dawn',
  'A documentary drift over a dying coral reef',
]

type Preset = {
  label: string
  icon: typeof Cpu
  concept: string
}

const PRESETS: Preset[] = [
  {
    label: 'Cyberpunk Short',
    icon: Cpu,
    concept:
      'A cyberpunk short about a rogue courier outrunning a megacorp through neon rain-soaked streets',
  },
  {
    label: 'Luxury Commercial',
    icon: Gem,
    concept:
      'A luxury commercial for a minimalist chrome watch resting on flowing silk under studio light',
  },
  {
    label: 'Anime Intro',
    icon: Sparkle,
    concept:
      'An anime intro with a spiky-haired hero leaping and racing across city rooftops at sunset',
  },
]

export function ConceptInput({
  onGenerate,
  isGenerating = false,
}: {
  onGenerate: (concept: string) => void
  isGenerating?: boolean
}) {
  const [value, setValue] = useState('')

  function submit() {
    const trimmed = value.trim()
    if (!trimmed || isGenerating) return
    onGenerate(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      submit()
    }
  }

  function runPreset(concept: string) {
    if (isGenerating) return
    setValue(concept)
    onGenerate(concept)
  }

  return (
    <section className="w-full" aria-label="Concept input">
      <div className="rounded-2xl border border-border bg-card/70 p-2 backdrop-blur-sm shadow-[0_20px_60px_-30px_oklch(0_0_0_/_80%)]">
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-background/60 p-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 items-start gap-3">
            <Wand2 className="mt-2 size-4 shrink-0 text-primary" aria-hidden />
            <label className="sr-only" htmlFor="concept">
              Video or creative concept
            </label>
            <textarea
              id="concept"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={isGenerating}
              placeholder="Describe your video or creative concept…  e.g. A sci-fi short about a cybernetic samurai"
              className="max-h-40 min-h-11 flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-60"
            />
          </div>
          <Button
            onClick={submit}
            disabled={isGenerating || !value.trim()}
            className="gap-2 font-medium sm:self-stretch"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                <span>Generating…</span>
              </>
            ) : (
              <>
                <span>Generate workflow</span>
                <kbd className="hidden items-center gap-0.5 rounded bg-primary-foreground/15 px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex">
                  <span className="text-xs">⌘</span>
                  <CornerDownLeft className="size-3" aria-hidden />
                </kbd>
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-1 pt-3">
          <span className="pl-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Presets
          </span>
          {PRESETS.map((preset) => {
            const Icon = preset.icon
            return (
              <button
                key={preset.label}
                type="button"
                disabled={isGenerating}
                onClick={() => runPreset(preset.concept)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:bg-primary/15 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon className="size-3.5 text-primary" aria-hidden />
                {preset.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 px-1 pb-1 pt-2">
          <span className="pl-1 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            Try
          </span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              disabled={isGenerating}
              onClick={() => runPreset(ex)}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
