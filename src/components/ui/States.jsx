// Loading, empty and error states shared by every list, so no screen is ever blank.

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-xl bg-current opacity-15 ${className}`} aria-hidden="true" />;
}

export function SkeletonList({ rows = 6 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-lg font-semibold">{title}</p>
      {message && <p className="mt-2 opacity-75">{message}</p>}
    </div>
  );
}

export function ErrorState({ message = "Could not load. Please check your internet connection.", onRetry }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center" role="alert">
      <p className="text-lg font-semibold">Something went wrong</p>
      <p className="mt-2 opacity-75">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 min-h-tap rounded-xl bg-tile px-6 text-ink active:opacity-80"
        >
          Try again
        </button>
      )}
    </div>
  );
}
