import { Link } from 'react-router-dom'
import type { ResourceLink } from '../../core/navTypes'

interface ResourceCardProps {
  resource: ResourceLink
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const content = (
    <>
      <div className="resource-card-head">
        <h3 className="resource-card-title">{resource.name}</h3>
        {resource.internal ? (
          <span className="tag tag-local">本站</span>
        ) : (
          <span className="tag tag-external" aria-hidden>
            ↗
          </span>
        )}
      </div>
      <p className="resource-card-desc">{resource.description}</p>
      {resource.tags && resource.tags.length > 0 && (
        <div className="tags">
          {resource.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  )

  if (resource.internal) {
    return (
      <Link to={resource.url} className="card card-tile resource-card">
        {content}
      </Link>
    )
  }

  return (
    <a
      href={resource.url}
      className="card card-tile resource-card"
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  )
}
