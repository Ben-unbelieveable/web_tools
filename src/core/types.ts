import type { ReactNode } from 'react'

/** How a tool may access data (for UI hints and future policy). */
export type ToolCapability = 'paste-text' | 'local-file' | 'network'

export interface ToolMeta {
  id: string
  path: string
  title: string
  description: string
  tags: string[]
  capabilities: ToolCapability[]
}

export interface ToolModule {
  meta: ToolMeta
  Component: () => ReactNode
}

/** Uniform result for future Local/Remote adapters. */
export type ToolRunResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; message: string; detail?: string }

export interface ToolExecutionAdapter {
  readonly id: 'local' | 'remote'
}
