"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const moods = ["😊", "😮", "😴", "🦄", "🛸"];

export default function DreamClient({ profile }: { profile: any }) {
  const { t, language } = useLanguage();
  const [selectedMood, setSelectedMood] = useState(1);
  const [dreamText, setDreamText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const avatarImageSrc = profile?.selected_hero
    ? `/assets/circle-characters/${profile.selected_hero}-c.png`
    : `/assets/circle-characters/puf-c.png`;

  const analyzeDream = async () => {
    if (!dreamText.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/dream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dream: dreamText,
          mood: moods[selectedMood],
          lang: language,
        }),
      });
      const data = await response.json();
      if (data.analysis) {
        setAiResponse(data.analysis);
      }
    } catch (error) {
      console.error("Error analyzing dream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-dvh">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-96 h-96 bg-primary-container/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[20%] left-[-5%] w-72 h-72 bg-tertiary-container/10 blur-[80px] rounded-full"></div>
      </div>

      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(88,96,254,0.08)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src={avatarImageSrc}
              alt="Avatar"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-2xl font-black bg-linear-to-br from-[#5860fe] to-[#8688ff] bg-clip-text text-transparent font-headline tracking-tight">HabbitCraft</span>
        </div>
        <Link
          href="/settings"
          className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform duration-200"
        >
          <span className="material-symbols-outlined text-2xl">settings</span>
        </Link>
      </nav>

      {/* Main Content Canvas */}
      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="space-y-2">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface">{t('dream.heading')}</h1>
          <p className="text-on-surface-variant font-medium">{t('dream.subtitle')}</p>
        </header>

        {/* Bento Input Section */}
        <section className="grid grid-cols-1 gap-6">
          {/* Dream Text Area */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_20px_40px_rgba(88,96,254,0.04)] ring-1 ring-outline-variant/10">
            <textarea
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              className="w-full min-h-[240px] bg-transparent border-none focus:ring-0 text-xl font-body leading-relaxed text-on-surface placeholder:text-outline-variant/60 resize-none p-0 focus:outline-none"
              placeholder={t('dream.placeholder')}
            />
            <div className="mt-4 flex justify-between items-center pt-4 border-t border-surface-container-high/50">
              <span className="text-xs font-label uppercase tracking-widest text-outline-variant font-bold">{t('dream.detailsLabel')}</span>
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim cursor-pointer hover:scale-110 transition-transform">mic</span>
                <span className="material-symbols-outlined text-primary-fixed-dim cursor-pointer hover:scale-110 transition-transform">image</span>
              </div>
            </div>
          </div>

          {/* Mood Selector */}
          <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-lg">{t('dream.moodTitle')}</h3>
            <div className="flex justify-between items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {moods.map((mood, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMood(i)}
                  className={`flex-shrink-0 w-16 h-16 bg-surface-container-lowest rounded-full flex items-center justify-center text-3xl shadow-sm hover:scale-110 active:scale-95 transition-all cursor-pointer ${
                    selectedMood === i ? "ring-4 ring-primary-container" : ""
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* AI Feedback Area (Dynamic Appearance) */}
          <div className={`relative overflow-hidden bg-linear-to-br from-primary-container to-secondary-container rounded-xl p-1 transition-all duration-500 ${aiResponse || isLoading ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
            <div className="bg-surface-container-lowest rounded-[calc(1rem-4px)] p-6 flex gap-4 items-start shadow-inner">
              <div className={`w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0 ${isLoading ? 'animate-pulse' : ''}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isLoading ? 'hourglass_empty' : 'auto_awesome'}
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-primary text-sm font-label uppercase tracking-wider">{t('dream.dreamGuideLabel')}</p>
                <div className="text-lg font-medium leading-snug">
                  {isLoading ? (
                    <div className="flex gap-1 items-center">
                      <span className="animate-bounce">✨</span>
                      <span className="animate-bounce [animation-delay:0.2s]">✨</span>
                      <span className="animate-bounce [animation-delay:0.4s]">✨</span>
                    </div>
                  ) : (
                    aiResponse || t('dream.dreamGuideText')
                  )}
                </div>
              </div>
            </div>
            {/* Abstract Nebula Decorations */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-tertiary-container/30 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-primary-container/30 blur-3xl rounded-full"></div>
          </div>
        </section>

        {/* Action Button */}
        <div className="py-4">
          <button
            onClick={analyzeDream}
            disabled={isLoading || !dreamText.trim()}
            className="w-full py-5 rounded-full bg-linear-to-r from-primary to-primary-container text-on-primary font-headline font-extrabold text-xl shadow-[0_20px_40px_rgba(88,96,254,0.3)] hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
          >
            {isLoading ? "Analyzing..." : t('dream.saveButton')}
          </button>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-2 bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(88,96,254,0.1)] rounded-t-[2rem] z-50">
        <Link href="/" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all active:scale-90 group">
          <span className="material-symbols-outlined group-hover:text-primary">home</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-primary">Home</span>
        </Link>
        <Link href="/quest" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all active:scale-90 group">
          <span className="material-symbols-outlined group-hover:text-primary">fort</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-primary">Quests</span>
        </Link>
        <Link href="/zen" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all active:scale-90 group">
          <span className="material-symbols-outlined group-hover:text-primary">dark_mode</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-primary">Sleep</span>
        </Link>
        <Link href="/dream" className="flex flex-col items-center justify-center bg-[#ded8ff] text-[#5860fe] rounded-full px-5 py-2 scale-110 transition-all active:scale-90">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">Journal</span>
        </Link>
      </nav>
    </div>
  );
}
