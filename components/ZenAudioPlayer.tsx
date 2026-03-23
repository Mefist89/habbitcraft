"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type SceneId = "mindfulness" | "breathing" | "starfield";

type ActiveAudioSession = {
  id: SceneId;
  context: AudioContext;
  stop: () => void;
};

const AUDIO_SCENES: Array<{
  id: SceneId;
  icon: string;
  titleKey: string;
  descKey: string;
  hintKey: string;
  metaKey: string;
}> = [
  {
    id: "mindfulness",
    icon: "🧘‍♂️",
    titleKey: "zen.audio1Title",
    descKey: "zen.audio1Desc",
    hintKey: "zen.audio1Hint",
    metaKey: "zen.audio1Meta",
  },
  {
    id: "breathing",
    icon: "🌬️",
    titleKey: "zen.audio2Title",
    descKey: "zen.audio2Desc",
    hintKey: "zen.audio2Hint",
    metaKey: "zen.audio2Meta",
  },
  {
    id: "starfield",
    icon: "🌃",
    titleKey: "zen.audio3Title",
    descKey: "zen.audio3Desc",
    hintKey: "zen.audio3Hint",
    metaKey: "zen.audio3Meta",
  },
];

function triggerBell(
  context: AudioContext,
  destination: AudioNode,
  frequency: number,
  volume = 0.05,
  duration = 1.8,
  type: OscillatorType = "sine",
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration + 0.1);
}

function createMindfulnessScene(context: AudioContext) {
  const master = context.createGain();
  const drone = context.createOscillator();
  const shimmer = context.createOscillator();
  const droneGain = context.createGain();
  const shimmerGain = context.createGain();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  let sparkleTimer = 0;
  let stopped = false;

  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.linearRampToValueAtTime(0.05, context.currentTime + 1);
  master.connect(context.destination);

  drone.type = "sine";
  drone.frequency.value = 196;
  droneGain.gain.value = 0.45;
  drone.connect(droneGain);
  droneGain.connect(master);
  drone.start();

  shimmer.type = "triangle";
  shimmer.frequency.value = 293.66;
  shimmerGain.gain.value = 0.12;
  shimmer.connect(shimmerGain);
  shimmerGain.connect(master);
  shimmer.start();

  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain);
  lfoGain.connect(shimmerGain.gain);
  lfo.start();

  const scheduleSparkle = () => {
    if (stopped) {
      return;
    }
    triggerBell(context, master, 523.25, 0.04, 2.2, "triangle");
    sparkleTimer = window.setTimeout(scheduleSparkle, 5500);
  };

  sparkleTimer = window.setTimeout(scheduleSparkle, 1200);

  return () => {
    stopped = true;
    window.clearTimeout(sparkleTimer);
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(master.gain.value, context.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.5);
    drone.stop(context.currentTime + 0.6);
    shimmer.stop(context.currentTime + 0.6);
    lfo.stop(context.currentTime + 0.6);
  };
}

function createBreathingScene(
  context: AudioContext,
  onPhaseChange: (message: string) => void,
  translate: (key: string) => string,
) {
  const master = context.createGain();
  const pad = context.createOscillator();
  const padGain = context.createGain();
  let phaseTimer = 0;
  let stopped = false;

  const phases = [
    { key: "zen.breathing.inhale", duration: 4000, tone: 432 },
    { key: "zen.breathing.hold", duration: 2000, tone: 392 },
    { key: "zen.breathing.exhale", duration: 6000, tone: 256 },
  ];

  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.linearRampToValueAtTime(0.045, context.currentTime + 1);
  master.connect(context.destination);

  pad.type = "sine";
  pad.frequency.value = 174;
  padGain.gain.value = 0.35;
  pad.connect(padGain);
  padGain.connect(master);
  pad.start();

  const runPhase = (index: number) => {
    if (stopped) {
      return;
    }
    const phase = phases[index];
    onPhaseChange(translate(phase.key));
    triggerBell(context, master, phase.tone, 0.045, phase.duration / 1500, "sine");
    phaseTimer = window.setTimeout(() => {
      runPhase((index + 1) % phases.length);
    }, phase.duration);
  };

  runPhase(0);

  return () => {
    stopped = true;
    window.clearTimeout(phaseTimer);
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(master.gain.value, context.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.5);
    pad.stop(context.currentTime + 0.6);
  };
}

function createStarfieldScene(context: AudioContext) {
  const master = context.createGain();
  const droneOne = context.createOscillator();
  const droneTwo = context.createOscillator();
  const droneOneGain = context.createGain();
  const droneTwoGain = context.createGain();
  let sparkleTimer = 0;
  let stopped = false;
  const sparkleNotes = [392, 493.88, 587.33, 659.25, 783.99];

  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.linearRampToValueAtTime(0.05, context.currentTime + 1);
  master.connect(context.destination);

  droneOne.type = "triangle";
  droneOne.frequency.value = 261.63;
  droneOneGain.gain.value = 0.18;
  droneOne.connect(droneOneGain);
  droneOneGain.connect(master);
  droneOne.start();

  droneTwo.type = "sine";
  droneTwo.frequency.value = 329.63;
  droneTwoGain.gain.value = 0.09;
  droneTwo.connect(droneTwoGain);
  droneTwoGain.connect(master);
  droneTwo.start();

  const scheduleSparkle = () => {
    if (stopped) {
      return;
    }

    const note = sparkleNotes[Math.floor(Math.random() * sparkleNotes.length)];
    const type: OscillatorType = Math.random() > 0.5 ? "triangle" : "sine";
    triggerBell(context, master, note, 0.032, 2.6, type);

    sparkleTimer = window.setTimeout(
      scheduleSparkle,
      2400 + Math.floor(Math.random() * 2200),
    );
  };

  sparkleTimer = window.setTimeout(scheduleSparkle, 900);

  return () => {
    stopped = true;
    window.clearTimeout(sparkleTimer);
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setValueAtTime(master.gain.value, context.currentTime);
    master.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.5);
    droneOne.stop(context.currentTime + 0.6);
    droneTwo.stop(context.currentTime + 0.6);
  };
}

export default function ZenAudioPlayer({
  titleKey = "zen.healingAudios",
  subtitleKey = "zen.playerSubtitle",
}: {
  titleKey?: string;
  subtitleKey?: string;
}) {
  const { t } = useLanguage();
  const activeSessionRef = useRef<ActiveAudioSession | null>(null);

  const [activeSceneId, setActiveSceneId] = useState<SceneId | null>(null);
  const [playerMessage, setPlayerMessage] = useState("");
  const [audioError, setAudioError] = useState("");

  useEffect(() => {
    return () => {
      const activeSession = activeSessionRef.current;
      if (!activeSession) {
        return;
      }
      activeSession.stop();
      void activeSession.context.close();
      activeSessionRef.current = null;
    };
  }, []);

  const stopActiveScene = useCallback(async () => {
    const activeSession = activeSessionRef.current;
    if (!activeSession) {
      return;
    }

    activeSession.stop();
    try {
      await activeSession.context.close();
    } catch (err) {
      console.error("Failed to close audio context:", err);
    }

    activeSessionRef.current = null;
    setActiveSceneId(null);
    setPlayerMessage("");
  }, []);

  const toggleScene = useCallback(
    async (sceneId: SceneId) => {
      if (activeSessionRef.current?.id === sceneId) {
        await stopActiveScene();
        return;
      }

      await stopActiveScene();

      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

      if (!AudioContextClass) {
        setAudioError(t("zen.audioUnsupported"));
        return;
      }

      setAudioError("");

      try {
        const context = new AudioContextClass();
        await context.resume();

        let stopScene: () => void;

        if (sceneId === "mindfulness") {
          stopScene = createMindfulnessScene(context);
          setPlayerMessage(t("zen.audio1Hint"));
        } else if (sceneId === "breathing") {
          stopScene = createBreathingScene(context, setPlayerMessage, t);
          setPlayerMessage(t("zen.audio2Hint"));
        } else {
          stopScene = createStarfieldScene(context);
          setPlayerMessage(t("zen.audio3Hint"));
        }

        activeSessionRef.current = {
          id: sceneId,
          context,
          stop: stopScene,
        };
        setActiveSceneId(sceneId);
      } catch (err) {
        console.error("Failed to start audio scene:", err);
        setAudioError(t("zen.audioStartError"));
      }
    },
    [stopActiveScene, t],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h4 className="font-headline font-bold text-2xl">{t(titleKey)}</h4>
          <p className="text-sm text-on-surface-variant">{t(subtitleKey)}</p>
        </div>
        {activeSceneId && (
          <div className="rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">
            {t("zen.nowPlaying")}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {AUDIO_SCENES.map((scene) => {
          const isActive = activeSceneId === scene.id;

          return (
            <div
              key={scene.id}
              className={`rounded-[1.75rem] border p-5 shadow-sm transition-all ${
                isActive
                  ? "bg-primary/5 border-primary/20 shadow-[0_18px_36px_rgba(88,96,254,0.12)]"
                  : "bg-surface-container-lowest border-outline-variant/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-3xl">
                  {scene.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-headline font-bold text-on-surface">{t(scene.titleKey)}</p>
                  <p className="text-on-surface-variant text-sm">{t(scene.descKey)}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80 mt-2">
                    {t(scene.metaKey)}
                  </p>
                </div>
                <button
                  onClick={() => void toggleScene(scene.id)}
                  className={`shrink-0 rounded-full px-5 py-3 font-bold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg"
                      : "bg-primary-container text-on-primary-container hover:bg-primary hover:text-white"
                  }`}
                >
                  {isActive ? t("zen.pause") : t("zen.play")}
                </button>
              </div>

              <div className="mt-4 rounded-2xl bg-white/70 px-4 py-3 text-sm text-on-surface-variant">
                {isActive ? playerMessage || t(scene.hintKey) : t(scene.hintKey)}
              </div>
            </div>
          );
        })}
      </div>

      {audioError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {audioError}
        </div>
      )}
    </section>
  );
}
