"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Settings, User, Calendar, Heart, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const genderOptions = [
  { id: "boy", label: "Boy", emoji: "👦" },
  { id: "girl", label: "Girl", emoji: "👧" },
  { id: "other", label: "Other", emoji: "🌟" },
];

const hobbyOptions = [
  { id: "sports", label: "Sports", emoji: "⚽" },
  { id: "art", label: "Art", emoji: "🎨" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "gaming", label: "Gaming", emoji: "🎮" },
  { id: "reading", label: "Reading", emoji: "📚" },
  { id: "cooking", label: "Cooking", emoji: "🍳" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "dancing", label: "Dancing", emoji: "💃" },
];

function ProfileSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const heroId = searchParams.get("hero");
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [selectedHero, setSelectedHero] = useState(heroId ?? "puf");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadExistingProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !isMounted) {
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("name, age, gender, hobbies, selected_hero")
        .eq("id", user.id)
        .single();

      if (!profile || !isMounted) {
        return;
      }

      setName(profile.name ?? "");
      setAge(profile.age ? String(profile.age) : "");
      setGender(profile.gender ?? "");
      setHobbies(Array.isArray(profile.hobbies) ? profile.hobbies : []);
      setSelectedHero(heroId ?? profile.selected_hero ?? "puf");
    }

    loadExistingProfile();

    return () => {
      isMounted = false;
    };
  }, [heroId, supabase]);

  useEffect(() => {
    if (heroId) {
      setSelectedHero(heroId);
    }
  }, [heroId]);

  const toggleHobby = (id: string) => {
    setHobbies((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const isValid = name.trim().length > 0 && age.trim().length > 0 && gender !== "";

  const handleContinue = async () => {
    setIsSubmitting(true);
    
    // Get current logged-in user
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Save profile to Supabase
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: name.trim(),
        age: parseInt(age, 10),
        gender,
        hobbies,
        selected_hero: selectedHero,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error("Error saving profile:", error);
        // Fallback to home even on error for now
      }
    }

    router.push("/");
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
        <h1 className="font-headline font-bold text-xl tracking-tight text-primary">PROFILE</h1>
        <button className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm border border-outline active:scale-95 transition-transform">
          <Settings className="text-primary w-6 h-6" />
        </button>
      </header>

      <main className="pt-28 pb-10 px-6 max-w-lg mx-auto w-full flex flex-col items-center">
        {/* Headline */}
        <section className="text-center mb-10">
          <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-3">Tell Us About You</h2>
          <p className="text-on-surface-variant font-medium">Let&apos;s personalize your adventure!</p>
        </section>

        {/* Form */}
        <div className="w-full space-y-8">
          {/* Name Field */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/30 border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <User className="text-primary w-5 h-5" />
              </div>
              <label className="font-headline font-bold text-sm text-on-surface">Your Name</label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-5 py-4 bg-primary/5 rounded-2xl text-on-surface font-body text-base placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all border border-primary/10"
            />
          </div>

          {/* Age Field */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/30 border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Calendar className="text-primary w-5 h-5" />
              </div>
              <label className="font-headline font-bold text-sm text-on-surface">Your Age</label>
            </div>
            <input
              type="number"
              min="5"
              max="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="How old are you?"
              className="w-full px-5 py-4 bg-primary/5 rounded-2xl text-on-surface font-body text-base placeholder:text-on-surface-variant/40 outline-none focus:ring-2 focus:ring-primary/30 transition-all border border-primary/10"
            />
          </div>

          {/* Gender Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/30 border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Heart className="text-primary w-5 h-5" />
              </div>
              <label className="font-headline font-bold text-sm text-on-surface">Gender</label>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {genderOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setGender(option.id)}
                  className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    gender === option.id
                      ? "bg-primary/10 border-primary shadow-md shadow-primary/10"
                      : "bg-primary/5 border-transparent hover:border-primary/20"
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="font-headline font-bold text-xs text-on-surface">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hobbies Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-100/30 border border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="text-primary w-5 h-5" />
              </div>
              <label className="font-headline font-bold text-sm text-on-surface">Hobbies</label>
              <span className="ml-auto text-xs text-on-surface-variant font-body">(pick your favorites)</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {hobbyOptions.map((hobby) => {
                const isSelected = hobbies.includes(hobby.id);
                return (
                  <button
                    key={hobby.id}
                    onClick={() => toggleHobby(hobby.id)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all active:scale-95 ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-md shadow-primary/10"
                        : "bg-primary/5 border-transparent hover:border-primary/20"
                    }`}
                  >
                    <span className="text-xl">{hobby.emoji}</span>
                    <span className="font-headline font-bold text-xs text-on-surface">{hobby.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-10 w-full">
          <button
            disabled={!isValid || isSubmitting}
            onClick={handleContinue}
            className={`w-full py-5 font-headline font-bold text-lg rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
              isValid && !isSubmitting
                ? "bg-primary text-white shadow-primary/20 hover:bg-primary/90"
                : "bg-primary/30 text-white/60 cursor-not-allowed shadow-none"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Continue Adventure"
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ProfileSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh bg-gradient-to-br from-[#E0F2FE] to-[#F5F3FF] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProfileSetupContent />
    </Suspense>
  );
}
