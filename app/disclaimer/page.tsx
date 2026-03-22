import Link from "next/link";

const rules = [
  {
    number: 1,
    title: "Be Kind",
    description: "Treat others with respect and a big smile!",
    icon: "favorite",
    colorBg: "bg-pink-100",
    colorIcon: "text-pink-500",
    colorTitle: "text-pink-600",
  },
  {
    number: 2,
    title: "Play Safely",
    description: "Watch your surroundings and stay in safe zones.",
    icon: "shield",
    colorBg: "bg-tertiary/10",
    colorIcon: "text-tertiary",
    colorTitle: "text-tertiary",
  },
  {
    number: 3,
    title: "Ask a Parent",
    description: "Let a grown-up know before you start a journey.",
    icon: "family_restroom",
    colorBg: "bg-secondary/10",
    colorIcon: "text-secondary",
    colorTitle: "text-secondary",
  },
  {
    number: 4,
    title: "Have Fun",
    description: "Most important! Enjoy every moment of it.",
    icon: "celebration",
    colorBg: "bg-yellow-100",
    colorIcon: "text-yellow-600",
    colorTitle: "text-yellow-700",
  },
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end">
      {/* Top App Bar */}
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md border-b border-outline">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-xl">
              gavel
            </span>
          </div>
          <h1 className="font-headline font-bold text-lg text-primary tracking-tight">
            Quest Rules
          </h1>
        </div>
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            arrow_back
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md p-6 mb-24">
        {/* Hero Header */}
        <div className="text-center mb-10">
          <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-3">
            Ready for your Quest?
          </h2>
          <p className="font-body text-on-surface-variant px-4">
            Follow these simple rules to become a legendary hero!
          </p>
        </div>

        {/* Rules Stack */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <div
              key={rule.number}
              className="bg-surface p-5 rounded-xl shadow-soft border border-outline flex items-center gap-5 group transition-all duration-300 hover:scale-[1.01]"
            >
              <div
                className={`w-14 h-14 ${rule.colorBg} rounded-full flex items-center justify-center shrink-0`}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${rule.colorIcon}`}
                >
                  {rule.icon}
                </span>
              </div>
              <div>
                <h3
                  className={`font-headline font-bold text-base ${rule.colorTitle} uppercase tracking-wide`}
                >
                  {rule.number}. {rule.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 space-y-3 px-4">
          <Link
            href="/parent-gate"
            className="block w-full py-4 bg-primary text-white font-headline font-bold text-lg rounded-full shadow-soft hover:bg-primary/90 transition-all active:scale-95 text-center"
          >
            ACCEPT
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-transparent text-on-surface-variant font-headline font-bold text-sm rounded-full hover:bg-black/5 transition-all text-center"
          >
            DECLINE
          </Link>
        </div>
      </main>

      {/* Bottom Nav Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 bg-white/90 backdrop-blur-md border-t border-outline px-6">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-on-surface-variant gap-1 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">map</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Map
          </span>
        </Link>
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-on-surface-variant gap-1 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Quests
          </span>
        </Link>
        <div className="flex flex-col items-center justify-center text-primary gap-1 relative">
          <div className="absolute -top-1 w-12 h-1 bg-primary rounded-full" />
          <span className="material-symbols-outlined">list_alt</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Rules
          </span>
        </div>
      </nav>
    </div>
  );
}
