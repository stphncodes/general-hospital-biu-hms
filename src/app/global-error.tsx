"use client";

/**
 * Last-resort boundary for errors in the root layout itself. It replaces the
 * root layout, so it must render <html>/<body> and cannot rely on providers
 * or global CSS; styling is therefore minimal and inline.
 */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "4rem 1rem",
          textAlign: "center",
        }}
      >
        <main role="alert">
          <h1 style={{ fontSize: "1.25rem" }}>The application failed to load</h1>
          <p>Please try again. If the problem continues, contact support.</p>
          {error.digest && (
            <p style={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
              Reference: {error.digest}
            </p>
          )}
          <button type="button" onClick={() => retry()}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
