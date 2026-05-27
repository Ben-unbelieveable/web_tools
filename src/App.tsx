import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoadingFallback } from './components/LoadingFallback'
import { LEGACY_TOOL_PATHS } from './core/navRegistry'
import { ToolPage } from './pages/ToolPage'

const NavHomePage = lazy(() =>
  import('./pages/NavHomePage').then((m) => ({ default: m.NavHomePage })),
)
const ToolsHomePage = lazy(() =>
  import('./pages/ToolsHomePage').then((m) => ({ default: m.ToolsHomePage })),
)

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NavHomePage />
              </Suspense>
            }
          />
          <Route
            path="tools"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ToolsHomePage />
              </Suspense>
            }
          />
          <Route path="tools/:toolPath" element={<ToolPage />} />
          {LEGACY_TOOL_PATHS.map((slug) => (
            <Route
              key={slug}
              path={slug}
              element={<Navigate to={`/tools/${slug}`} replace />}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
