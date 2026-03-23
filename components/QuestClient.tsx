"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroAvatarSrc, getHeroImageSrc } from "@/lib/heroAssets";

interface ParentTask {
  id: string;
  title: string;
  reward: string;
  type: string;
  completed: boolean;
}

interface DailyQuest {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  reward: number;
}

const DAILY_QUESTS: DailyQuest[] = [
  {
    id: "curiosity",
    icon: "🔍",
    titleKey: "quest.dailyTasks.curiosity.title",
    descKey: "quest.dailyTasks.curiosity.desc",
    reward: 10,
  },
  {
    id: "logical-game",
    icon: "🧩",
    titleKey: "quest.dailyTasks.logicalGame.title",
    descKey: "quest.dailyTasks.logicalGame.desc",
    reward: 15,
  },
  {
    id: "memory-game",
    icon: "🧠",
    titleKey: "quest.dailyTasks.memoryGame.title",
    descKey: "quest.dailyTasks.memoryGame.desc",
    reward: 15,
  },
];

function getDailyQuestStorageKey() {
  const today = new Date().toISOString().slice(0, 10);
  return `daily-quests:${today}`;
}

export default function QuestClient({ profile }: { profile: any }) {
  const { t } = useLanguage();
  const [parentTasks, setParentTasks] = useState<ParentTask[]>([]);
  const [completedDailyQuestIds, setCompletedDailyQuestIds] = useState<string[]>([]);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [currentXP, setCurrentXP] = useState(profile?.xp || 0);
  const [currentLevel, setCurrentLevel] = useState(profile?.level || 1);

  const heroImageSrc = getHeroImageSrc(profile?.selected_hero);
  const avatarImageSrc = getHeroAvatarSrc(profile?.selected_hero);

  const fetchParentTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setParentTasks(data.filter((t: ParentTask) => !t.completed && t.type === 'quest'));
      }
    } catch (err) {
      console.error("Failed to fetch parent tasks:", err);
    }
  }, []);

  useEffect(() => {
    fetchParentTasks();
  }, [fetchParentTasks]);

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

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(getDailyQuestStorageKey());
      if (saved) {
        setCompletedDailyQuestIds(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load daily quests:", err);
    }
  }, []);

  const completeDailyQuest = async (quest: DailyQuest) => {
    if (completedDailyQuestIds.includes(quest.id)) {
      return;
    }

    try {
      const xpRes = await fetch("/api/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpAmount: quest.reward }),
      });

      if (!xpRes.ok) {
        return;
      }

      const xpData = await xpRes.json();
      const updatedCompletedIds = [...completedDailyQuestIds, quest.id];

      setCompletedDailyQuestIds(updatedCompletedIds);
      window.localStorage.setItem(
        getDailyQuestStorageKey(),
        JSON.stringify(updatedCompletedIds),
      );
      setXpGained(quest.reward);
      setCurrentXP(xpData.xp);
      setCurrentLevel(xpData.level);
      setTimeout(() => setXpGained(null), 2500);
    } catch (err) {
      console.error("Failed to complete daily quest:", err);
    }
  };

  const completeTask = async (id: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: true }),
      });
      if (res.ok) {
        fetchParentTasks();
        const xpRes = await fetch("/api/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ xpAmount: 15 }),
        });
        if (xpRes.ok) {
          const xpData = await xpRes.json();
          setXpGained(15);
          setCurrentXP(xpData.xp);
          setCurrentLevel(xpData.level);
          setTimeout(() => setXpGained(null), 2500);
        }
      }
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-bg-start to-bg-end font-body text-on-surface pb-32">
      {/* Floating XP Notification */}
      {xpGained !== null && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl border-4 border-primary flex items-center gap-3 animate-bounce-up-fade">
            <span className="text-4xl">⭐</span>
            <div className="flex flex-col">
              <span className="font-headline font-black text-2xl text-primary">+{xpGained} XP</span>
              <span className="font-headline font-bold text-sm text-tertiary">Quest Completed!</span>
            </div>
          </div>
        </div>
      )}

      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl z-50 shadow-[0_20px_40px_rgba(88,96,254,0.08)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#5860fe] scale-95 hover:scale-105 active:scale-90 transition-transform flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <span className="material-symbols-outlined font-light">arrow_back</span>
          </Link>
          <h1 className="font-headline font-black tracking-tight text-xl text-[#5860fe]">HabbitCraft</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-white shadow-sm relative flex items-center justify-center">
          <Image
            src={avatarImageSrc}
            alt="Hero Profile"
            fill
            className="object-contain"
          />
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-10">
        {/* Hero Section: Shield Recharging */}
        <section className="relative overflow-hidden p-8 rounded-xl bg-linear-to-br from-primary to-primary-dim text-on-primary shadow-[0_20px_40px_rgba(60,67,228,0.2)]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-headline font-bold uppercase tracking-wider text-xs opacity-90">{t('quest.dailyDefense')}</span>
            </div>
            <h2 className="font-headline font-extrabold text-3xl mb-4 leading-tight">{t('quest.heading')}</h2>
            <p className="font-body text-lg mb-6 opacity-90">Level {currentLevel} • {currentXP} XP</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>XP to next level</span>
                <span>{(currentXP % 50) * 2}%</span>
              </div>
              <div className="h-4 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed rounded-full shadow-[0_0_15px_rgba(250,140,210,0.5)] transition-all duration-1000" style={{ width: `${(currentXP % 50) * 2}%` }}></div>
              </div>
            </div>
          </div>
          {/* Decorative "Nebula" element */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-tertiary-container/30 rounded-full blur-3xl"></div>
        </section>

        {/* Daily Quests */}
        <div className="space-y-6">
          <h3 className="font-headline font-bold text-2xl px-2">{t('quest.activeQuests')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAILY_QUESTS.map((quest) => {
              const completed = completedDailyQuestIds.includes(quest.id);

              return (
                <div key={quest.id} className="group bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-transparent hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-surface-container-highest rounded-full text-2xl flex items-center justify-center">
                      {quest.icon}
                    </div>
                    <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                      +{quest.reward} XP
                    </div>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg mb-1">{t(quest.titleKey)}</h4>
                    <p className="text-sm text-on-surface-variant mb-4">{t(quest.descKey)}</p>
                    <button
                      onClick={() => completeDailyQuest(quest)}
                      disabled={completed}
                      className={`w-full py-3 rounded-full font-bold text-sm transition-all active:scale-95 ${
                        completed
                          ? "bg-emerald-100 text-emerald-700 cursor-default"
                          : "bg-surface-container-high hover:bg-primary hover:text-white cursor-pointer"
                      }`}
                    >
                      {completed ? t("quest.completed") : t("quest.completeQuest")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parent Quests */}
        <div className="space-y-6">
          <h3 className="font-headline font-bold text-2xl px-2">{t("quest.parentQuests")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parentTasks.length === 0 ? (
              <p className="text-on-surface-variant col-span-2 px-2">{t("quest.parentQuestsEmpty")}</p>
            ) : (
              parentTasks.map((task, i) => (
                <div key={task.id} className={`${i % 3 === 2 ? 'md:col-span-2 flex-row items-center gap-6' : 'flex-col justify-between'} group bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-transparent hover:shadow-md transition-all flex`}>
                  <div className={`flex justify-between items-start mb-4 ${i % 3 === 2 ? 'w-20 h-20 bg-surface-container-highest rounded-lg flex-shrink-0 mb-0' : ''}`}>
                    <div className={`${i % 3 === 2 ? 'text-4xl' : 'w-12 h-12 bg-surface-container-highest rounded-full text-2xl'} flex items-center justify-center`}>
                      🛡️
                    </div>
                    {i % 3 !== 2 && (
                      <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                        {task.reward}
                      </div>
                    )}
                  </div>
                  <div className={i % 3 === 2 ? 'flex-grow' : ''}>
                    <div className={`flex ${i % 3 === 2 ? 'justify-between items-center mb-1' : 'flex-col'}`}>
                      <h4 className={`font-headline font-bold ${i % 3 === 2 ? 'text-xl' : 'text-lg mb-1'}`}>{task.title}</h4>
                      {i % 3 === 2 && (
                        <div className="bg-tertiary-container text-on-tertiary-container px-4 py-1 rounded-full text-sm font-bold">
                          {task.reward}
                        </div>
                      )}
                    </div>
                    <p className={`text-sm text-on-surface-variant mb-4 ${i % 3 === 2 ? '' : 'line-clamp-2'}`}>{t('quest.acceptQuest')} and prove your worth!</p>
                    <button 
                      onClick={() => completeTask(task.id)}
                      className={`w-full py-3 ${i % 3 === 2 ? 'bg-linear-to-r from-primary to-primary-container text-white shadow-lg py-4' : 'bg-surface-container-high hover:bg-primary hover:text-white'} transition-all rounded-full font-bold text-sm cursor-pointer active:scale-95`}
                    >
                      {t("quest.completeQuest")}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Asymmetric Hint Section */}
        <div className="relative bg-secondary-container/30 p-8 rounded-xl border-l-8 border-secondary-dim rotate-1 translate-x-1 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="text-4xl">💡</span>
            <div>
              <h5 className="font-headline font-bold text-secondary-dim mb-1">{t('quest.proTipTitle')}</h5>
              <p className="text-on-secondary-container text-sm leading-relaxed">{t('quest.proTipDesc')}</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 text-4xl opacity-40">✨</div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(88,96,254,0.08)] rounded-t-[2rem]">
        <Link href="/" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">home</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Home</span>
        </Link>
        <Link href="/quest" className="flex flex-col items-center justify-center bg-[#ded8ff] text-[#5860fe] rounded-full px-4 py-2 scale-110 transition-all border border-transparent shadow-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fort</span>
          <span className="font-body font-medium text-[10px]">Quests</span>
        </Link>
        <Link href="/training" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">fitness_center</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Training</span>
        </Link>
        <Link href="/zen" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">dark_mode</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Sleep</span>
        </Link>
        <Link href="/dream" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">auto_stories</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Journal</span>
        </Link>
      </nav>
    </div>
  );
}
