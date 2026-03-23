import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { LoadingFallback } from '../components/LoadingFallback'
import { getToolByPath } from '../core/registry'

export function ToolPage() {
  const { toolPath } = useParams()
  const path = toolPath ? `/${toolPath}` : '/'
  const mod = getToolByPath(path)

  if (!mod) {
    return <Navigate to="/" replace />
  }

  const { Component, meta } = mod

  return (
    <div className="page stack">
      <header className="page-header">
        <h1 className="h1">{meta.title}</h1>
      </header>
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </div>
  )
}
