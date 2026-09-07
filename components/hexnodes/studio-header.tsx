import { Hexagon, Circle } from 'lucide-react'

export function StudioHeader() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="relative flex size-9 items-center justify-center rounded-lg border border-border bg-card">
          <Hexagon className="size-5 text-primary" aria-hidden />
          <span className="absolute inset-0 flex items-center justify-center">
            <Circle className="size-1.5 fill-primary text-primary" aria-hidden />
          </span>
        </div>
        <div className="leading-tight">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            HexNodes
          </h1>
          <p className="font-mono text-[11px] text-muted-foreground">
            AI Workflow Generator
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 sm:flex">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          pipeline ready
        </span>
      </div>
    </header>
  )
}
