export type CategoryId = 'format' | 'sequence' | 'workflow'

export const CATEGORIES: readonly { id: CategoryId; label: string }[] = [
  { id: 'format', label: '格式与编码' },
  { id: 'sequence', label: '序列与随机' },
  { id: 'workflow', label: '工作流' },
] as const

export function getCategoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}
