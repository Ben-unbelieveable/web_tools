/** 按站点 URL 生成多个 favicon 候选地址（依次尝试）。 */
export function faviconSourcesForUrl(url: string, size = 32): string[] {
  try {
    const { hostname, protocol } = new URL(url)
    if (!hostname) return []

    const origin = `${protocol}//${hostname}`
    const sources = [
      `${origin}/favicon.ico`,
      `${origin}/favicon.png`,
      `${origin}/apple-touch-icon.png`,
      `https://icons.duckduckgo.com/ip3/${hostname}.ico`,
      `https://icon.horse/icon/${hostname}`,
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=${size}`,
    ]
    return [...new Set(sources)]
  } catch {
    return []
  }
}

/** 根据字符串生成稳定色相（0–360）。 */
export function hueFromString(input: string): number {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0
  }
  return hash % 360
}

/** 网络图标全部失败时，用站点名称首字母生成 SVG 占位图。 */
export function letterIconDataUrl(label: string, seed = label): string {
  const letter = (label.trim()[0] || '?').toUpperCase()
  const hue = hueFromString(seed)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="hsl(${hue} 58% 42%)"/>
  <text x="16" y="16" fill="#fff" font-family="system-ui,sans-serif" font-size="15" font-weight="700" text-anchor="middle" dominant-baseline="central">${letter}</text>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
