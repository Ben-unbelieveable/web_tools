import {
  SITE_SUBMISSION_EMAIL,
  SITE_SUBMISSION_ENDPOINT,
} from '../config/siteSubmission'
import type { NavSectionId } from '../core/navTypes'

export interface SiteSubmissionForm {
  siteName: string
  url: string
  section: NavSectionId | ''
  sectionLabel: string
  description: string
  tags: string
  contactName: string
  contactEmail: string
  notes: string
}

export function buildSubmissionEmailBody(form: SiteSubmissionForm): string {
  const lines = [
    '【资源导航 · 站点提交】',
    '',
    `站点名称：${form.siteName.trim()}`,
    `URL：${form.url.trim()}`,
    `建议分区：${form.sectionLabel || '（未选择）'}`,
    '',
    '简介：',
    form.description.trim(),
    '',
    `标签：${form.tags.trim() || '（无）'}`,
    '',
    `提交人：${form.contactName.trim() || '（未填写）'}`,
    `联系邮箱：${form.contactEmail.trim()}`,
  ]

  if (form.notes.trim()) {
    lines.push('', '补充说明：', form.notes.trim())
  }

  lines.push(
    '',
    '---',
    `提交时间：${new Date().toLocaleString('zh-CN', { hour12: false })}`,
    '来源：OnlineBioTools 资源导航',
  )

  return lines.join('\n')
}

export function buildSubmissionMailtoUrl(form: SiteSubmissionForm): string {
  const subject = encodeURIComponent(
    `【资源导航】站点提交：${form.siteName.trim() || '新站点'}`,
  )
  const body = encodeURIComponent(buildSubmissionEmailBody(form))
  return `mailto:${SITE_SUBMISSION_EMAIL}?subject=${subject}&body=${body}`
}

export async function submitSiteViaEmail(form: SiteSubmissionForm): Promise<void> {
  const payload = {
    _subject: `【资源导航】站点提交：${form.siteName.trim()}`,
    _captcha: 'false',
    _template: 'table',
    站点名称: form.siteName.trim(),
    URL: form.url.trim(),
    建议分区: form.sectionLabel || '（未选择）',
    简介: form.description.trim(),
    标签: form.tags.trim() || '（无）',
    提交人: form.contactName.trim() || '（未填写）',
    联系邮箱: form.contactEmail.trim(),
    补充说明: form.notes.trim() || '（无）',
    邮件正文: buildSubmissionEmailBody(form),
  }

  const response = await fetch(SITE_SUBMISSION_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`提交失败（HTTP ${response.status}）`)
  }

  const data = (await response.json()) as { success?: string; message?: string }
  if (data.success !== 'true') {
    throw new Error(data.message ?? '提交失败，请稍后重试')
  }
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}
