'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="mt-20 flex flex-col items-center gap-3">
      <h1 className="text-center text-2xl font-bold">Oops! Something went wrong.</h1>
      <p className="text-center">Please try again or contact support if the problem persists.</p>
      <button onClick={reset} className="text-accent-blue">
        Try again
      </button>
      <p>Or</p>
      <Link href="/" className="rounded-xl bg-brand-500 px-5 py-3 text-white">
        Go back home
      </Link>
    </div>
  );
}
