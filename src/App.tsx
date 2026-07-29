import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoadingFallback } from './components/LoadingFallback'
import { NAV_SECTIONS } from './core/navSections'
import { LEGACY_TOOL_PATHS } from './core/navRegistry'
import { ToolPage } from './pages/ToolPage'

const NavSectionPage = lazy(() =>
  import('./pages/NavSectionPage').then((m) => ({ default: m.NavSectionPage })),
)

const SubmitSitePage = lazy(() =>
  import('./pages/SubmitSitePage').then((m) => ({ default: m.SubmitSitePage })),
)

const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })),
)

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/online-tools" replace />} />
          {NAV_SECTIONS.map((s) => (
            <Route
              key={s.id}
              path={s.path.replace(/^\//, '')}
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <NavSectionPage />
                </Suspense>
              }
            />
          ))}
          <Route path="tools" element={<Navigate to="/online-tools" replace />} />
          <Route path="tools/:toolPath" element={<ToolPage />} />
          {LEGACY_TOOL_PATHS.map((slug) => (
            <Route
              key={slug}
              path={slug}
              element={<Navigate to={`/tools/${slug}`} replace />}
            />
          ))}
          <Route
            path="submit"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SubmitSitePage />
              </Suspense>
            }
          />
          <Route
            path="about"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AboutPage />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to="/online-tools" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
