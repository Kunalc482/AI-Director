'use client'

import { useState } from 'react'
import { Loader2, TriangleAlert } from 'lucide-react'
import { StudioHeader } from '@/components/hexnodes/studio-header'
import { ConceptInput } from '@/components/hexnodes/concept-input'
import { NodeChain } from '@/components/hexnodes/node-chain'
import { generateWorkflow, type WorkflowNode } from '@/lib/generate-workflow'

export default function Page() {
  const [concept, setConcept] = useState<string | null>(null)
  const [nodes, setNodes] = useState<WorkflowNode[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGenerate(next: string) {
    setIsGenerating(true)
    setError(null)
    try {
      const result = await generateWorkflow(next)
      setConcept(next)
      setNodes(result)
    } catch (err) {
      setConcept(null)
      setNodes([])
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="node-grid relative min-h-screen w-full">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-70"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 0%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)',
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <StudioHeader />

        <div className="mx-auto w-full max-w-3xl pt-2 text-center">
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            From concept to a full generation pipeline
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground">
            Enter a video or creative idea and HexNodes wires it into a
            node-based workflow — script, visual style, camera motion, and
            finishing — each with copy-ready prompts.
          </p>
        </div>

        <div className="mx-auto w-full max-w-3xl">
          <ConceptInput onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>

        {isGenerating ? (
          <GeneratingState />
        ) : error ? (
          <ErrorState message={error} />
        ) : concept ? (
          <section aria-label="Generated workflow" className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                Workflow
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="max-w-[60%] truncate font-mono text-[11px] text-foreground/80">
                {`"${concept}"`}
              </span>
            </div>
            <NodeChain nodes={nodes} />
          </section>
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  )
}

const GENERATING_STEPS = [
  'Parsing concept',
  'Drafting beats',
  'Styling frames',
  'Solving camera',
  'Refining output',
]

function GeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-card/40 px-6 py-16 text-center">
      <div className="relative mb-5 flex size-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <span className="relative flex size-14 items-center justify-center rounded-full border border-primary/40 bg-primary/10">
          <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        </span>
      </div>
      <p className="text-sm font-medium text-foreground">
        Generating your workflow…
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {GENERATING_STEPS.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              {step}
            </span>
            {i < GENERATING_STEPS.length - 1 && (
              <span className="size-1 rounded-full bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-destructive/40 bg-destructive/5 px-6 py-16 text-center">
      <TriangleAlert className="mb-4 size-8 text-destructive" aria-hidden />
      <p className="text-sm font-medium text-foreground">Generation failed</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 px-6 py-16 text-center">
      <div className="mb-4 flex items-center gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: `var(--chart-${n})` }}
            />
            {n < 4 && <span className="h-px w-6 bg-border" />}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Your node chain will render here once you generate a workflow.
      </p>
    </div>
  )
}
