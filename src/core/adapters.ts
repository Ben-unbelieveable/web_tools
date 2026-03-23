import type { ToolExecutionAdapter } from './types'

/** Default: all logic runs in the browser. Remote adapter can be added later with the same tool contracts. */
export const localAdapter: ToolExecutionAdapter = { id: 'local' }

export function getActiveAdapter(): ToolExecutionAdapter {
  return localAdapter
}
