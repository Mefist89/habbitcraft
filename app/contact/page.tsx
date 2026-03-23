import Link from "next/link";

const creators = [
  { name: "Pescu Maria", role: "Designer", emoji: "🚀" },
  { name: "Nistreanu Vica", role: "Developer", emoji: "💻" },
  { name: "Bortnic Eugeniu", role: "Developer", emoji: "⚡" },
];

const supportCards = [
  {
    title: "Parent Help",
    description: "Need help with sign-in or saved progress? Ask a parent to continue from the parent gate.",
    href: "/parent-gate",
    icon: "family_restroom",
    color: "bg-secondary/10 text-secondary",
    action: "Open Parent Gate",
  },
  {
    title: "App Settings",
    description: "Change preferences, language, and profile details from your settings screen.",
    href: "/settings",
    icon: "settings",
    color: "bg-primary/10 text-primary",
    action: "Open Settings",
  },
  {
    title: "About HabbitCraft",
    description: "Read more about the app, features, and the people building it.",
    href: "/about",
    icon: "info",
    color: "bg-tertiary/10 text-tertiary",
    action: "Open About",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end">
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md border-b border-outline">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-xl">
              support_agent
            </span>
          </div>
          <h1 className="font-headline font-bold text-lg text-primary tracking-tight">
            Contact
          </h1>
        </div>
        <Link
          href="/home"
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            close
          </span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-md p-6 pb-10">
        <section className="text-center mb-10">
          <div className="mx-auto mb-5 w-24 h-24 rounded-[30px] bg-gradient-to-br from-primary to-primary-light shadow-floating border-4 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-5xl">
              forum
            </span>
          </div>
          <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight mb-3">
            Need a Hand?
          </h2>
          <p className="font-body text-on-surface-variant px-4 leading-relaxed">
            Use one of these quick paths to get help, reach the team, or find the right screen.
          </p>
        </section>

        <section className="space-y-4 mb-8">
          {supportCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="block bg-surface p-5 rounded-2xl shadow-soft border border-outline transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${card.color}`}>
                  <span className="material-symbols-outlined text-3xl">
                    {card.icon}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-headline font-bold text-base text-on-surface">
                    {card.title}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed mt-1">
                    {card.description}
                  </p>
                  <p className="font-headline text-xs font-bold uppercase tracking-[0.22em] text-primary mt-3">
                    {card.action}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="bg-surface rounded-2xl shadow-soft border border-outline p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-pink-500 text-xl">
                group
              </span>
            </div>
            <h3 className="font-headline font-bold text-base text-on-surface">
              Team
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
        </section>

        <section className="text-center mt-8">
          <p className="font-body text-sm text-on-surface-variant/70">
            If you need account help, it is best to continue with a parent.
          </p>
        </section>
      </main>
    </div>
  );
}
