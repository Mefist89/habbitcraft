"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroAvatarSrc } from "@/lib/heroAssets";
import PrimaryPillButton from "@/components/ui/PrimaryPillButton";

type DreamEntry = {
  id: string;
  dream_text: string;
  mood: string;
  ai_response: string;
  created_at: string;
};

type DreamClientProps = {
  profile: any;
  initialEntries: DreamEntry[];
};

type SpeechRecognitionResultItem = {
  transcript: string;
};

type SpeechRecognitionResultGroup = {
  0: SpeechRecognitionResultItem;
  length: number;
};

type SpeechRecognitionEventLike = Event & {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultGroup>;
};

type SpeechRecognitionLike = EventTarget & {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: Event & { error?: string }) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const moodOptions = [
  { emoji: "😊", key: "happy" },
  { emoji: "😮", key: "surprised" },
  { emoji: "😴", key: "sleepy" },
  { emoji: "🦄", key: "magical" },
  { emoji: "🛸", key: "weird" },
] as const;

const promptKeys = ["flying", "animal", "door"] as const;

export default function DreamClient({
  profile,
  initialEntries,
}: DreamClientProps) {
  const { t, language } = useLanguage();
  const [selectedMood, setSelectedMood] = useState(0);
  const [dreamText, setDreamText] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [entries, setEntries] = useState(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);

  const avatarImageSrc = getHeroAvatarSrc(profile?.selected_hero);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const dictationPrefixRef = useRef("");
  const locale = language === "ro" ? "ro-RO" : "en-US";

  const moodLabels = useMemo(
    () =>
      moodOptions.map((mood) => ({
        ...mood,
        label: t(`dream.moods.${mood.key}`),
      })),
    [t],
  );

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    setIsSpeechSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language === "ro" ? "ro-RO" : "en-US";
    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }

      const prefix = dictationPrefixRef.current.trim();
      const spokenText = transcript.trim();
      setDreamText(
        [prefix, spokenText].filter(Boolean).join(prefix && spokenText ? " " : ""),
      );
    };
    recognition.onerror = () => {
      setIsRecording(false);
      setErrorMessage(t("dream.recordingError"));
    };
    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [language, t]);

  useEffect(() => {
    if (!saveMessage) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setSaveMessage(""), 2400);
    return () => window.clearTimeout(timeout);
  }, [saveMessage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setErrorMessage(t("dream.recordingUnsupported"));
      return;
    }

    setErrorMessage("");

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    dictationPrefixRef.current = dreamText.trim();
    recognitionRef.current.lang = language === "ro" ? "ro-RO" : "en-US";
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const analyzeDream = async () => {
    if (!dreamText.trim()) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSaveMessage("");

    try {
      const response = await fetch("/api/dream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dream: dreamText.trim(),
          mood: moodLabels[selectedMood]?.label ?? moodLabels[0].label,
          lang: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || t("dream.errorDefault"));
        return;
      }

      if (data.analysis) {
        setAiResponse(data.analysis);
        if (data.entry) {
          setEntries((current) => [data.entry, ...current].slice(0, 8));
        }
        setDreamText("");
        setSaveMessage(t("dream.savedMessage"));
      }
    } catch (error) {
      console.error("Error analyzing dream:", error);
      setErrorMessage(t("dream.errorDefault"));
    } finally {
      setIsLoading(false);
    }
  };

  const insertPrompt = (promptKey: (typeof promptKeys)[number]) => {
    setDreamText(t(`dream.prompts.${promptKey}`));
    setErrorMessage("");
  };

  const deleteEntry = async (entryId: string) => {
    if (!window.confirm(t("dream.deleteConfirm"))) {
      return;
    }

    setDeletingEntryId(entryId);
    setErrorMessage("");
    setSaveMessage("");

    try {
      const response = await fetch("/api/dream", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: entryId,
          lang: language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || t("dream.deleteError"));
        return;
      }

      setEntries((current) => current.filter((entry) => entry.id !== entryId));
      setSaveMessage(t("dream.deletedMessage"));
    } catch (error) {
      console.error("Error deleting dream:", error);
      setErrorMessage(t("dream.deleteError"));
    } finally {
      setDeletingEntryId(null);
    }
  };

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString));

  return (
    <div className="min-h-dvh bg-gradient-to-br from-bg-start to-bg-end font-body text-on-surface">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-10%] top-[10%] h-96 w-96 rounded-full bg-primary-container/10 blur-[100px]" />
        <div className="absolute bottom-[18%] left-[-5%] h-72 w-72 rounded-full bg-tertiary-container/10 blur-[80px]" />
      </div>

      <nav className="fixed top-0 z-50 flex w-full items-center justify-between bg-white/70 px-6 py-4 shadow-[0_20px_40px_rgba(88,96,254,0.08)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20">
            <Image
              src={avatarImageSrc}
              alt="Avatar"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="font-headline text-2xl font-black tracking-tight text-transparent bg-linear-to-br from-[#5860fe] to-[#8688ff] bg-clip-text">
            HabbitCraft
          </span>
        </div>
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center text-primary transition-transform duration-200 active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">settings</span>
        </Link>
      </nav>

      <main className="mx-auto max-w-3xl space-y-6 px-6 pb-32 pt-24">
        <header className="relative overflow-hidden rounded-[2rem] bg-linear-to-br from-primary to-primary-container px-6 py-7 text-white shadow-[0_20px_40px_rgba(88,96,254,0.18)]">
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-white/70 bg-white/20">
              <Image
                src={avatarImageSrc}
                alt="Avatar"
                width={80}
                height={80}
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-white">
                <span>{t("dream.todayBadge")}</span>
              </div>
              <h1 className="font-headline text-4xl font-extrabold tracking-tight">
                {t("dream.heading")}
              </h1>
              <p className="max-w-xl text-white/85">
                {t("dream.subtitle")}
              </p>
            </div>
          </div>
          <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-tertiary-container/20 blur-3xl" />
        </header>

        <section className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(88,96,254,0.04)] ring-1 ring-outline-variant/10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-headline text-lg font-black text-primary">
              1
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">{t("dream.stepMoodTitle")}</h2>
              <p className="text-sm text-on-surface-variant">{t("dream.stepMoodDesc")}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {moodLabels.map((mood, index) => (
              <button
                key={mood.key}
                onClick={() => setSelectedMood(index)}
                className={`flex min-h-24 flex-col items-center justify-center rounded-2xl bg-surface px-3 py-4 text-center shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 ${
                  selectedMood === index ? "ring-4 ring-primary-container bg-primary/5" : ""
                }`}
              >
                <span className="text-3xl">{mood.emoji}</span>
                <span className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(88,96,254,0.04)] ring-1 ring-outline-variant/10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-headline text-lg font-black text-primary">
              2
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">{t("dream.stepTellTitle")}</h2>
              <p className="text-sm text-on-surface-variant">{t("dream.stepTellDesc")}</p>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {promptKeys.map((promptKey) => (
              <button
                key={promptKey}
                onClick={() => insertPrompt(promptKey)}
                className="rounded-full bg-primary/8 px-4 py-2 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary/14 active:scale-95"
              >
                {t(`dream.prompts.${promptKey}`)}
              </button>
            ))}
          </div>

          <div className="rounded-[1.5rem] bg-surface p-4 ring-1 ring-outline/10">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-headline text-lg font-bold text-on-surface">{t("dream.inputTitle")}</p>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {dreamText.trim().length} {t("dream.charsLabel")}
              </span>
            </div>

            <textarea
              value={dreamText}
              onChange={(event) => setDreamText(event.target.value)}
              suppressHydrationWarning
              className="min-h-[200px] w-full resize-none border-none bg-transparent p-0 text-lg leading-relaxed text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-0"
              placeholder={t("dream.placeholder")}
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-surface-container-high/50 pt-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-outline-variant">
                  {t("dream.detailsLabel")}
                </span>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {t("dream.autoSaveHint")}
                </p>
              </div>
              <button
                onClick={toggleRecording}
                disabled={!isSpeechSupported && !isRecording}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                  isRecording
                    ? "bg-secondary text-white shadow-lg shadow-secondary/20"
                    : "bg-primary/10 text-primary hover:bg-primary/15"
                } ${!isSpeechSupported && !isRecording ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <span className="material-symbols-outlined text-lg">
                  {isRecording ? "stop_circle" : "mic"}
                </span>
                {isRecording ? t("dream.recordStop") : t("dream.recordStart")}
              </button>
            </div>
          </div>

          <p className="mt-3 text-sm text-on-surface-variant">
            {isRecording
              ? t("dream.recordingActive")
              : isSpeechSupported
                ? t("dream.recordingHint")
                : t("dream.recordingUnsupported")}
          </p>
        </section>

        <section className="rounded-[2rem] bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(88,96,254,0.04)] ring-1 ring-outline-variant/10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-headline text-lg font-black text-primary">
              3
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-on-surface">{t("dream.stepMagicTitle")}</h2>
              <p className="text-sm text-on-surface-variant">{t("dream.stepMagicDesc")}</p>
            </div>
          </div>

          <PrimaryPillButton
            onClick={analyzeDream}
            disabled={isLoading || dreamText.trim().length === 0}
            className="mb-5 w-full text-xl disabled:scale-100"
            icon={
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            }
          >
            {isLoading ? t("dream.analyzing") : t("dream.askButton")}
          </PrimaryPillButton>

          {errorMessage ? (
            <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <p className="font-headline font-bold">{t("dream.errorTitle")}</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          ) : null}

          {saveMessage ? (
            <div className="mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              <p className="font-headline font-bold">{saveMessage}</p>
            </div>
          ) : null}

          <div className="relative overflow-hidden rounded-[1.75rem] bg-linear-to-br from-primary-container to-secondary-container p-1">
            <div className="rounded-[calc(1.75rem-4px)] bg-surface-container-lowest p-5 shadow-inner">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-on-primary ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isLoading ? "hourglass_empty" : "auto_awesome"}
                  </span>
                </div>
                <div className="min-w-0 space-y-2">
                  <p className="font-label text-sm font-bold uppercase tracking-wider text-primary">
                    {t("dream.dreamGuideLabel")}
                  </p>
                  <div className="whitespace-pre-line text-base font-medium leading-7 text-on-surface">
                    {isLoading ? (
                      <div className="flex items-center gap-1">
                        <span className="animate-bounce">✨</span>
                        <span className="animate-bounce [animation-delay:0.2s]">✨</span>
                        <span className="animate-bounce [animation-delay:0.4s]">✨</span>
                      </div>
                    ) : (
                      aiResponse || t("dream.responsePlaceholder")
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-tertiary-container/30 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-primary-container/30 blur-3xl" />
          </div>
        </section>

        <section className="rounded-[2rem] border border-outline bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-headline text-lg font-black text-primary">
                4
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-on-surface">{t("dream.stepJournalTitle")}</h2>
                <p className="text-sm text-on-surface-variant">{t("dream.stepJournalDesc")}</p>
              </div>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {entries.length}
            </span>
          </div>

          <div className="space-y-4">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <article
                  key={entry.id}
                  className="rounded-2xl bg-surface px-4 py-4 ring-1 ring-outline/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{entry.mood}</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/70">
                          {t("dream.historyCardDream")}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {formatDate(entry.created_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => void deleteEntry(entry.id)}
                      disabled={deletingEntryId === entry.id}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={t("dream.deleteEntry")}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {deletingEntryId === entry.id ? "hourglass_empty" : "delete"}
                      </span>
                    </button>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-on-surface">
                    {entry.dream_text}
                  </p>
                  <div className="mt-4 rounded-2xl bg-primary/5 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
                        {t("dream.historyCardReply")}
                      </p>
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        {deletingEntryId === entry.id ? t("dream.deleting") : t("dream.dreamGuideLabel")}
                      </span>
                    </div>
                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-on-surface">
                      {entry.ai_response}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-outline px-4 py-8 text-center">
                <p className="font-headline text-lg font-bold text-on-surface">
                  {t("dream.historyEmpty")}
                </p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {t("dream.historyEmptyHint")}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-[2rem] bg-white/70 px-4 pb-6 pt-2 shadow-[0_-10px_40px_rgba(88,96,254,0.1)] backdrop-blur-xl">
        <Link
          href="/"
          className="group flex flex-col items-center justify-center rounded-full px-4 py-2 text-slate-400 transition-all hover:bg-slate-100 active:scale-90"
        >
          <span className="material-symbols-outlined group-hover:text-primary">home</span>
          <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">
            Home
          </span>
        </Link>
        <Link
          href="/quest"
          className="group flex flex-col items-center justify-center rounded-full px-3 py-2 text-slate-400 transition-all hover:bg-slate-100 active:scale-90"
        >
          <span className="material-symbols-outlined group-hover:text-primary">fort</span>
          <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">
            Quests
          </span>
        </Link>
        <Link
          href="/training"
          className="group flex flex-col items-center justify-center rounded-full px-3 py-2 text-slate-400 transition-all hover:bg-slate-100 active:scale-90"
        >
          <span className="material-symbols-outlined group-hover:text-primary">fitness_center</span>
          <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">
            Training
          </span>
        </Link>
        <Link
          href="/zen"
          className="group flex flex-col items-center justify-center rounded-full px-3 py-2 text-slate-400 transition-all hover:bg-slate-100 active:scale-90"
        >
          <span className="material-symbols-outlined group-hover:text-primary">dark_mode</span>
          <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">
            Sleep
          </span>
        </Link>
        <Link
          href="/dream"
          className="flex scale-110 flex-col items-center justify-center rounded-full bg-[#ded8ff] px-5 py-2 text-[#5860fe] transition-all active:scale-90"
        >
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="mt-1 font-body text-[10px] font-bold uppercase tracking-widest">
            Journal
          </span>
        </Link>
      </nav>
    </div>
  );
}
