"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroImageSrc } from "@/lib/heroAssets";
import ZenAudioPlayer from "@/components/ZenAudioPlayer";

export default function AudioClient({ profile }: { profile: any }) {
  const { t } = useLanguage();
  const heroImageSrc = getHeroImageSrc(profile?.selected_hero);

  return (
    <div className="bg-surface font-body text-on-surface min-h-[100dvh] pb-32">
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl z-50 shadow-[0_20px_40px_rgba(88,96,254,0.08)]">
        <div className="flex items-center gap-3">
          <Link href="/zen" className="text-[#5860fe] scale-95 hover:scale-105 active:scale-90 transition-transform flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <span className="material-symbols-outlined font-light">arrow_back</span>
          </Link>
          <h1 className="font-headline font-black tracking-tight text-xl text-[#5860fe]">
            {t("audio.title")}
          </h1>
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

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        <section className="rounded-[2rem] bg-linear-to-br from-primary to-primary-dim text-white p-6 shadow-[0_20px_40px_rgba(88,96,254,0.15)]">
          <div className="space-y-3">
            <p className="font-headline font-black text-sm uppercase tracking-[0.24em] text-white/75">
              {t("audio.eyebrow")}
            </p>
            <h2 className="font-headline font-extrabold text-4xl tracking-tight">
              {t("audio.heading")}
            </h2>
            <p className="text-white/85 text-lg leading-relaxed">
              {t("audio.description")}
            </p>
          </div>
        </section>

        <ZenAudioPlayer titleKey="audio.playerTitle" subtitleKey="audio.playerSubtitle" />

        <section className="grid md:grid-cols-2 gap-4">
          <Link
            href="/zen"
            className="rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">🌙</div>
            <p className="font-headline font-bold text-lg mb-1">{t("audio.backToZenTitle")}</p>
            <p className="text-sm text-on-surface-variant">{t("audio.backToZenDesc")}</p>
          </Link>
          <Link
            href="/dream"
            className="rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-3xl mb-3">📒</div>
            <p className="font-headline font-bold text-lg mb-1">{t("audio.afterTitle")}</p>
            <p className="text-sm text-on-surface-variant">{t("audio.afterDesc")}</p>
          </Link>
        </section>
      </main>
    </div>
  );
}
