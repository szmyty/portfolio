"use client";

import { useEffect } from "react";

export default function Error({
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground px-4 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">
        Something went wrong
      </h2>
      <p className="text-sm text-text-secondary">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => unstable_retry()}
        className="mt-2 rounded-md border border-border px-4 py-2 text-sm text-text-primary transition-colors hover:bg-border"
      >
        Try again
      </button>
    </div>
  );
}
