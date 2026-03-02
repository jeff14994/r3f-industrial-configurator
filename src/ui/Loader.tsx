/**
 * Loader — fullscreen loading fallback shown during Suspense.
 * Minimal, industrial aesthetic.
 */
export function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-spinner" />
        <p>Loading Scene…</p>
      </div>
    </div>
  );
}
