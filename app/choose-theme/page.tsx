"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings, Check } from "lucide-react";
import Image from "next/image";

type Theme = {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  gradient: string;
  preview: string;
};

const themes: Theme[] = [
  {
    id: "modern",
    name: "Modern Edition",
    badge: "HabitCraft",
    badgeColor: "text-primary",
    description: "Smooth gradients and soft edges for a peaceful dream journey.",
    gradient: "from-primary/5 to-secondary/10",
    preview: "/assets/logo/logo.png",
  },
  {
    id: "minecraft",
    name: "Minecraft Edition",
    badge: "HabitCraft",
    badgeColor: "text-tertiary",
    description: "A blocky world and classic 8-bit charm for the ultimate quest.",
    gradient: "from-tertiary/5 to-primary/5",
    preview: "/assets/logo/logo2.png",
  },
];

export default function ChooseThemePage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState("minecraft");

  const handleContinue = () => {
    // Save theme preference later
    router.push("/settings");
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#E0F2FE] to-[#F5F3FF] font-body text-on-surface pb-10">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-20 bg-white/70 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-outline active:scale-95 transition-transform"
        >
          <ArrowLeft className="text-primary w-6 h-6" />
        </button>
        <h1 className="font-headline font-bold text-xl tracking-tight text-primary">CHOOSE THEME</h1>
        <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-outline active:scale-95 transition-transform">
          <Settings className="text-primary w-6 h-6" />
        </button>
      </header>

      <main className="pt-28 pb-10 px-6 max-w-lg mx-auto w-full flex flex-col items-center">
        {/* Headline */}
        <section className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-3">Choose Your Theme</h2>
          <p className="text-on-surface-variant font-medium">Select your dream world aesthetic</p>
        </section>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 gap-8 w-full">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                className={`group cursor-pointer relative bg-white rounded-3xl p-2 shadow-xl shadow-indigo-100/30 hover:scale-[1.02] transition-all duration-300 ${
                  isSelected ? "ring-4 ring-primary" : ""
                }`}
              >
                <div className={`bg-gradient-to-br ${theme.gradient} rounded-[2rem] p-6 h-full flex flex-col items-center border ${isSelected ? "border-primary/20" : "border-primary/10 group-hover:border-primary/30"} transition-colors`}>
                  {/* Preview */}
                  <div className="w-full aspect-video mb-6 rounded-2xl bg-white/50 backdrop-blur-sm flex items-center justify-center overflow-hidden shadow-inner py-4">
                    <div className="relative w-[430px] h-[430px] drop-shadow-lg">
                      <Image 
                        src={theme.preview}
                        alt={theme.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${theme.id === "modern" ? "bg-primary" : "bg-tertiary"}`}></div>
                    <span className={`font-headline font-bold ${theme.badgeColor} uppercase text-[10px] tracking-widest`}>{theme.badge}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-on-surface mb-2">{theme.name}</h3>
                  <p className="text-on-surface-variant text-center text-sm px-4 leading-relaxed">{theme.description}</p>
                </div>

                {/* Active Checkmark */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <Check className="text-white w-5 h-5" strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-14 w-full">
          <button
            onClick={handleContinue}
            className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-headline font-bold text-lg rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            Continue Adventure
          </button>
        </div>
      </main>
    </div>
  );
}
