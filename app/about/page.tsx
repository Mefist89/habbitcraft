import Link from "next/link";

const creators = [
  { name: "Pescu Maria", role: "Designer", emoji: "🚀" },
  { name: "Nistreanu Vica", role: "Developer", emoji: "💻" },
  { name: "Bortnic Eugeniu", role: "Developer", emoji: "⚡" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end">
      {/* Top App Bar */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md border-b border-outline">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-xl">
              info
            </span>
          </div>
          <h1 className="font-headline font-bold text-lg text-primary tracking-tight">
            About
          </h1>
        </div>
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            close
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md p-6 pb-10">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-10">
          {/* Mascot */}
          <div className="relative w-28 h-28 mb-5 floating-anim">
            <div className="absolute inset-0 bg-primary/10 puf-shape blur-xl" />
            <div className="w-28 h-28 bg-gradient-to-br from-primary to-primary-light puf-shape shadow-floating flex items-center justify-center border-4 border-white relative">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex gap-5">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
                {/* Happy smile */}
                <div className="w-6 h-3 border-b-2 border-white/60 rounded-b-full mt-0.5" />
              </div>
            </div>
          </div>

          <h2 className="font-headline font-bold text-3xl text-primary tracking-tight mb-1">
            HabbitCraft
          </h2>
          <p className="font-body text-on-surface-variant text-sm">
            Build Your Best Self
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
            <span className="font-body text-xs font-semibold text-primary">
              v1.0.0
            </span>
          </div>
        </div>

        {/* What is HabbitCraft */}
        <div className="bg-surface rounded-2xl shadow-soft border border-outline p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-tertiary/10 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-xl">
                rocket_launch
              </span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              What is HabbitCraft?
            </h3>
          </div>
          <p className="font-body text-sm text-on-surface-variant leading-relaxed">
            HabbitCraft is a magical quest where building healthy habits becomes
            an adventure! Track your daily goals, earn XP, level up your hero,
            and unlock new worlds — all while becoming the best version of
            yourself. 🌟
          </p>
        </div>

        {/* Features */}
        <div className="bg-surface rounded-2xl shadow-soft border border-outline p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-yellow-600 text-xl">
                stars
              </span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Features
            </h3>
          </div>
          <div className="space-y-3">
            {[
              { emoji: "🎯", text: "Track daily habits & goals" },
              { emoji: "⚡", text: "Earn XP and level up" },
              { emoji: "🏆", text: "Compete on the leaderboard" },
              { emoji: "🛍️", text: "Unlock rewards in the shop" },
              { emoji: "🌙", text: "Build healthy sleep routines" },
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-3">
                <span className="text-lg">{feature.emoji}</span>
                <p className="font-body text-sm text-on-surface-variant">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Creators */}
        <div className="bg-surface rounded-2xl shadow-soft border border-outline p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-pink-500 text-xl">
                group
              </span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Creators
            </h3>
          </div>
          <div className="space-y-3">
            {creators.map((creator) => (
              <div
                key={creator.name}
                className="flex items-center gap-4 bg-primary/5 rounded-xl px-4 py-3"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-sm">
                  {creator.emoji}
                </div>
                <div>
                  <p className="font-headline font-bold text-sm text-on-surface">
                    {creator.name}
                  </p>
                  <p className="font-body text-xs text-on-surface-variant">
                    {creator.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Made with love */}
        <div className="text-center mt-8">
          <p className="font-body text-sm text-on-surface-variant/60">
            Made with 💜 for young heroes everywhere
          </p>
          <p className="font-body text-[11px] text-on-surface-variant/40 mt-1">
            © 2026 HabbitCraft. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
