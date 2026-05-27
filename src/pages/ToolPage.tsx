import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { SiteIcon } from '../components/SiteIcon'
import { resolveToolIconSources } from '../config/icons'
import { LoadingFallback } from '../components/LoadingFallback'
import { getToolByPath } from '../core/registry'

export function ToolPage() {
  const { toolPath } = useParams()
  const path = toolPath ? `/tools/${toolPath}` : '/tools'
  const mod = getToolByPath(path)

  if (!mod) {
    return <Navigate to="/tools" replace />
  }

  const { Component, meta } = mod

  return (
    <div className="page stack">
      <div className="tool-page-head row gap">
        <SiteIcon sources={resolveToolIconSources(meta)} size={36} />
        <h1 className="h1">{meta.title}</h1>
      </div>
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </div>
  )
}
