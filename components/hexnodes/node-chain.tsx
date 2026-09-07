import { Fragment } from 'react'
import type { WorkflowNode } from '@/lib/generate-workflow'
import { WorkflowNodeCard } from './workflow-node'
import { NodeConnector } from './node-connector'

export function NodeChain({ nodes }: { nodes: WorkflowNode[] }) {
  return (
    <div className="flex flex-col items-stretch gap-0 xl:flex-row xl:items-stretch">
      {nodes.map((node, i) => (
        <Fragment key={node.id}>
          <div className="flex xl:flex-1">
            <WorkflowNodeCard node={node} />
          </div>
          {i < nodes.length - 1 && <NodeConnector />}
        </Fragment>
      ))}
    </div>
  )
}
