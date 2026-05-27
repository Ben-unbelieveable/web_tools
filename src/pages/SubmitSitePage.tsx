import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { listNavSections } from '../core/navSections'
import type { NavSectionId } from '../core/navTypes'
import { SITE_SUBMISSION_EMAIL } from '../config/siteSubmission'
import {
  buildSubmissionEmailBody,
  buildSubmissionMailtoUrl,
  isValidEmail,
  isValidHttpUrl,
  submitSiteViaEmail,
  type SiteSubmissionForm,
} from '../lib/siteSubmission'

const EMPTY_FORM: SiteSubmissionForm = {
  siteName: '',
  url: '',
  section: '',
  sectionLabel: '',
  description: '',
  tags: '',
  contactName: '',
  contactEmail: '',
  notes: '',
}

export function SubmitSitePage() {
  const sections = listNavSections()
  const [form, setForm] = useState<SiteSubmissionForm>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const preview = useMemo(() => buildSubmissionEmailBody(form), [form])

  function updateField<K extends keyof SiteSubmissionForm>(key: K, value: SiteSubmissionForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
    setSuccess(false)
  }

  function handleSectionChange(sectionId: string) {
    const section = sections.find((s) => s.id === sectionId)
    setForm((prev) => ({
      ...prev,
      section: (sectionId as NavSectionId) || '',
      sectionLabel: section?.label ?? '',
    }))
    setError(null)
    setSuccess(false)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!form.siteName.trim()) {
      setError('请填写站点名称')
      return
    }
    if (!isValidHttpUrl(form.url)) {
      setError('请填写有效的 http(s) 链接')
      return
    }
    if (!form.section) {
      setError('请选择建议分区')
      return
    }
    if (!form.description.trim()) {
      setError('请填写站点简介')
      return
    }
    if (!isValidEmail(form.contactEmail)) {
      setError('请填写有效的联系邮箱')
      return
    }

    setSubmitting(true)
    try {
      await submitSiteViaEmail(form)
      setSuccess(true)
      setForm(EMPTY_FORM)
    } catch {
      window.location.href = buildSubmissionMailtoUrl(form)
    } finally {
      setSubmitting(false)
    }
  }

  function handleCopyPreview() {
    void navigator.clipboard.writeText(preview)
  }

  return (
    <div className="page stack">
      <header className="page-header">
        <h1 className="h1">提交站点</h1>
        <p className="lead muted">
          推荐优质生信/科研资源收录到导航。填写下方表单后，系统将发送邮件至{' '}
          <a href={`mailto:${SITE_SUBMISSION_EMAIL}`}>{SITE_SUBMISSION_EMAIL}</a>
          ；若自动发送不可用，将打开您的邮件客户端并填入模板。
        </p>
      </header>

      <form className="submit-form stack" onSubmit={handleSubmit} noValidate>
        <div className="submit-form-grid">
          <div className="stack">
            <label className="field">
              <span className="field-label">站点名称 *</span>
              <input
                className="input"
                type="text"
                value={form.siteName}
                onChange={(e) => updateField('siteName', e.target.value)}
                placeholder="例如：NCBI GEO"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span className="field-label">站点 URL *</span>
              <input
                className="input"
                type="url"
                value={form.url}
                onChange={(e) => updateField('url', e.target.value)}
                placeholder="https://"
                autoComplete="url"
              />
            </label>

            <label className="field">
              <span className="field-label">建议分区 *</span>
              <select
                className="input select"
                value={form.section}
                onChange={(e) => handleSectionChange(e.target.value)}
              >
                <option value="">请选择分区</option>
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="field-label">简介 *</span>
              <textarea
                className="textarea"
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="一句话说明站点用途与特色"
                rows={4}
              />
            </label>

            <label className="field">
              <span className="field-label">标签（可选，逗号分隔）</span>
              <input
                className="input"
                type="text"
                value={form.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="例如：rna-seq, database"
              />
            </label>

            <div className="row gap">
              <label className="field" style={{ flex: 1 }}>
                <span className="field-label">您的称呼（可选）</span>
                <input
                  className="input"
                  type="text"
                  value={form.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                  autoComplete="name"
                />
              </label>
              <label className="field" style={{ flex: 1 }}>
                <span className="field-label">联系邮箱 *</span>
                <input
                  className="input"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  placeholder="便于回复审核结果"
                  autoComplete="email"
                />
              </label>
            </div>

            <label className="field">
              <span className="field-label">补充说明（可选）</span>
              <textarea
                className="textarea"
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="推荐理由、相似站点对比等"
                rows={3}
              />
            </label>

            {error && <p className="error">{error}</p>}
            {success && (
              <p className="submit-success">
                提交成功！我们已收到您的推荐，审核通过后将收录到对应分区。
              </p>
            )}

            <div className="row">
              <button className="button" type="submit" disabled={submitting}>
                {submitting ? '发送中…' : '提交并发送邮件'}
              </button>
              <button
                className="button ghost"
                type="button"
                onClick={() => {
                  window.location.href = buildSubmissionMailtoUrl(form)
                }}
              >
                用邮件客户端发送
              </button>
            </div>
          </div>

          <aside className="submit-preview card stack">
            <div className="row between">
              <h2 className="h2">邮件模板预览</h2>
              <button className="button ghost small-btn" type="button" onClick={handleCopyPreview}>
                复制
              </button>
            </div>
            <p className="muted small">提交后将按此格式发送至 {SITE_SUBMISSION_EMAIL}</p>
            <pre className="stats-pre submit-preview-body">{preview}</pre>
          </aside>
        </div>
      </form>
    </div>
  )
}
