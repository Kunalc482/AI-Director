export type NodeParam = {
  key: string
  value: string
}

export type WorkflowNode = {
  id: string
  index: number
  title: string
  subtitle: string
  /** chart token index 1-4 used for the node's accent color */
  accent: 1 | 2 | 3 | 4
  params: NodeParam[]
  prompt: string
}

/**
 * Calls the server route, which asks Claude to build a workflow tailored to
 * the given concept. Throws on failure -- callers should catch and show an
 * error state rather than silently falling back, so it's always clear
 * whether a real generation happened.
 */
export async function generateWorkflow(concept: string): Promise<WorkflowNode[]> {
  const res = await fetch('/api/generate-workflow', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ concept }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error ?? 'Failed to generate workflow.')
  }

  return data.nodes as WorkflowNode[]
}
