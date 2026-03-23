"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getHeroAvatarSrc } from "@/lib/heroAssets";

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

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(dateString));

  return (
    <div className="min-h-dvh bg-surface font-body text-on-surface">
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

      <main className="mx-auto max-w-6xl space-y-8 px-6 pb-32 pt-24">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-primary">
            <span>{t("dream.todayBadge")}</span>
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface">
            {t("dream.heading")}
          </h1>
          <p className="font-medium text-on-surface-variant">{t("dream.subtitle")}</p>
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-3xl bg-surface-container-lowest p-6 shadow-[0_20px_40px_rgba(88,96,254,0.04)] ring-1 ring-outline-variant/10">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-headline text-lg font-bold text-on-surface">
                    {t("dream.inputTitle")}
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {t("dream.inputSubtitle")}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {dreamText.trim().length} {t("dream.charsLabel")}
                </span>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {promptKeys.map((promptKey) => (
                  <button
                    key={promptKey}
                    onClick={() => insertPrompt(promptKey)}
                    className="rounded-full bg-primary/8 px-3 py-2 text-left text-xs font-semibold text-primary transition-colors hover:bg-primary/14 active:scale-95"
                  >
                    {t(`dream.prompts.${promptKey}`)}
                  </button>
                ))}
              </div>

              <textarea
                value={dreamText}
                onChange={(event) => setDreamText(event.target.value)}
                suppressHydrationWarning
                className="min-h-[220px] w-full resize-none border-none bg-transparent p-0 text-lg leading-relaxed text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-0"
                placeholder={t("dream.placeholder")}
              />

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-surface-container-high/50 pt-4">
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

              <p className="mt-3 text-xs text-on-surface-variant">
                {isRecording
                  ? t("dream.recordingActive")
                  : isSpeechSupported
                    ? t("dream.recordingHint")
                    : t("dream.recordingUnsupported")}
              </p>
            </div>

            <div className="rounded-3xl bg-surface-container-low p-6">
              <h3 className="font-headline text-lg font-bold">{t("dream.moodTitle")}</h3>
              <div className="mt-4 grid grid-cols-5 gap-3">
                {moodLabels.map((mood, index) => (
                  <button
                    key={mood.key}
                    onClick={() => setSelectedMood(index)}
                    className={`flex min-h-24 flex-col items-center justify-center rounded-2xl bg-surface-container-lowest px-2 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 ${
                      selectedMood === index ? "ring-4 ring-primary-container" : ""
                    }`}
                  >
                    <span className="text-3xl">{mood.emoji}</span>
                    <span className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                      {mood.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                <p className="font-headline font-bold">{t("dream.errorTitle")}</p>
                <p className="mt-1">{errorMessage}</p>
              </div>
            ) : null}

            {saveMessage ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
                <p className="font-headline font-bold">{saveMessage}</p>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary-container to-secondary-container p-1">
              <div className="rounded-[calc(1.5rem-4px)] bg-surface-container-lowest p-6 shadow-inner">
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
                    <div className="whitespace-pre-line text-sm font-medium leading-7 text-on-surface">
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

            <div className="rounded-3xl border border-outline bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface">
                    {t("dream.historyTitle")}
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {t("dream.historySubtitle")}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {entries.length}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {entries.length > 0 ? (
                  entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl bg-surface px-4 py-4 ring-1 ring-outline/50"
                    >
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
                      <p className="mt-3 text-sm leading-6 text-on-surface">
                        {entry.dream_text}
                      </p>
                      <div className="mt-4 rounded-2xl bg-primary/5 px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
                          {t("dream.historyCardReply")}
                        </p>
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
            </div>
          </div>
        </section>

        <div className="py-4">
          <button
            onClick={analyzeDream}
            disabled={isLoading || dreamText.trim().length === 0}
            className="w-full cursor-pointer rounded-full bg-linear-to-r from-primary to-primary-container py-5 font-headline text-xl font-extrabold text-on-primary shadow-[0_20px_40px_rgba(88,96,254,0.3)] transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100"
          >
            {isLoading ? t("dream.analyzing") : t("dream.askButton")}
          </button>
        </div>
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
