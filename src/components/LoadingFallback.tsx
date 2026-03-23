/** 路由级懒加载时的占位（首页与各工具分包加载）。 */
export function LoadingFallback() {
  return (
    <div className="route-loading" aria-busy="true" aria-live="polite">
      <span className="route-loading-dot" aria-hidden />
      <span className="muted">加载中…</span>
    </div>
  )
}
