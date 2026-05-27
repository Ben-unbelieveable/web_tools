import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
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
      <h1 className="h1">{meta.title}</h1>
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </div>
  )
}
