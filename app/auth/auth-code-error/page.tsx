"use client";

import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-dvh bg-surface font-body flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">😵</div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">
          Oops! Authentication Error
        </h1>
        <p className="text-on-surface-variant font-medium leading-relaxed">
          Something went wrong during sign-in. The authorization code may have expired or was already used. Please try again.
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/login"
            className="w-full py-4 rounded-full bg-linear-to-r from-primary to-primary-container text-on-primary font-headline font-extrabold text-lg shadow-lg hover:opacity-90 active:scale-95 transition-all text-center"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="w-full py-3 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest active:scale-95 transition-all text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
