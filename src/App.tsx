import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LoadingFallback } from './components/LoadingFallback'
import { ToolPage } from './pages/ToolPage'

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })))

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route path=":toolPath" element={<ToolPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
