"use client";

import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="font-body text-on-surface overflow-hidden h-dvh w-screen relative bg-linear-to-b from-[#E0F2FE] to-white">
      {/* Background Decoration: Soft Clouds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-[10%] left-[5%] w-64 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-[25%] right-[-5%] w-80 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] left-[15%] w-72 h-36 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* UI Overlay Shell (Corners) */}
      {/* Top-Left: Settings */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/settings" className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 transition-all border border-white">
          <span className="material-symbols-outlined text-[#6C63FF] text-[32px]">settings</span>
        </Link>
      </div>

      {/* Top-Right: Help */}
      <div className="fixed top-6 right-6 z-50">
        <Link href="/about" className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 transition-all border border-white">
          <span className="material-symbols-outlined text-[#6C63FF] text-[32px]">help</span>
        </Link>
      </div>

      {/* Bottom-Left: Profile */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link href="/login" className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 transition-all border border-white">
          <span className="material-symbols-outlined text-[#6C63FF] text-[32px]">person</span>
        </Link>
      </div>

      {/* Bottom-Right: Contact */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link href="/contact" className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:scale-105 active:scale-95 transition-all border border-white">
          <span className="material-symbols-outlined text-[#6C63FF] text-[32px]">support_agent</span>
        </Link>
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full space-y-12">
        {/* Logo Section */}
        <div className="text-center flex flex-col items-center">
          <Image
            src="/assets/logo/logo.png"
            alt="HabbitCraft"
            width={260}
            height={90}
            className="h-auto w-[220px] md:w-[260px] drop-shadow-sm"
            priority
          />
          <p className="font-body font-medium text-[#636E72]/70 text-sm md:text-base mt-3">
            Small Blocks, Big Heroes. Craft Yourself.
          </p>
        </div>

        {/* Character Sprite Decoration (Puf) */}
        <div className="relative w-48 h-48 flex items-center justify-center animate-[floating_6s_ease-in-out_infinite]">
          <div className="absolute inset-0 bg-[#6C63FF]/10 puf-shape blur-2xl"></div>
          <div className="w-40 h-40 bg-linear-to-br from-[#6C63FF] to-[#8e87ff] puf-shape shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] relative flex items-center justify-center overflow-hidden border-4 border-white">
            {/* Puf Face */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-6">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="w-8 h-1 bg-white/40 rounded-full mt-2"></div>
            </div>
          </div>
        </div>

        {/* PLAY BUTTON */}
        <div className="w-full max-w-xs px-6">
          <Link href="/disclaimer" className="block w-full bg-linear-to-r from-[#6C63FF] to-[#8e87ff] py-6 rounded-2xl shadow-[0_20px_25px_-5px_rgba(108,99,255,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:scale-[1.02] active:scale-95 transition-all duration-300">
            <span className="font-headline font-bold text-[32px] md:text-[40px] text-white tracking-wide uppercase flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-[48px]">play_arrow</span>
              PLAY
            </span>
          </Link>
        </div>

        {/* Secondary Buttons */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm px-10">
          <Link
            href="/shop"
            className="flex-1 bg-white py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 border border-[#E2E8F0]"
          >
            <span className="material-symbols-outlined text-[24px] text-[#FF6584]">shopping_bag</span>
            <span className="font-headline font-bold text-lg text-[#2D3436]">SHOP</span>
          </Link>
          <Link
            href="/rank"
            className="flex-1 bg-white py-4 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 border border-[#E2E8F0]"
          >
            <span className="material-symbols-outlined text-[24px] text-[#4ECDC4]">leaderboard</span>
            <span className="font-headline font-bold text-lg text-[#2D3436]">RANK</span>
          </Link>
        </div>

        {/* Version/Status Bar Footer */}
        <div className="absolute bottom-10 text-center w-full">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/50 shadow-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="font-body text-[11px] uppercase tracking-widest font-semibold text-[#636E72]/70">
              STABLE v2.4.0 • CLOUD ONLINE
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
