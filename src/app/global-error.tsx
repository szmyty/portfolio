"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body
        style={{
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          background: "#0a0a0a",
          color: "#ededed",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Something went wrong
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#a1a1aa", marginBottom: "1rem" }}>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => unstable_retry()}
          style={{
            padding: "0.5rem 1rem",
            border: "1px solid #3f3f46",
            borderRadius: "0.375rem",
            background: "transparent",
            color: "#ededed",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
