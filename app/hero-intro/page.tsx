"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Settings } from "lucide-react";

// Map hero IDs to their video filenames (note: mellisa has double-l in filename)
const heroVideoMap: Record<string, string> = {
  bruno: "/assets/video/bruno.mp4",
  felix: "/assets/video/felix.mp4",
  leo: "/assets/video/leo.mp4",
  luna: "/assets/video/luna.mp4",
  melisa: "/assets/video/mellisa.mp4",
  puf: "/assets/video/puf.mp4",
};

function HeroIntroContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const heroId = searchParams.get("hero") ?? "puf";
  const heroName = heroId.charAt(0).toUpperCase() + heroId.slice(1);
  const videoSrc = heroVideoMap[heroId] ?? heroVideoMap.puf;

  const handleStart = () => {
    router.push(`/profile-setup?hero=${heroId}`);
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#E0F2FE] to-[#F5F3FF] font-body text-on-surface pb-10">

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-white/70 backdrop-blur-md">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-outline active:scale-95 transition-transform"
        >
          <ArrowLeft className="text-primary w-6 h-6" />
        </button>
        <h1 className="font-headline font-bold text-xl tracking-tight text-primary">HERO INTRO</h1>
        <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-outline active:scale-95 transition-transform">
          <Settings className="text-primary w-6 h-6" />
        </button>
      </header>

      <div className="pt-24 px-6 flex flex-col items-center gap-8 max-w-2xl mx-auto">
        {/* Hero Name */}
        <h1 className="font-headline text-4xl md:text-5xl font-black text-primary tracking-tight text-center">
          {heroName}
        </h1>

        {/* Video Card */}
        <div className="w-[90%] rounded-[32px] overflow-hidden shadow-xl shadow-indigo-100/50 border border-outline bg-white">
          <video
            src={videoSrc}
            autoPlay
            loop
            controls
            playsInline
            className="w-full aspect-[5/5.5] object-cover"
          />
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full max-w-md py-6 bg-tertiary text-white font-headline font-bold text-xl tracking-[0.15em] rounded-full shadow-lg shadow-green-200 active:scale-[0.97] hover:-translate-y-1 hover:shadow-xl hover:shadow-green-300 transition-all uppercase"
        >
          START
        </button>
      </div>
    </div>
  );
}

export default function HeroIntroPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-gradient-to-br from-[#E0F2FE] to-[#F5F3FF] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <HeroIntroContent />
    </Suspense>
  );
}
