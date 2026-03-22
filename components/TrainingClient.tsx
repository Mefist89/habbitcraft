"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface ParentTask {
  id: string;
  title: string;
  reward: string;
  type: string;
  completed: boolean;
}

const challenges = [
  { emoji: "💧", titleKey: "training.challenge1Title", descKey: "training.challenge1Desc", rewardKey: "training.challenge1Reward" },
  { emoji: "📖", titleKey: "training.challenge2Title", descKey: "training.challenge2Desc", rewardKey: "training.challenge2Reward" },
  { emoji: "🏃", titleKey: "training.challenge3Title", descKey: "training.challenge3Desc", rewardKey: "training.challenge3Reward" },
];

const stats = [
  { key: "training.power", value: 72, color: "bg-error" },
  { key: "training.agility", value: 58, color: "bg-tertiary" },
  { key: "training.wisdom", value: 85, color: "bg-primary" },
  { key: "training.luck", value: 40, color: "bg-secondary" },
];

export default function TrainingClient({ profile }: { profile: any }) {
  const { t } = useLanguage();
  const [parentTasks, setParentTasks] = useState<ParentTask[]>([]);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [currentXP, setCurrentXP] = useState(profile?.xp || 0);
  const [currentLevel, setCurrentLevel] = useState(profile?.level || 1);

  const avatarImageSrc = profile?.selected_hero
    ? `/assets/circle-characters/${profile.selected_hero}-c.png`
    : `/assets/circle-characters/puf-c.png`;

  const fetchParentTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setParentTasks(data.filter((t: ParentTask) => !t.completed && (!t.type || t.type === 'training')));
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

  const addXP = async (amount: number) => {
    try {
      const res = await fetch("/api/xp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpAmount: amount }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentXP(data.xp);
        setCurrentLevel(data.level);
        setXpGained(amount);
        setTimeout(() => setXpGained(null), 2500);
      }
    } catch (err) {
      console.error("Failed to add XP:", err);
    }
  };

  const completeTask = async (id: string) => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: true }),
      });
      await addXP(15);
      fetchParentTasks();
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  const completeChallenge = async () => {
    await addXP(10);
  };

  const xpProgress = (currentXP % 50) * 2; // Every 50 XP is one level, so multiply by 2 for percentage

  return (
    <div className="bg-surface font-body text-on-surface min-h-dvh relative">
      {/* XP Notification Overlay */}
      {xpGained !== null && (
        <div className="fixed inset-0 z-100 flex items-center justify-center pointer-events-none animate-in fade-in duration-300">
          <div className="bg-primary text-white px-8 py-6 rounded-3xl shadow-floating flex flex-col items-center gap-2 animate-bounce">
            <span className="text-5xl">⭐</span>
            <span className="font-headline font-black text-3xl">+{xpGained} XP</span>
            <span className="font-bold text-primary-container">Level {currentLevel}</span>
          </div>
        </div>
      )}

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[-8%] w-80 h-80 bg-secondary-container/15 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[25%] right-[-5%] w-64 h-64 bg-tertiary-container/10 blur-[80px] rounded-full"></div>
      </div>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl z-50 shadow-[0_20px_40px_rgba(88,96,254,0.08)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#5860fe] scale-95 hover:scale-105 active:scale-90 transition-transform flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <span className="material-symbols-outlined font-light">arrow_back</span>
          </Link>
          <h1 className="font-headline font-black tracking-tight text-xl text-[#5860fe]">HabbitCraft</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
          <Image src={avatarImageSrc} alt="Avatar" width={40} height={40} className="object-contain" />
        </div>
      </header>

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden p-8 rounded-xl bg-linear-to-br from-secondary to-secondary-dim text-on-secondary shadow-[0_20px_40px_rgba(92,75,180,0.2)]">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-headline font-bold uppercase tracking-wider text-xs opacity-90">{t('training.badge')}</span>
            </div>
            <h2 className="font-headline font-extrabold text-3xl mb-4 leading-tight">{t('training.heading')}</h2>
            <p className="font-body text-lg mb-6 opacity-90">{t('training.description')}</p>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-tertiary-container/20 rounded-full blur-3xl"></div>
        </section>

        {/* Daily Streak */}
        <section className="bg-surface-container-low rounded-xl p-6 text-center border-2 border-transparent hover:border-secondary-container transition-colors">
          <div className="inline-flex items-center justify-center gap-4 mb-2">
            <span className="text-3xl">🔥</span>
            <h3 className="font-headline font-bold text-xl">{t('training.dailyStreak')}</h3>
          </div>
          <div className="text-5xl font-headline font-black text-secondary tracking-tighter mb-2">7</div>
          <p className="text-sm font-medium text-on-surface-variant">{t('training.days')}</p>
        </section>

        {/* Today's Challenges */}
        <div className="space-y-6">
          <h3 className="font-headline font-bold text-2xl px-2">{t('training.todayChallenges')}</h3>
          <div className="space-y-4">
            {challenges.map((c, i) => (
              <div key={i} className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-transparent hover:shadow-md transition-all flex items-center gap-5">
                <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center text-3xl shrink-0">
                  {c.emoji}
                </div>
                <div className="grow">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-headline font-bold text-lg">{t(c.titleKey)}</h4>
                    <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">{t(c.rewardKey)}</div>
                  </div>
                  <p className="text-sm text-on-surface-variant mb-3">{t(c.descKey)}</p>
                  <button onClick={completeChallenge} className="w-full py-3 bg-surface-container-high hover:bg-secondary hover:text-white transition-all rounded-full font-bold text-sm cursor-pointer active:scale-95">
                    {t('training.completeChallenge')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Parent-Assigned Tasks */}
        {parentTasks.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-2xl px-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">family_restroom</span>
              {t('parentDashboard.parentTasks')}
            </h3>
            <div className="space-y-4">
              {parentTasks.map((task) => (
                <div key={task.id} className="group bg-surface-container-lowest p-6 rounded-xl shadow-sm border-2 border-primary/10 hover:shadow-md transition-all flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    ⭐
                  </div>
                  <div className="grow">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-headline font-bold text-lg">{task.title}</h4>
                      <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold">{task.reward}</div>
                    </div>
                    <button
                      onClick={() => completeTask(task.id)}
                      className="w-full py-3 bg-primary text-on-primary hover:opacity-90 transition-all rounded-full font-bold text-sm cursor-pointer active:scale-95 mt-2"
                    >
                      ✅ {t('training.completeChallenge')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Stats */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-xl">{t('training.heroStats')}</h3>
            <span className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">Level {currentLevel}</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm font-bold">
              <span>Experience (XP)</span>
              <span>{currentXP} XP</span>
            </div>
            <div className="h-4 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
              <div className="h-full bg-linear-to-r from-primary to-tertiary rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(xpProgress, 100)}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white mix-blend-difference">{xpProgress}% to next level</div>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(88,96,254,0.08)] rounded-t-[2rem]">
        <Link href="/" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary">home</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-primary">Home</span>
        </Link>
        <Link href="/quest" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary">fort</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-primary">Quests</span>
        </Link>
        <Link href="/training" className="flex flex-col items-center justify-center bg-[#ded8ff] text-[#5860fe] rounded-full px-5 py-2 scale-110 transition-all active:scale-90">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1">Training</span>
        </Link>
        <Link href="/zen" className="flex flex-col items-center justify-center text-slate-400 px-4 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary">dark_mode</span>
          <span className="font-body text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-primary">Sleep</span>
        </Link>
      </nav>
    </div>
  );
}
