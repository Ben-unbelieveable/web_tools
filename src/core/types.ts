import type { ElementType } from 'react'
import type { CategoryId } from './categories'

/** How a tool may access data (for UI hints and future policy). */
export type ToolCapability = 'paste-text' | 'local-file' | 'network'

export interface ToolMeta {
  id: string
  path: string
  title: string
  description: string
  /** 首页分类与筛选 */
  category: CategoryId
  tags: string[]
  capabilities: ToolCapability[]
}

export interface ToolModule {
  meta: ToolMeta
  /** 通常为 `React.lazy` 结果，仅在进入对应路由时加载。 */
  Component: ElementType
}

/** Uniform result for future Local/Remote adapters. */
export type ToolRunResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; message: string; detail?: string }

export interface ToolExecutionAdapter {
  readonly id: 'local' | 'remote'
}
