"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroAvatarSrc, getHeroImageSrc } from "@/lib/heroAssets";

export default function DashboardClient({ profile }: { profile: any }) {
  const { t } = useLanguage();

  const firstName = profile?.name ? profile.name.split(" ")[0] : "Explorer";
  const heroImageSrc = getHeroImageSrc(profile?.selected_hero);
  const avatarImageSrc = getHeroAvatarSrc(profile?.selected_hero);

  const [currentXP, setCurrentXP] = useState(profile?.xp || 0);
  const [currentLevel, setCurrentLevel] = useState(profile?.level || 1);

  const fetchXP = useCallback(async () => {
    try {
      const res = await fetch("/api/xp");
      if (res.ok) {
        const data = await res.json();
        setCurrentXP(data.xp);
        setCurrentLevel(data.level);
      }
    } catch (err) {
      console.error("Failed to fetch XP:", err);
    }
  }, []);

  useEffect(() => {
    fetchXP();
  }, [fetchXP]);

  const xpProgress = (currentXP % 50) * 2; // Real XP progress percentage

  return (
    <div className="min-h-dvh pb-32">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full h-20 bg-white/80 backdrop-blur-xl flex items-center justify-between px-6 z-50 border-b border-outline">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
            <Image 
              src={avatarImageSrc} 
              alt="Hero Avatar" 
              width={48} 
              height={48} 
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-headline font-bold text-lg text-on-surface leading-tight tracking-tight">HabbitCraft</h2>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse-glow"></span>
              <span className="text-xs font-bold text-tertiary">LVL {currentLevel}</span>
            </div>
          </div>
        </div>
        <Link 
          href="/settings"
          className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors focus:ring-2 focus:ring-primary outline-none active:scale-95"
        >
          <span className="material-symbols-outlined text-[28px]">settings</span>
        </Link>
      </header>

      <main className="pt-28 px-6 space-y-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Welcome Section */}
        <section className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-1">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">{t('dashboard.welcome')}, {firstName}! ⭐</h1>
            <p className="text-on-surface-variant font-medium">{t('dashboard.ready')}</p>
          </div>
          
          {/* Hero Display */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110"></div>
            <div className="relative w-48 h-48 rounded-full border-[6px] border-white shadow-xl overflow-hidden flex items-center justify-center">
              <Image 
                src={heroImageSrc} 
                alt="Selected Hero" 
                fill 
                className="object-contain p-4 drop-shadow-md hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 192px) 100vw, 192px"
                priority
              />
            </div>
            <div className="absolute bottom-0 -right-2 bg-tertiary text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg border-2 border-white">
              {t('dashboard.level')} {currentLevel}
            </div>
          </div>
          
          {/* Simplified XP Bar */}
          <div className="w-48 bg-surface-container-highest h-3 rounded-full overflow-hidden mt-2 relative">
            <div className="h-full bg-linear-to-r from-primary to-tertiary rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(xpProgress, 100)}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white mix-blend-difference">{currentXP} XP ({xpProgress}%)</div>
          </div>
        </section>

        {/* Bento Grid Navigation Modules */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Citadela */}
          <Link href="/quest" className="group text-left p-6 rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-primary/10 hover:border-primary/20 hover:scale-[1.02] border border-transparent transition-all active:scale-95 flex flex-col items-start gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              🛡️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.citadel.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.citadel.desc')}</p>
            </div>
          </Link>

          {/* Training Ground */}
          <Link href="/training" className="group text-left p-6 rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-secondary/10 hover:border-secondary/20 hover:scale-[1.02] border border-transparent transition-all active:scale-95 flex flex-col items-start gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-3xl">
              🏃‍♂️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.training.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.training.desc')}</p>
            </div>
          </Link>

          {/* Daily Quest */}
          <Link href="/quest" className="group text-left p-6 rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-orange-200/40 hover:border-orange-200 hover:scale-[1.02] border border-transparent transition-all active:scale-95 flex flex-col items-start gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-3xl">
              ☀️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.dailyQuest.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.dailyQuest.desc')}</p>
            </div>
          </Link>

          {/* Shop */}
          <Link href="/shop" className="group text-left p-6 rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-pink-200/40 hover:border-pink-200 hover:scale-[1.02] border border-transparent transition-all active:scale-95 flex flex-col items-start gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-3xl">
              🛍️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.shop.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.shop.desc')}</p>
            </div>
          </Link>

          {/* Zen Zone */}
          <Link href="/zen" className="group text-left p-6 rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-tertiary/10 hover:border-tertiary/20 hover:scale-[1.02] border border-transparent transition-all active:scale-95 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center text-3xl">
              🌙
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.zen.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.zen.desc')}</p>
            </div>
          </Link>

          {/* Dream Journal */}
          <Link href="/dream" className="group text-left p-6 rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-primary/10 hover:border-primary/20 hover:scale-[1.02] border border-transparent transition-all active:scale-95 flex flex-col items-start gap-4 cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              📒
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.journal.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.journal.desc')}</p>
            </div>
          </Link>
        </section>

        {/* CTA Section */}
        <section className="pt-6 pb-6 flex justify-center w-full">
          <Link 
            href="/quest"
            className="w-full py-5 bg-linear-to-r from-primary to-primary-light text-white font-headline font-bold text-lg rounded-full shadow-[0_15px_30px_rgba(60,67,228,0.25)] hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            {t('dashboard.start')}
          </Link>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full h-24 bg-white/80 backdrop-blur-xl border-t border-white shadow-[0_-10px_40px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pb-2 z-50">
        <button className="flex flex-col items-center justify-center bg-primary/10 text-primary rounded-2xl px-4 py-2.5 transition-all group">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.home')}</span>
        </button>
        <Link href="/quest" className="flex flex-col items-center justify-center text-on-surface-variant/50 px-3 py-2 hover:text-primary transition-all group active:scale-90 cursor-pointer">
          <span className="material-symbols-outlined text-[28px]">explore</span>
          <span className="font-body text-[10px] text-on-surface-variant/50 group-hover:text-primary font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.quests')}</span>
        </Link>
        <Link href="/training" className="flex flex-col items-center justify-center text-on-surface-variant/50 px-3 py-2 hover:text-primary transition-all group active:scale-90 cursor-pointer">
          <span className="material-symbols-outlined text-[28px]">fitness_center</span>
          <span className="font-body text-[10px] text-on-surface-variant/50 group-hover:text-primary font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.train')}</span>
        </Link>
        <Link href="/zen" className="flex flex-col items-center justify-center text-on-surface-variant/50 px-3 py-2 hover:text-primary transition-all group active:scale-90">
          <span className="material-symbols-outlined text-[28px]">dark_mode</span>
          <span className="font-body text-[10px] text-on-surface-variant/50 group-hover:text-primary font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.sleep')}</span>
        </Link>
        <Link href="/dream" className="flex flex-col items-center justify-center text-on-surface-variant/50 px-3 py-2 hover:text-primary transition-all group active:scale-90">
          <span className="material-symbols-outlined text-[28px]">auto_stories</span>
          <span className="font-body text-[10px] text-on-surface-variant/50 group-hover:text-primary font-bold uppercase tracking-widest mt-1">Journal</span>
        </Link>
      </nav>
    </div>
  );
}
