import { Navigate, useParams } from 'react-router-dom'
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
        <p className="muted">{meta.description}</p>
      </header>
      <Component />
    </div>
  )
}
