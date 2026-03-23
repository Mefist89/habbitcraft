"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroAvatarSrc } from "@/lib/heroAssets";

interface Task {
  id: string;
  title: string;
  reward: string;
  type: 'training' | 'quest';
  completed: boolean;
  created_at: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
}

const weekDays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const weekActivity = [4, 6, 3, 7, 5, 8, 2]; // number of tasks completed per day

export default function ParentDashboardClient({ profile }: { profile: any }) {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskType, setNewTaskType] = useState<'training' | 'quest'>('training');
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardDesc, setNewRewardDesc] = useState("");
  const [newRewardCost, setNewRewardCost] = useState("50");
  const [newRewardIcon, setNewRewardIcon] = useState("🎁");
  const [loading, setLoading] = useState(false);

  const childName = profile?.name ? profile.name.split(" ")[0] : "Explorer";
  const avatarImageSrc = getHeroAvatarSrc(profile?.selected_hero);
  const level = profile?.level || 1;

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  }, []);

  const fetchRewards = useCallback(async () => {
    try {
      const res = await fetch("/api/rewards");
      if (res.ok) {
        const data = await res.json();
        setRewards(data);
      }
    } catch (err) {
      console.error("Failed to fetch rewards:", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchRewards();
  }, [fetchTasks, fetchRewards]);

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTaskTitle.trim(), reward: "+5 XP", type: newTaskType }),
      });
      if (res.ok) {
        setNewTaskTitle("");
        fetchTasks();
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
    setLoading(false);
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: !completed }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const addReward = async () => {
    if (!newRewardTitle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newRewardTitle.trim(),
          description: newRewardDesc.trim(),
          cost: parseInt(newRewardCost, 10) || 50,
          icon: newRewardIcon
        }),
      });
      if (res.ok) {
        setNewRewardTitle("");
        setNewRewardDesc("");
        // Keep cost and icon to allow fast repeated entries
        fetchRewards();
      }
    } catch (err) {
      console.error("Failed to add reward:", err);
    }
    setLoading(false);
  };

  const deleteReward = async (id: string) => {
    try {
      await fetch("/api/rewards", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchRewards();
    } catch (err) {
      console.error("Failed to delete reward:", err);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-dvh pb-12">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[5%] right-[-8%] w-80 h-80 bg-primary-container/8 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[30%] left-[-10%] w-72 h-72 bg-tertiary-container/8 blur-[80px] rounded-full"></div>
      </div>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-white/70 backdrop-blur-xl z-50 shadow-[0_20px_40px_rgba(88,96,254,0.08)]">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-[#5860fe] scale-95 hover:scale-105 active:scale-90 transition-transform flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
            <span className="material-symbols-outlined font-light">arrow_back</span>
          </Link>
          <h1 className="font-headline font-black tracking-tight text-xl text-[#5860fe]">HabbitCraft</h1>
        </div>
        <Link href="/settings" className="w-10 h-10 flex items-center justify-center text-primary active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-2xl">settings</span>
        </Link>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">{t('parentDashboard.heading')}</h1>
          <p className="text-on-surface-variant font-medium">{t('parentDashboard.subtitle')}</p>
        </header>

        {/* Child Overview Card */}
        <section className="relative overflow-hidden bg-linear-to-br from-primary to-primary-dim rounded-xl p-6 text-on-primary shadow-[0_20px_40px_rgba(60,67,228,0.2)]">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-white/30 shrink-0">
              <Image src={avatarImageSrc} alt={childName} width={80} height={80} className="object-contain" />
            </div>
            <div>
              <h2 className="font-headline font-extrabold text-2xl">{childName}</h2>
              <p className="opacity-80 text-sm font-medium">{t('parentDashboard.level')} {level}</p>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-tertiary-container/20 rounded-full blur-3xl"></div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-5 text-center shadow-sm border border-transparent hover:border-primary/10 transition-colors">
            <div className="text-3xl font-headline font-black text-primary">12</div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1">{t('parentDashboard.questsCompleted')}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 text-center shadow-sm border border-transparent hover:border-secondary/10 transition-colors">
            <div className="text-3xl font-headline font-black text-secondary">7</div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1">{t('parentDashboard.streakDays')}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 text-center shadow-sm border border-transparent hover:border-tertiary/10 transition-colors">
            <div className="text-3xl font-headline font-black text-tertiary">450</div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1">{t('parentDashboard.totalXP')}</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-5 text-center shadow-sm border border-transparent hover:border-primary/10 transition-colors">
            <div className="text-3xl font-headline font-black text-primary">{level}</div>
            <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mt-1">{t('parentDashboard.level')}</p>
          </div>
        </section>

        {/* ===== PARENT TO-DO SECTION ===== */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-5">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">checklist</span>
            {t('parentDashboard.parentTasks')}
          </h3>

          {/* Add Task Form */}
          <div className="space-y-3">
            <div className="flex bg-surface-container-low p-1 rounded-xl">
              <button
                onClick={() => setNewTaskType('training')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  newTaskType === 'training' 
                    ? 'bg-white shadow-sm text-secondary' 
                    : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                🏃‍♂️ {t('training.title') || 'Training'}
              </button>
              <button
                onClick={() => setNewTaskType('quest')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  newTaskType === 'quest' 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-on-surface-variant hover:bg-white/50'
                }`}
              >
                🛡️ {t('quest.title') || 'Quest'}
              </button>
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
                placeholder={t('parentDashboard.addTaskPlaceholder')}
                className="flex-1 px-4 py-3 rounded-xl bg-surface-container-low border border-transparent focus:border-primary/30 focus:ring-2 focus:ring-primary/10 outline-none text-sm font-medium transition-all"
              />
              <button
                onClick={addTask}
                disabled={loading || !newTaskTitle.trim()}
                className="px-5 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
              >
                {t('parentDashboard.addTask')}
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-center text-on-surface-variant text-sm py-4">{t('parentDashboard.noTasks')}</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    task.completed ? "bg-surface-container-low opacity-60" : "bg-surface-container-low"
                  }`}
                >
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      task.completed
                        ? "bg-primary border-primary text-white"
                        : "border-on-surface-variant/30 hover:border-primary"
                    }`}
                  >
                    {task.completed && (
                      <span className="material-symbols-outlined text-sm">check</span>
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${task.completed ? "line-through text-on-surface-variant" : ""}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        task.type === 'quest' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                      }`}>
                        {task.type === 'quest' ? '🛡️ Quest' : '🏃‍♂️ Training'}
                      </span>
                      <span className={`text-xs font-bold ${task.completed ? "text-primary/50" : "text-primary"}`}>
                        {task.reward}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-on-surface-variant/40 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              ))
            )}
          </div>

          <hr className="my-8 border-outline/20" />

          {/* Manage Rewards Section */}
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-lg">{t('shop.yourRewards') || 'Manage Rewards'}</h3>
            
            {/* Add Reward Form */}
            <div className="bg-surface-container-low p-4 rounded-xl space-y-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shrink-0 shadow-sm">
                  {newRewardIcon}
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={newRewardTitle}
                    onChange={(e) => setNewRewardTitle(e.target.value)}
                    placeholder={t('shop.rewardTitle') || 'Reward Title'}
                    className="w-full px-4 py-2 rounded-lg bg-surface-container-lowest border border-transparent focus:border-primary/30 outline-none text-sm font-medium transition-all"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newRewardDesc}
                      onChange={(e) => setNewRewardDesc(e.target.value)}
                      placeholder={t('shop.rewardDesc') || 'Description (Optional)'}
                      className="flex-1 px-4 py-2 rounded-lg bg-surface-container-lowest border border-transparent focus:border-primary/30 outline-none text-sm font-medium transition-all"
                    />
                    <div className="relative w-32 shrink-0">
                      <input
                        type="number"
                        value={newRewardCost}
                        onChange={(e) => setNewRewardCost(e.target.value)}
                        placeholder="Cost"
                        className="w-full pl-4 pr-10 py-2 rounded-lg bg-surface-container-lowest border border-transparent focus:border-primary/30 outline-none text-sm font-bold text-secondary transition-all"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-secondary/60">XP</span>
                    </div>
                  </div>
                  <button
                    onClick={addReward}
                    disabled={loading || !newRewardTitle.trim() || !newRewardCost}
                    className="w-full py-2 bg-secondary text-white rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    {t('shop.addReward') || 'Add Reward'}
                  </button>
                </div>
              </div>
            </div>

            {/* Rewards List */}
            <div className="space-y-3">
              {rewards.length === 0 ? (
                <p className="text-center text-on-surface-variant text-sm py-4">{t('shop.noRewards') || 'No rewards added yet.'}</p>
              ) : (
                rewards.map((reward) => (
                  <div key={reward.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface-container-low transition-all">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl shrink-0 shadow-sm">
                      {reward.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{reward.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                          {reward.cost} XP
                        </span>
                        {reward.description && (
                          <span className="text-xs text-on-surface-variant truncate max-w-[150px] inline-block align-bottom">
                            {reward.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteReward(reward.id)}
                      className="text-on-surface-variant/40 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Weekly Activity Chart */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-headline font-bold text-lg">{t('parentDashboard.weeklyActivity')}</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {weekDays.map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex justify-center">
                  <div
                    className="w-8 bg-linear-to-t from-primary to-primary-container rounded-lg transition-all hover:opacity-80"
                    style={{ height: `${(weekActivity[i] / 8) * 100}%`, minHeight: '8px' }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">{t(`parentDashboard.${day}`)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sleep Tracking */}
        <section className="bg-surface-container-low rounded-xl p-6 space-y-4">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <span className="text-xl">🌙</span>
            {t('parentDashboard.sleepTracking')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-lg p-4 text-center">
              <div className="text-2xl font-headline font-black text-tertiary">9h 15m</div>
              <p className="text-xs text-on-surface-variant font-medium mt-1">{t('parentDashboard.avgSleep')}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-lg p-4 text-center">
              <div className="text-2xl font-headline font-black text-secondary">{t('parentDashboard.sleepQualityValue')}</div>
              <p className="text-xs text-on-surface-variant font-medium mt-1">{t('parentDashboard.sleepQuality')}</p>
            </div>
          </div>
        </section>

        {/* Mood Overview */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-headline font-bold text-lg">{t('parentDashboard.moodOverview')}</h3>
          <div className="flex justify-around items-center py-2">
            <span className="text-4xl opacity-40">😊</span>
            <span className="text-5xl ring-4 ring-primary-container rounded-full p-1">😮</span>
            <span className="text-4xl opacity-40">😴</span>
            <span className="text-4xl opacity-40">🦄</span>
            <span className="text-4xl opacity-40">🛸</span>
          </div>
          <p className="text-sm text-on-surface-variant text-center">{t('parentDashboard.moodLabel')}: <span className="font-bold">😮 </span></p>
        </section>

        {/* Recent Dreams */}
        <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="font-headline font-bold text-lg flex items-center gap-2">
            <span className="text-xl">📒</span>
            {t('parentDashboard.recentDreams')}
          </h3>
          <div className="space-y-3">
            {["dream1", "dream2", "dream3"].map((key) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
                <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                <p className="text-sm font-medium">{t(`parentDashboard.${key}`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-4 pb-8">
          <Link href="/settings" className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col items-center gap-3 text-center hover:shadow-md transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-primary text-3xl">notifications</span>
            <span className="text-sm font-bold">{t('parentDashboard.notifications')}</span>
          </Link>
          <button className="bg-surface-container-lowest rounded-xl p-5 shadow-sm flex flex-col items-center gap-3 text-center hover:shadow-md transition-all active:scale-95 cursor-pointer">
            <span className="material-symbols-outlined text-secondary text-3xl">checklist</span>
            <span className="text-sm font-bold">{t('parentDashboard.manageHabits')}</span>
          </button>
          <button className="col-span-2 bg-linear-to-r from-primary to-primary-container text-on-primary rounded-xl p-5 shadow-lg flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-2xl">assessment</span>
            <span className="font-headline font-bold text-lg">{t('parentDashboard.viewReports')}</span>
          </button>
        </section>
      </main>
    </div>
  );
}
