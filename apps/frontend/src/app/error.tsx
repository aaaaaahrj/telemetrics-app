// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold">Something went wrong!</h2>
      <pre className="mt-2">{error.message}</pre>
      <button className="mt-4 underline" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
