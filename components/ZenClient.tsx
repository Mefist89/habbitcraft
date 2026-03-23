"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroImageSrc } from "@/lib/heroAssets";
import ZenAudioPlayer from "@/components/ZenAudioPlayer";

type ZenMood = "restless" | "okay" | "calm";

const ZEN_STORAGE_KEY = "zen-zone-state:v1";
const MAX_ZEN_SCORE = 100;

const MOOD_OPTIONS: Array<{
  id: ZenMood;
  emoji: string;
  labelKey: string;
  tipKey: string;
}> = [
  {
    id: "restless",
    emoji: "🌪️",
    labelKey: "zen.moods.restless",
    tipKey: "zen.moodTips.restless",
  },
  {
    id: "okay",
    emoji: "☁️",
    labelKey: "zen.moods.okay",
    tipKey: "zen.moodTips.okay",
  },
  {
    id: "calm",
    emoji: "🌙",
    labelKey: "zen.moods.calm",
    tipKey: "zen.moodTips.calm",
  },
];

const QUICK_ACTIONS = [
  {
    href: "/audio",
    icon: "🎧",
    titleKey: "zen.actions.audio.title",
    descKey: "zen.actions.audio.desc",
  },
  {
    href: "/dream",
    icon: "📒",
    titleKey: "zen.actions.journal.title",
    descKey: "zen.actions.journal.desc",
  },
  {
    href: "/training",
    icon: "🤸",
    titleKey: "zen.actions.stretch.title",
    descKey: "zen.actions.stretch.desc",
  },
  {
    href: "/",
    icon: "🏠",
    titleKey: "zen.actions.home.title",
    descKey: "zen.actions.home.desc",
  },
];

function clampZenScore(score: number) {
  return Math.max(0, Math.min(MAX_ZEN_SCORE, score));
}

export default function ZenClient({ profile }: { profile: any }) {
  const { t } = useLanguage();
  const heroImageSrc = getHeroImageSrc(profile?.selected_hero);

  const [zenScore, setZenScore] = useState(45);
  const [selectedMood, setSelectedMood] = useState<ZenMood>("okay");
  const [loadedState, setLoadedState] = useState(false);

  useEffect(() => {
    try {
      const savedState = window.localStorage.getItem(ZEN_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState) as {
          zenScore?: number;
          selectedMood?: ZenMood;
        };

        if (typeof parsed.zenScore === "number") {
          setZenScore(clampZenScore(parsed.zenScore));
        }

        if (
          parsed.selectedMood === "restless" ||
          parsed.selectedMood === "okay" ||
          parsed.selectedMood === "calm"
        ) {
          setSelectedMood(parsed.selectedMood);
        }
      }
    } catch (err) {
      console.error("Failed to load zen state:", err);
    } finally {
      setLoadedState(true);
    }
  }, []);

  useEffect(() => {
    if (!loadedState) {
      return;
    }

    window.localStorage.setItem(
      ZEN_STORAGE_KEY,
      JSON.stringify({ zenScore, selectedMood }),
    );
  }, [loadedState, selectedMood, zenScore]);

  const markCalmer = () => {
    const nextValue =
      selectedMood === "restless"
        ? zenScore + 15
        : selectedMood === "okay"
          ? zenScore + 10
          : zenScore + 6;

    setZenScore(clampZenScore(nextValue));
  };

  const zenTierKey =
    zenScore >= 75
      ? "zen.meterStates.high"
      : zenScore >= 40
        ? "zen.meterStates.mid"
        : "zen.meterStates.low";

  const selectedMoodTip =
    MOOD_OPTIONS.find((option) => option.id === selectedMood)?.tipKey ?? "zen.moodTips.okay";

  return (
    <div className="bg-surface font-body text-on-surface min-h-[100dvh] pb-32">
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

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-tertiary-container/30 text-tertiary font-label font-bold text-xs rounded-full uppercase tracking-wider">
            <span>{t("zen.quietTime")}</span>
          </div>
          <h2 className="font-headline font-extrabold text-4xl leading-tight text-on-surface">
            {t("zen.heading")}
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed max-w-[95%]">
            {t("zen.description")}
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden p-6 rounded-[2rem] bg-linear-to-br from-primary to-primary-dim text-white shadow-[0_20px_40px_rgba(88,96,254,0.15)]">
            <div className="relative z-10 space-y-5">
              <div className="space-y-2">
                <p className="font-headline font-black text-sm uppercase tracking-[0.24em] text-white/80">
                  {t("zen.checkInEyebrow")}
                </p>
                <h3 className="font-headline font-bold text-2xl tracking-tight">
                  {t("zen.checkInTitle")}
                </h3>
                <p className="text-white/85">
                  {t("zen.checkInDesc")}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {MOOD_OPTIONS.map((option) => {
                  const active = selectedMood === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedMood(option.id)}
                      className={`rounded-2xl px-3 py-4 text-center transition-all border ${
                        active
                          ? "bg-white text-primary border-white shadow-lg scale-[1.02]"
                          : "bg-white/10 text-white border-white/15 hover:bg-white/15"
                      }`}
                    >
                      <div className="text-2xl mb-2">{option.emoji}</div>
                      <div className="font-bold text-sm leading-tight">{t(option.labelKey)}</div>
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-white/85 leading-relaxed">
                {t(selectedMoodTip)}
              </p>
            </div>
            <div className="absolute -top-12 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-12 left-0 w-32 h-32 bg-secondary-container/20 rounded-full blur-2xl" />
          </div>

          <div className="p-6 rounded-[2rem] bg-surface-container-low shadow-[0_14px_30px_rgba(88,96,254,0.08)] space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-headline font-bold text-xl">{t("zen.currentLevel")}</p>
                <p className="text-sm text-on-surface-variant">{t(zenTierKey)}</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-tertiary-container/30 flex items-center justify-center text-2xl">
                😴
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span>{t("zen.meterLabel")}</span>
                <span>{zenScore}%</span>
              </div>
              <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-secondary to-tertiary-container rounded-full transition-all duration-700"
                  style={{ width: `${zenScore}%` }}
                />
              </div>
              <p className="text-sm text-on-surface-variant">
                {t("zen.levelDesc")}
              </p>
            </div>

            <button
              onClick={markCalmer}
              className="w-full rounded-full bg-linear-to-r from-primary to-primary-light text-white font-headline font-bold px-5 py-4 shadow-[0_12px_30px_rgba(60,67,228,0.22)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              {t("zen.recenterButton")}
            </button>
          </div>
        </section>

        <ZenAudioPlayer />

        <section className="space-y-4">
          <h4 className="font-headline font-bold text-2xl">{t("zen.relaxActivities")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="rounded-[1.5rem] bg-surface-container-lowest px-5 py-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="text-3xl mb-3">{action.icon}</div>
                <p className="font-headline font-bold text-sm mb-1">{t(action.titleKey)}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{t(action.descKey)}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

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
