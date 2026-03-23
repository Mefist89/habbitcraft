"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroAvatarSrc } from "@/lib/heroAssets";

interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
}

export default function ShopClient({ profile }: { profile: any }) {
  const { t } = useLanguage();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [currentXP, setCurrentXP] = useState(profile?.xp || 0);
  const [currentLevel, setCurrentLevel] = useState(profile?.level || 1);
  const [purchaseStatus, setPurchaseStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [purchaseError, setPurchaseError] = useState('');

  const avatarImageSrc = getHeroAvatarSrc(profile?.selected_hero);

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
    fetchXP();
    fetchRewards();
  }, [fetchXP, fetchRewards]);

  const buyReward = async (reward: Reward) => {
    if (currentXP < reward.cost) return;
    
    setPurchaseStatus('loading');
    setPurchaseError('');

    try {
      const res = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: reward.id, cost: reward.cost }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setCurrentXP(data.xp);
        setCurrentLevel(data.level);
        setPurchaseStatus('success');
        setTimeout(() => setPurchaseStatus('idle'), 2500);
      } else {
        setPurchaseStatus('error');
        setPurchaseError(data.error || 'Failed to buy reward');
        setTimeout(() => setPurchaseStatus('idle'), 3000);
      }
    } catch (err) {
      console.error("Failed to buy reward:", err);
      setPurchaseStatus('error');
      setPurchaseError('Failed to buy reward');
      setTimeout(() => setPurchaseStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-bg-start to-bg-end font-body text-on-surface pb-32">
      {/* Success Notification */}
      {purchaseStatus === 'success' && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl border-4 border-primary flex items-center gap-3 animate-bounce-up-fade">
            <span className="text-4xl">🎉</span>
            <div className="flex flex-col">
              <span className="font-headline font-black text-2xl text-primary">{t('shop.success')}</span>
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
          <h1 className="font-headline font-black tracking-tight text-xl text-[#5860fe]">{t('shop.title')}</h1>
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

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        {/* Wallet Section */}
        <section className="relative overflow-hidden p-8 rounded-xl bg-linear-to-br from-secondary to-tertiary text-on-primary shadow-lg text-center flex flex-col items-center">
          <span className="text-5xl mb-3">🪙</span>
          <h2 className="font-headline font-extrabold text-4xl mb-1">{currentXP} XP</h2>
          <p className="font-medium opacity-90">Level {currentLevel}</p>
        </section>

        {purchaseStatus === 'error' && (
          <div className="bg-error/10 text-error px-4 py-3 rounded-xl border border-error flex items-center gap-2 text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {purchaseError}
          </div>
        )}

        {/* Rewards List */}
        <div className="space-y-4">
          <h3 className="font-headline font-bold text-2xl">{t('shop.title')}</h3>
          <p className="text-on-surface-variant text-sm">{t('shop.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {rewards.length === 0 ? (
              <p className="text-on-surface-variant col-span-2">{t('shop.noRewards')}</p>
            ) : (
              rewards.map((reward) => (
                <div key={reward.id} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-transparent hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 bg-surface-container-highest rounded-2xl flex items-center justify-center text-3xl shrink-0">
                      {reward.icon}
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-black ${
                      currentXP >= reward.cost 
                        ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                        : 'bg-surface-container-high text-on-surface-variant opacity-60'
                    }`}>
                      {reward.cost} XP
                    </div>
                  </div>
                  <div className="grow">
                    <h4 className="font-headline font-bold text-lg mb-1 leading-tight">{reward.title}</h4>
                    {reward.description && (
                      <p className="text-sm text-on-surface-variant mb-4 opacity-80">{reward.description}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm(t('shop.confirmPurchase'))) {
                        buyReward(reward);
                      }
                    }}
                    disabled={currentXP < reward.cost || purchaseStatus === 'loading'}
                    className={`w-full py-3 mt-4 transition-all rounded-full font-bold text-sm cursor-pointer ${
                      currentXP < reward.cost 
                        ? 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed' 
                        : 'bg-primary text-white hover:opacity-90 active:scale-95 shadow-md shadow-primary/20'
                    }`}
                  >
                    {currentXP < reward.cost ? t('shop.notEnoughXp') : t('shop.buy')}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/70 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-4xl border-t border-outline/20">
        <Link href="/" className="flex flex-col items-center justify-center text-slate-400 px-6 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">home</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Home</span>
        </Link>
        <Link href="/quest" className="flex flex-col items-center justify-center text-slate-400 px-6 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">fort</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Quests</span>
        </Link>
        <Link href="/training" className="flex flex-col items-center justify-center text-slate-400 px-6 py-2 hover:bg-slate-100 rounded-full transition-all group">
          <span className="material-symbols-outlined group-hover:text-primary transition-colors">fitness_center</span>
          <span className="font-body font-medium text-[10px] group-hover:text-primary">Training</span>
        </Link>
        <Link href="/shop" className="flex flex-col items-center justify-center bg-secondary/10 text-secondary rounded-full px-6 py-2 scale-110 transition-all border border-transparent shadow-sm">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
          <span className="font-body font-medium text-[10px]">Shop</span>
        </Link>
      </nav>
    </div>
  );
}
