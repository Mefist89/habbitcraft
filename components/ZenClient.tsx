"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroImageSrc } from "@/lib/heroAssets";

export default function ZenClient({ profile }: { profile: any }) {
  const { t } = useLanguage();

  const heroImageSrc = getHeroImageSrc(profile?.selected_hero);

  return (
    <div className="bg-surface font-body text-on-surface min-h-[100dvh] pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl z-50 shadow-[0_20px_40px_rgba(88,96,254,0.08)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#5860fe] scale-95 hover:scale-105 active:scale-90 transition-transform flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <span className="material-symbols-outlined font-light">arrow_back</span>
          </Link>
          <h1 className="font-headline font-black tracking-tight text-xl text-[#5860fe]">HabbitCraft</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden ring-2 ring-primary-container/30 relative flex items-center justify-center">
          <Image 
            src={heroImageSrc} 
            alt="Hero Profile" 
            fill 
            className="object-contain p-1"
          />
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
        {/* Hero Section: Zen Zone Intro */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tertiary-container/30 text-tertiary font-label font-bold text-xs rounded-full uppercase tracking-wider">
            <span>{t('zen.quietTime')}</span>
          </div>
          <h2 className="font-headline font-extrabold text-4xl leading-tight text-on-surface">
            {t('zen.heading')}
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-[90%]">
            {t('zen.description')}
          </p>
        </section>

        {/* HP Regeneration Banner (Bento-style asymmetric card) */}
        <section className="relative overflow-hidden p-8 rounded-xl bg-linear-to-br from-primary to-primary-dim text-white shadow-[0_20px_40px_rgba(88,96,254,0.15)]">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-4xl shadow-inner">
              ⚡
            </div>
            <div className="space-y-2">
              <h3 className="font-headline font-bold text-2xl tracking-tight">{t('zen.rechargeTitle')}</h3>
              <p className="text-on-primary/90 font-medium">{t('zen.rechargeDesc')}</p>
            </div>
          </div>
          {/* Abstract background shape for asymmetry */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl"></div>
        </section>

        {/* Audio Cards Section */}
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h4 className="font-headline font-bold text-xl">{t('zen.healingAudios')}</h4>
            <span className="text-primary font-bold text-sm cursor-pointer hover:underline">{t('zen.seeAll')}</span>
          </div>
          <div className="grid gap-4">
            {/* Audio Card 1 */}
            <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="w-16 h-16 flex-shrink-0 bg-surface-container flex items-center justify-center rounded-lg text-3xl group-hover:scale-110 transition-transform">
                🧘‍♂️
              </div>
              <div className="ml-4 flex-grow">
                <p className="font-headline font-bold text-on-surface">{t('zen.audio1Title')}</p>
                <p className="text-on-surface-variant text-sm">{t('zen.audio1Desc')}</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>

            {/* Audio Card 2 */}
            <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="w-16 h-16 flex-shrink-0 bg-surface-container flex items-center justify-center rounded-lg text-3xl group-hover:scale-110 transition-transform">
                🌬️
              </div>
              <div className="ml-4 flex-grow">
                <p className="font-headline font-bold text-on-surface">{t('zen.audio2Title')}</p>
                <p className="text-on-surface-variant text-sm">{t('zen.audio2Desc')}</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>

            {/* Audio Card 3 */}
            <div className="group flex items-center p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 shadow-sm hover:shadow-md transition-all cursor-pointer">
              <div className="w-16 h-16 flex-shrink-0 bg-surface-container flex items-center justify-center rounded-lg text-3xl group-hover:scale-110 transition-transform">
                🌃
              </div>
              <div className="ml-4 flex-grow">
                <p className="font-headline font-bold text-on-surface">{t('zen.audio3Title')}</p>
                <p className="text-on-surface-variant text-sm">{t('zen.audio3Desc')}</p>
              </div>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-container text-on-primary-container group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              </button>
            </div>
          </div>
        </section>

        {/* Custom Sleep Progress Tracker "Cloud Slider" */}
        <section className="p-8 rounded-xl bg-surface-container-low space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">😴</span>
            <h4 className="font-headline font-bold text-xl">{t('zen.currentLevel')}</h4>
          </div>
          <div className="relative pt-6">
            {/* Track */}
            <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
              {/* Progress */}
              <div className="h-full w-[65%] bg-linear-to-r from-secondary to-tertiary-container rounded-full"></div>
            </div>
            {/* Thumb/Indicator */}
            <div className="absolute top-3 left-[65%] -translate-x-1/2 w-10 h-10 bg-tertiary-fixed border-4 border-white rounded-full shadow-[0_4px_20px_rgba(238,172,220,0.6)] flex items-center justify-center text-xs font-bold text-on-tertiary-fixed">
              65%
            </div>
          </div>
          <p className="text-center text-sm font-medium text-on-surface-variant pt-2">
            {t('zen.levelDesc')}
          </p>
        </section>

        {/* Relaxing Activity Carousel */}
        <section className="space-y-4">
          <h4 className="font-headline font-bold text-xl">{t('zen.relaxActivities')}</h4>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
            <div className="flex-shrink-0 w-44 p-4 rounded-lg bg-surface-container-lowest snap-start shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-4xl">🎨</span>
              <p className="font-headline font-bold text-sm">{t('zen.relax1')}</p>
            </div>
            <div className="flex-shrink-0 w-44 p-4 rounded-lg bg-surface-container-lowest snap-start shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-4xl">📚</span>
              <p className="font-headline font-bold text-sm">{t('zen.relax2')}</p>
            </div>
            <div className="flex-shrink-0 w-44 p-4 rounded-lg bg-surface-container-lowest snap-start shadow-sm flex flex-col items-center text-center gap-2 cursor-pointer hover:shadow-md transition-shadow">
              <span className="text-4xl">🍵</span>
              <p className="font-headline font-bold text-sm">{t('zen.relax3')}</p>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(88,96,254,0.08)] rounded-t-[2rem]">
        <Link href="/" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">home</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Home</span>
        </Link>
        <Link href="/quest" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">explore</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Quests</span>
        </Link>
        <Link href="/training" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">fitness_center</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Training</span>
        </Link>
        <Link href="/zen" className="flex flex-col items-center justify-center bg-[#ded8ff] text-[#5860fe] rounded-full px-4 py-2 scale-110 transition-all border border-transparent shadow-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dark_mode</span>
          <span className="font-body font-medium text-[10px]">Sleep</span>
        </Link>
        <Link href="/dream" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">auto_stories</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Journal</span>
        </Link>
      </nav>
    </div>
  );
}
