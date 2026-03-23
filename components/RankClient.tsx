"use client";

import Image from "next/image";
import Link from "next/link";
import { getHeroAvatarSrc } from "@/lib/heroAssets";

type LeaderboardEntry = {
  id: string;
  name: string | null;
  xp: number | null;
  level: number | null;
  selected_hero: string | null;
};

type RankClientProps = {
  leaderboard: LeaderboardEntry[];
  currentUserId: string | null;
};

const podiumAccents = [
  "from-yellow-300 to-amber-400",
  "from-slate-200 to-slate-300",
  "from-orange-200 to-amber-300",
];

function getDisplayName(name: string | null) {
  return name?.trim() || "Young Hero";
}

export default function RankClient({
  leaderboard,
  currentUserId,
}: RankClientProps) {
  const topThree = leaderboard.slice(0, 3);
  const remainingHeroes = leaderboard.slice(3);
  const currentRank = leaderboard.findIndex((entry) => entry.id === currentUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-start via-white to-bg-end">
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-outline bg-white/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <span className="material-symbols-outlined text-xl text-primary">
              leaderboard
            </span>
          </div>
          <h1 className="font-headline text-lg font-bold tracking-tight text-primary">
            Rank
          </h1>
        </div>
        <Link
          href="/home"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-black/5"
        >
          <span className="material-symbols-outlined text-on-surface-variant">
            close
          </span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-col px-6 py-6 pb-12">
        <section className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-[28px] bg-gradient-to-br from-yellow-300 to-amber-400 shadow-soft">
            <span className="material-symbols-outlined text-[42px] text-white">
              emoji_events
            </span>
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
            Hero Leaderboard
          </h2>
          <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
            See who is climbing fastest and earning the most XP this season.
          </p>
        </section>

        {currentRank >= 0 ? (
          <section className="mb-6 rounded-3xl border border-primary/10 bg-white/80 p-5 shadow-soft">
            <p className="font-body text-xs font-bold uppercase tracking-[0.24em] text-primary/70">
              Your Position
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="font-headline text-3xl font-black text-primary">
                  #{currentRank + 1}
                </p>
                <p className="font-body text-sm text-on-surface-variant">
                  Keep going. You are on the board.
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-4 py-2 font-headline text-sm font-bold text-primary">
                Ranked
              </span>
            </div>
          </section>
        ) : null}

        {leaderboard.length > 0 ? (
          <>
            <section className="mb-8 grid grid-cols-3 items-end gap-3">
              {topThree.map((entry, index) => {
                const isFirst = index === 0;
                const rank = index + 1;

                return (
                  <div
                    key={entry.id}
                    className={`flex flex-col items-center rounded-[28px] border border-white/70 bg-white/90 px-3 py-4 text-center shadow-soft ${
                      isFirst ? "pb-6 pt-5" : "pb-4 pt-4"
                    }`}
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-black text-white ${podiumAccents[index]}`}
                    >
                      {rank}
                    </div>
                    <div className="mb-3 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-primary/5">
                      <Image
                        src={getHeroAvatarSrc(entry.selected_hero)}
                        alt={getDisplayName(entry.name)}
                        width={64}
                        height={64}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <p className="line-clamp-2 min-h-[2.5rem] font-headline text-sm font-bold text-on-surface">
                      {getDisplayName(entry.name)}
                    </p>
                    <p className="mt-1 font-body text-xs text-on-surface-variant">
                      Level {entry.level ?? 1}
                    </p>
                    <div className="mt-3 rounded-full bg-primary/10 px-3 py-1 font-body text-xs font-bold text-primary">
                      {entry.xp ?? 0} XP
                    </div>
                  </div>
                );
              })}
            </section>

            <section className="rounded-3xl border border-outline bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-outline px-5 py-4">
                <h3 className="font-headline text-base font-bold text-on-surface">
                  Full Ranking
                </h3>
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant/60">
                  Top {leaderboard.length}
                </span>
              </div>
              <div className="divide-y divide-outline">
                {remainingHeroes.map((entry, index) => {
                  const rank = index + 4;
                  const isCurrentUser = entry.id === currentUserId;

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 px-5 py-4 ${
                        isCurrentUser ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="w-8 text-center font-headline text-lg font-black text-on-surface-variant/60">
                        {rank}
                      </div>
                      <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-primary/5 shadow-sm">
                        <Image
                          src={getHeroAvatarSrc(entry.selected_hero)}
                          alt={getDisplayName(entry.name)}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-headline text-sm font-bold text-on-surface">
                          {getDisplayName(entry.name)}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant">
                          Level {entry.level ?? 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-headline text-sm font-bold text-primary">
                          {entry.xp ?? 0} XP
                        </p>
                        {isCurrentUser ? (
                          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/70">
                            You
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <section className="rounded-3xl border border-dashed border-outline bg-white/70 px-6 py-10 text-center shadow-soft">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-primary">
                groups
              </span>
            </div>
            <h3 className="font-headline text-xl font-bold text-on-surface">
              No ranks yet
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-on-surface-variant">
              Create a hero and start earning XP. The leaderboard will appear here.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
