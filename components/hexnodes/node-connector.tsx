export function NodeConnector() {
  return (
    <div
      className="flex shrink-0 items-center justify-center xl:w-8"
      aria-hidden
    >
      {/* horizontal connector on wide screens */}
      <svg
        className="hidden h-4 w-8 xl:block"
        viewBox="0 0 32 16"
        fill="none"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="8"
          x2="26"
          y2="8"
          stroke="var(--muted-foreground)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-dash-flow"
          opacity="0.5"
        />
        <path d="M26 4 L32 8 L26 12 Z" fill="var(--primary)" />
      </svg>

      {/* vertical connector on narrow screens */}
      <svg
        className="h-8 w-4 xl:hidden"
        viewBox="0 0 16 32"
        fill="none"
        preserveAspectRatio="none"
      >
        <line
          x1="8"
          y1="0"
          x2="8"
          y2="26"
          stroke="var(--muted-foreground)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="animate-dash-flow"
          opacity="0.5"
        />
        <path d="M4 26 L8 32 L12 26 Z" fill="var(--primary)" />
      </svg>
    </div>
  )
}
