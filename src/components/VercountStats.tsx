import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const VERCOUNT_API = 'https://events.vercount.one/api/v2/log'

interface VercountStatsData {
  sitePv: number
  pagePv: number
  siteUv: number
}

function parseVercountResponse(payload: unknown): VercountStatsData | null {
  if (!payload || typeof payload !== 'object') return null
  const body = payload as Record<string, unknown>
  const data =
    body.status === 'success' || body.status === 'error'
      ? (body.data as Record<string, unknown> | undefined)
      : body

  const source = data ?? body
  return {
    sitePv: Number(source.site_pv ?? 0),
    pagePv: Number(source.page_pv ?? 0),
    siteUv: Number(source.site_uv ?? 0),
  }
}

/** 读取 Vercount UV cookie，判断是否为站点新访客。 */
function isNewSiteVisitor(): boolean {
  const host = window.location.host.replace(/[^a-zA-Z0-9_-]/g, '_')
  const cookieName = `vercount_uv_${host}`
  const exists = document.cookie.split('; ').some((item) => item.startsWith(`${cookieName}=`))
  if (!exists) {
    document.cookie = `${cookieName}=1; path=/; max-age=31536000; samesite=lax`
    return true
  }
  return false
}

/**
 * 向 Vercount 上报当前页访问并返回统计数据。
 * 输入：页面完整 URL。输出：PV/UV 统计或 null。
 */
async function fetchVercountStats(pageUrl: string): Promise<VercountStatsData | null> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(VERCOUNT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: pageUrl, isNewUv: isNewSiteVisitor() }),
      signal: controller.signal,
    })
    if (!response.ok) return null
    return parseVercountResponse(await response.json())
  } catch {
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

/** 页脚 Vercount 访问统计（适配 React Router SPA 路由切换）。 */
export function VercountStats() {
  const { pathname } = useLocation()
  const [stats, setStats] = useState<VercountStatsData | null>(null)

  useEffect(() => {
    let cancelled = false

    void fetchVercountStats(window.location.href).then((data) => {
      if (!cancelled && data) setStats(data)
    })

    return () => {
      cancelled = true
    }
  }, [pathname])

  return (
    <span className="footer-stats muted small" aria-label="访问统计">
      本页{' '}
      <span id="vercount_value_page_pv" className="footer-stat-num">
        {stats ? stats.pagePv : '—'}
      </span>{' '}
      次 · 本站{' '}
      <span id="vercount_value_site_pv" className="footer-stat-num">
        {stats ? stats.sitePv : '—'}
      </span>{' '}
      次 · 访客{' '}
      <span id="vercount_value_site_uv" className="footer-stat-num">
        {stats ? stats.siteUv : '—'}
      </span>{' '}
      人
      <span className="footer-stats-credit">
        {' '}
        ·{' '}
        <a
          href="https://www.vercount.one/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          Vercount
        </a>
      </span>
    </span>
  )
}
