"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ChevronLeft, ChevronRight, Swords, Zap, Wand2, Star, ArrowLeft, Settings } from "lucide-react";

type Hero = {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
  stats: {
    power: number;
    agility: number;
    magic: number;
    luck: number;
  };
};

const heroes: Hero[] = [
  {
    id: "puf",
    name: "Puf",
    role: "HEALER",
    description: "\"Gentle spirit with explosive restorative powers.\"",
    image: "/assets/characters/puf1.png",
    stats: { power: 40, agility: 60, magic: 100, luck: 80 }
  },
  {
    id: "bruno",
    name: "Bruno",
    role: "DETECTIVE",
    description: "\"Sniffs out clues and uncovers hidden secrets.\"",
    image: "/assets/characters/bruno1.png",
    stats: { power: 60, agility: 50, magic: 30, luck: 100 }
  },
  {
    id: "felix",
    name: "Felix",
    role: "ADVENTURER",
    description: "\"Daring explorer ready for any challenge.\"",
    image: "/assets/characters/felix1.png",
    stats: { power: 70, agility: 90, magic: 40, luck: 60 }
  },
  {
    id: "leo",
    name: "Leo",
    role: "NINJA",
    description: "\"Silent, swift, and completely unpredictable.\"",
    image: "/assets/characters/leo1.png",
    stats: { power: 85, agility: 95, magic: 20, luck: 50 }
  },
  {
    id: "luna",
    name: "Luna",
    role: "FAIRY",
    description: "\"Commands the stars and whispers to the moon.\"",
    image: "/assets/characters/luna1.png",
    stats: { power: 30, agility: 70, magic: 95, luck: 80 }
  },
  {
    id: "melisa",
    name: "Melisa",
    role: "MYSTIC",
    description: "\"Weaves ancient spells with fluttering grace.\"",
    image: "/assets/characters/melisa1.png",
    stats: { power: 40, agility: 80, magic: 85, luck: 90 }
  }
];

export default function SelectHeroPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const hero = heroes[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroes.length) % heroes.length);
  };

  const handleConfirm = () => {
    // Navigate to the hero intro video screen with the selected hero
    router.push(`/hero-intro?hero=${hero.id}`);
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-[#E0F2FE] to-[#F5F3FF] font-body text-on-surface pb-24 font-sans selection:bg-primary/20">
      
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-white/70 backdrop-blur-md">
        <button 
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-outline active:scale-95 transition-transform"
        >
          <ArrowLeft className="text-primary w-6 h-6" />
        </button>
        <h1 className="font-headline font-bold text-xl tracking-tight text-primary">SELECT HERO</h1>
        <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-outline active:scale-95 transition-transform">
          <Settings className="text-primary w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 px-6 max-w-lg mx-auto">
        {/* Hero Carousel Section */}
        <section className="relative flex flex-col items-center py-4">
          {/* Main Hero Card */}
          <div className="w-full bg-white rounded-[32px] p-4 shadow-xl shadow-indigo-100/50 border border-outline relative overflow-hidden">
            {/* Background Decorative Gradients */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
            
            <div className="relative aspect-square bg-slate-50 rounded-[24px] overflow-hidden flex items-center justify-center border border-slate-100/50">
              <div className="relative w-4/5 h-4/5 transform transition-transform duration-500 hover:scale-105">
                <Image 
                  src={hero.image}
                  alt={hero.name}
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full font-headline text-[10px] sm:text-xs font-bold tracking-widest text-primary shadow-sm border border-primary/10">
                {hero.role}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={handlePrev}
                className="absolute left-2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-outline shadow-sm flex items-center justify-center active:scale-90 transition-all text-on-surface hover:bg-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-outline shadow-sm flex items-center justify-center active:scale-90 transition-all text-on-surface hover:bg-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-6 text-center">
              <h2 className="font-headline text-3xl font-black text-primary tracking-tight">{hero.name}</h2>
              <p className="font-body text-sm text-on-surface-variant mt-1 px-4 leading-relaxed">{hero.description}</p>
            </div>
          </div>

          {/* Selection Indicators */}
          <div className="flex gap-2 mt-6">
            {heroes.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-slate-200 cursor-pointer hover:bg-slate-300'}`}
                onClick={() => setCurrentIndex(idx)}
              ></div>
            ))}
          </div>
        </section>

        {/* Attributes Grid */}
        <section className="mt-8 bg-white rounded-[32px] p-8 shadow-lg shadow-indigo-100/30 border border-outline">
          <h3 className="font-headline text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            Hero Attributes
          </h3>
          
          <div className="space-y-6">
            {/* Power */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Swords className="text-rose-500 w-5 h-5" />
                  <span className="font-headline text-xs font-bold text-slate-700">POWER</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{hero.stats.power}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out" style={{ width: `${hero.stats.power}%` }}></div>
              </div>
            </div>

            {/* Agility */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="text-amber-500 w-5 h-5" />
                  <span className="font-headline text-xs font-bold text-slate-700">AGILITY</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{hero.stats.agility}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out" style={{ width: `${hero.stats.agility}%` }}></div>
              </div>
            </div>

            {/* Magic */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="text-indigo-500 w-5 h-5" />
                  <span className="font-headline text-xs font-bold text-slate-700">MAGIC</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{hero.stats.magic}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out" style={{ width: `${hero.stats.magic}%` }}></div>
              </div>
            </div>

            {/* Luck */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 w-5 h-5" />
                  <span className="font-headline text-xs font-bold text-slate-700">LUCK</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">{hero.stats.luck}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700 ease-out" style={{ width: `${hero.stats.luck}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <div className="mt-10 mb-16">
          <button 
            onClick={handleConfirm}
            className="w-full py-6 bg-tertiary text-white font-headline font-bold mb-4 text-lg tracking-wider rounded-full shadow-lg shadow-green-200 active:scale-[0.98] active:bg-green-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-300 transition-all"
          >
            CONFIRM SELECTION
          </button>
        </div>
      </main>
    </div>
  );
}
