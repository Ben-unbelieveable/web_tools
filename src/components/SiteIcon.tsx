import { useEffect, useMemo, useState } from 'react'
import { ICON_DEFAULTS } from '../config/icons'

interface SiteIconProps {
  /** 按顺序尝试的图标地址。 */
  sources: string[]
  size?: number
  className?: string
}

export function SiteIcon({ sources, size = ICON_DEFAULTS.faviconSize, className }: SiteIconProps) {
  const chain = useMemo(
    () => [...new Set(sources.filter(Boolean))],
    [sources],
  )

  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setIndex(0)
    setLoaded(false)
  }, [chain.join('|')])

  const src = chain[index] ?? ICON_DEFAULTS.siteFallback
  const isLetter = src.startsWith('data:image/svg+xml')

  const handleError = () => {
    setLoaded(false)
    setIndex((i) => (i < chain.length - 1 ? i + 1 : i))
  }

  return (
    <span
      className={[
        'site-icon',
        isLetter ? 'site-icon--letter' : 'site-icon--remote',
        loaded ? 'site-icon--loaded' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <img
        src={src}
        alt=""
        aria-hidden
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </span>
  )
}
