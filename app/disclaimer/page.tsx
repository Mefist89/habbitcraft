import Link from "next/link";

const infoCards = [
  {
    title: "Parent Account",
    description: "A parent helps create or log into the account before the adventure continues.",
    icon: "family_restroom",
    colorBg: "bg-secondary/10",
    colorIcon: "text-secondary",
  },
  {
    title: "Saved Progress",
    description: "Your hero, XP, dreams, and rewards can be saved safely with parent approval.",
    icon: "shield_lock",
    colorBg: "bg-primary/10",
    colorIcon: "text-primary",
  },
  {
    title: "Guided Features",
    description: "Some parts of HabbitCraft use AI and parent-managed tools to support the journey.",
    icon: "auto_awesome",
    colorBg: "bg-tertiary/10",
    colorIcon: "text-tertiary",
  },
];

const trustItems = [
  "Safe for kids",
  "Parent login required",
  "No public posting",
];

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end">
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md border-b border-outline">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-xl">
              verified_user
            </span>
          </div>
          <h1 className="font-headline font-bold text-lg text-primary tracking-tight">
            Before You Continue
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

      <main className="flex-1 w-full max-w-md p-6 mb-24">
        <div className="text-center mb-10">
          <div className="mx-auto mb-5 w-24 h-24 rounded-[30px] bg-gradient-to-br from-primary to-primary-light shadow-floating border-4 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-5xl">
              lock
            </span>
          </div>
          <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-3">
            Ask a Parent to Continue
          </h2>
          <p className="font-body text-on-surface-variant px-4 leading-relaxed">
            Before you enter the next part of HabbitCraft, a parent needs to help with a safe sign-in step.
          </p>
        </div>

        <div className="space-y-4">
          {infoCards.map((card) => (
            <div
              key={card.title}
              className="bg-surface p-5 rounded-2xl shadow-soft border border-outline flex items-center gap-4 transition-all duration-300 hover:scale-[1.01]"
            >
              <div
                className={`w-14 h-14 ${card.colorBg} rounded-2xl flex items-center justify-center shrink-0`}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${card.colorIcon}`}
                >
                  {card.icon}
                </span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-base text-on-surface tracking-wide">
                  {card.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white/70 border border-outline px-4 py-4">
          <p className="font-headline text-xs font-bold uppercase tracking-[0.22em] text-primary/70 mb-3 text-center">
            Trust & Safety
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {trustItems.map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 space-y-3 px-4">
          <Link
            href="/parent-gate"
            className="block w-full py-4 bg-primary text-white font-headline font-bold text-lg rounded-full shadow-soft hover:bg-primary/90 transition-all active:scale-95 text-center"
          >
            CONTINUE WITH PARENT
          </Link>
          <Link
            href="/"
            className="block w-full py-3 bg-transparent text-on-surface-variant font-headline font-bold text-sm rounded-full hover:bg-black/5 transition-all text-center"
          >
            BACK TO HOME
          </Link>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 bg-white/90 backdrop-blur-md border-t border-outline px-6">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-on-surface-variant gap-1 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Home
          </span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center justify-center text-on-surface-variant gap-1 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            Settings
          </span>
        </Link>
        <Link
          href="/about"
          className="flex flex-col items-center justify-center text-on-surface-variant gap-1 transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined">info</span>
          <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
            About
          </span>
        </Link>
      </nav>
    </div>
  );
}
