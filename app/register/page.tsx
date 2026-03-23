"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [next, setNext] = useState("/select-hero");

  useEffect(() => {
    const value =
      new URLSearchParams(window.location.search).get("next") ?? "/select-hero";
    setNext(value);
  }, []);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end px-6 py-8">
      {/* Top Bar with Back Button */}
      <div className="w-full flex justify-start mb-6">
        <Link
          href="/parent-gate"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-md shadow-soft hover:bg-white/80 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_back
          </span>
        </Link>
      </div>

      <main className="flex-1 w-full max-w-md flex flex-col items-center justify-center text-center mt-[-20px]">
        {/* Magic Key Icon */}
        <div className="relative w-24 h-24 mb-6 floating-anim">
          <div className="absolute inset-0 bg-primary/20 puf-shape blur-xl" />
          <div className="w-24 h-24 bg-gradient-to-br from-primary-light to-primary puf-shape shadow-floating flex items-center justify-center border-4 border-white relative">
            <span className="material-symbols-outlined text-white text-4xl">
              vpn_key
            </span>
          </div>
        </div>

        <h1 className="font-headline font-bold text-3xl text-primary tracking-tight mb-3">
          Create Account
        </h1>
        
        <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-10 px-4">
          Parents, create an account to save your hero&apos;s progress and unlock all features.
        </p>

        {/* Social Auth Option */}
        <div className="w-full space-y-4 mb-8">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-on-surface font-headline font-bold text-sm py-3.5 px-4 rounded-full border-2 border-outline hover:bg-black/5 hover:border-black/20 transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none group"
          >
            {isLoading ? (
              <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-outline" />
          <span className="font-body text-xs font-semibold text-on-surface-variant/60 uppercase tracking-wider">
            Or
          </span>
          <div className="flex-1 h-px bg-outline" />
        </div>

        {/* Alternative link */}
        <Link 
          href={`/login?next=${encodeURIComponent(next)}`}
          className="font-body text-sm text-primary hover:text-primary-light font-bold transition-colors"
        >
          Already have an account? Log In
        </Link>
      </main>

      {/* Footer */}
      <p className="text-center font-body text-[11px] text-on-surface-variant/40 mt-8">
        By creating an account, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
