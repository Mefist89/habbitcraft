"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroAvatarSrc, getHeroImageSrc } from "@/lib/heroAssets";
import PrimaryPillButton from "@/components/ui/PrimaryPillButton";

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
    <div className="min-h-screen bg-gradient-to-br from-bg-start to-bg-end text-on-surface pb-32">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(88,96,254,0.08)] flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container/20 border-2 border-primary">
            <Image
              src={avatarImageSrc}
              alt="Hero Avatar"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-[#5860fe]">HabbitCraft</span>
        </div>
        <Link
          href="/settings"
          className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 hover:scale-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </header>

      <main className="pt-24 px-6 space-y-10 max-w-2xl mx-auto">
        <section className="flex flex-col items-center text-center space-y-6">
          <div className="space-y-1">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">{t('dashboard.welcome')}, {firstName}! ⭐</h1>
            <p className="text-on-surface-variant font-medium">{t('dashboard.ready')}</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl scale-110"></div>
            <div className="relative w-48 h-48 rounded-full border-[6px] border-surface-container-lowest bg-surface-container-lowest shadow-xl overflow-hidden flex items-center justify-center">
              <Image
                src={heroImageSrc}
                alt="Selected Hero"
                fill
                className="object-contain p-4 drop-shadow-md"
                sizes="(max-width: 192px) 100vw, 192px"
                priority
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
              {t('dashboard.level')} {currentLevel}
            </div>
          </div>

          <div className="w-72 max-w-full bg-surface-container-highest h-5 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-linear-to-r from-primary to-tertiary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.min(xpProgress, 100)}%` }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black tracking-wide text-white mix-blend-difference">
              {currentXP} XP ({xpProgress}%)
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/quest" className="group text-left p-6 rounded-[2rem] bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform active:scale-95 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
              🛡️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.citadel.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.citadel.desc')}</p>
            </div>
          </Link>

          <Link href="/training" className="group text-left p-6 rounded-[2rem] bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform active:scale-95 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary-container/40 flex items-center justify-center text-3xl">
              🏃‍♂️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.training.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.training.desc')}</p>
            </div>
          </Link>

          <Link href="/quest" className="group text-left p-6 rounded-[2rem] bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform active:scale-95 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fff0d7] flex items-center justify-center text-3xl">
              ☀️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.dailyQuest.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.dailyQuest.desc')}</p>
            </div>
          </Link>

          <Link href="/shop" className="group text-left p-6 rounded-[2rem] bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform active:scale-95 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ffe5f0] flex items-center justify-center text-3xl">
              🛍️
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.shop.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.shop.desc')}</p>
            </div>
          </Link>

          <Link href="/zen" className="group text-left p-6 rounded-[2rem] bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform active:scale-95 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-tertiary-container/30 flex items-center justify-center text-3xl">
              🌙
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.zen.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.zen.desc')}</p>
            </div>
          </Link>

          <Link href="/dream" className="group text-left p-6 rounded-[2rem] bg-surface-container-lowest shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:scale-[1.02] transition-transform active:scale-95 flex flex-col items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-container/30 flex items-center justify-center text-3xl">
              📒
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">{t('dashboard.journal.title')}</h3>
              <p className="text-sm text-on-surface-variant">{t('dashboard.journal.desc')}</p>
            </div>
          </Link>
        </section>
        
        <section className="pt-4 flex justify-center">
          <PrimaryPillButton
            href="/quest"
            className="w-full"
          >
            {t('dashboard.start')}
          </PrimaryPillButton>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full h-24 bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(88,96,254,0.08)] flex justify-around items-center px-4 z-50">
        <button className="flex flex-col items-center justify-center bg-[#ded8ff] text-[#5860fe] rounded-full px-6 py-2 transition-all group">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.home')}</span>
        </button>
        <Link href="/quest" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:text-[#5860fe] transition-all group active:scale-90">
          <span className="material-symbols-outlined">explore</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.quests')}</span>
        </Link>
        <Link href="/training" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:text-[#5860fe] transition-all group active:scale-90">
          <span className="material-symbols-outlined">fitness_center</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.train')}</span>
        </Link>
        <Link href="/zen" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:text-[#5860fe] transition-all group active:scale-90">
          <span className="material-symbols-outlined">dark_mode</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">{t('dashboard.nav.sleep')}</span>
        </Link>
        <Link href="/dream" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:text-[#5860fe] transition-all group active:scale-90">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">Journal</span>
        </Link>
      </nav>
    </div>
  );
}
