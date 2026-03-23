"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";
import { getHeroAvatarSrc } from "@/lib/heroAssets";

const NOTIFICATIONS_KEY = "habbitcraft-notifications-enabled";
const SOUND_KEY = "habbitcraft-sound-enabled";

type Profile = {
  name?: string | null;
  age?: number | null;
  gender?: string | null;
  selected_hero?: string | null;
  level?: number | null;
  xp?: number | null;
};

interface SettingsItem {
  icon: string;
  label: string;
  description: string;
  toggle?: boolean;
  checked?: boolean;
  disabled?: boolean;
  value?: string;
  href?: string;
  onClick?: () => void;
}

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

export default function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
    const storedSound = localStorage.getItem(SOUND_KEY);

    if (storedNotifications !== null) {
      setNotificationsEnabled(storedNotifications === "true");
    }

    if (storedSound !== null) {
      setSoundEnabled(storedSound === "true");
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) {
          return;
        }

        setIsAuthenticated(Boolean(user));

        if (!user) {
          setProfile(null);
          setIsLoadingProfile(false);
          return;
        }

        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!isMounted) {
          return;
        }

        setProfile(data ?? null);
      } catch (error) {
        console.error("Failed to load settings profile:", error);
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const togglePreference = (
    key: string,
    value: boolean,
    setter: (next: boolean) => void,
  ) => {
    const nextValue = !value;
    setter(nextValue);
    localStorage.setItem(key, String(nextValue));
  };

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "ro" : "en");
  };

  const firstName = profile?.name?.split(" ")[0] || t("settings.profile.guestName");
  const level = profile?.level ?? 1;
  const xp = profile?.xp ?? 0;
  const avatarImageSrc = getHeroAvatarSrc(profile?.selected_hero);
  const ageValue =
    typeof profile?.age === "number"
      ? `${profile.age} ${language === "ro" ? "ani" : "years old"}`
      : t("settings.profile.ageUnknown");

  const settingsSections: SettingsSection[] = [
    {
      title: t("settings.profile.title"),
      items: [
        {
          icon: "person",
          label: t("settings.profile.edit"),
          description: t("settings.profile.editDesc"),
          href: isAuthenticated ? "/profile-setup" : "/login?next=/settings",
        },
        {
          icon: "cake",
          label: t("settings.profile.age"),
          description: ageValue,
          href: isAuthenticated ? "/profile-setup" : "/login?next=/settings",
        },
      ],
    },
    {
      title: t("settings.preferences.title"),
      items: [
        {
          icon: "language",
          label: t("settings.preferences.language"),
          description: t("settings.preferences.languageDesc"),
          value: t(`common.language_names.${language}`),
          onClick: handleLanguageToggle,
        },
        {
          icon: "notifications",
          label: t("settings.preferences.notifications"),
          description: t("settings.preferences.notificationsDesc"),
          toggle: true,
          checked: notificationsEnabled,
          onClick: () =>
            togglePreference(
              NOTIFICATIONS_KEY,
              notificationsEnabled,
              setNotificationsEnabled,
            ),
        },
        {
          icon: "volume_up",
          label: t("settings.preferences.sound"),
          description: t("settings.preferences.soundDesc"),
          toggle: true,
          checked: soundEnabled,
          onClick: () =>
            togglePreference(SOUND_KEY, soundEnabled, setSoundEnabled),
        },
        {
          icon: "palette",
          label: t("settings.preferences.theme"),
          description: t("settings.preferences.themeDesc"),
          href: "/choose-theme",
        },
      ],
    },
    {
      title: t("settings.support.title"),
      items: [
        {
          icon: "support_agent",
          label: t("settings.support.contact"),
          description: t("settings.support.contactDesc"),
          href: "/contact",
        },
        {
          icon: "monitoring",
          label: t("settings.support.parentDashboard"),
          description: t("settings.support.parentDashboardDesc"),
          href: isAuthenticated
            ? "/parent-dashboard"
            : "/login?next=/parent-dashboard",
        },
      ],
    },
    {
      title: t("settings.about.title"),
      items: [
        {
          icon: "info",
          label: t("settings.about.version"),
          description: "v1.0.0",
          value: "v1.0.0",
          disabled: true,
        },
        {
          icon: "description",
          label: t("settings.about.terms"),
          description: t("settings.about.comingSoon"),
          disabled: true,
        },
        {
          icon: "shield",
          label: t("settings.about.privacy"),
          description: t("settings.about.comingSoon"),
          disabled: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end">
      <header className="sticky top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/80 backdrop-blur-md border-b border-outline">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <span className="material-symbols-outlined text-primary text-xl">
              settings
            </span>
          </div>
          <h1 className="font-headline font-bold text-lg text-primary tracking-tight">
            {t("settings.title")}
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

      <main className="flex-1 w-full max-w-md p-6 pb-10">
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-white shadow-floating bg-primary/10">
            <Image
              src={avatarImageSrc}
              alt={firstName}
              fill
              className="object-contain p-2"
            />
            <button
              type="button"
              onClick={() =>
                router.push(
                  isAuthenticated ? "/profile-setup" : "/login?next=/settings",
                )
              }
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-soft"
            >
              <span className="material-symbols-outlined text-white text-sm">
                edit
              </span>
            </button>
          </div>
          <h2 className="font-headline font-bold text-xl text-on-surface">
            {firstName}
          </h2>
          <p className="font-body text-sm text-on-surface-variant">
            {isLoadingProfile
              ? t("settings.profile.loading")
              : isAuthenticated
                ? `${t("dashboard.level")} ${level} • ${xp} XP`
                : t("settings.profile.guestStatus")}
          </p>
        </div>

        <div className="space-y-8">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant/60 mb-3 px-1">
                {section.title}
              </h3>
              <div className="bg-surface rounded-2xl shadow-soft border border-outline overflow-hidden divide-y divide-outline">
                {section.items.map((item) => {
                  const isInteractive =
                    !item.disabled && Boolean(item.href || item.onClick || item.toggle);

                  return (
                    <div
                      key={item.label}
                      onClick={() => {
                        if (item.disabled) {
                          return;
                        }

                        if (item.href) {
                          router.push(item.href);
                          return;
                        }

                        item.onClick?.();
                      }}
                      className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                        isInteractive
                          ? "hover:bg-primary/5 cursor-pointer"
                          : "cursor-default"
                      } ${item.disabled ? "opacity-50" : ""}`}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-xl">
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline font-semibold text-sm text-on-surface">
                          {item.label}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant truncate">
                          {item.description}
                        </p>
                      </div>
                      {item.toggle ? (
                        <div
                          className={`w-11 h-6 rounded-full relative transition-colors ${
                            item.checked ? "bg-primary" : "bg-outline"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                              item.checked ? "left-[22px]" : "left-0.5"
                            }`}
                          />
                        </div>
                      ) : item.value ? (
                        <div className="flex items-center gap-2">
                          <span className="font-body text-sm text-primary font-bold">
                            {item.value}
                          </span>
                          {!item.disabled ? (
                            <span className="material-symbols-outlined text-on-surface-variant/40 text-xl">
                              chevron_right
                            </span>
                          ) : null}
                        </div>
                      ) : !item.disabled ? (
                        <span className="material-symbols-outlined text-on-surface-variant/40 text-xl">
                          chevron_right
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 px-4">
          {isAuthenticated ? (
            <form action="/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full py-3.5 bg-secondary/10 text-secondary font-headline font-bold text-sm rounded-full hover:bg-secondary/20 transition-all active:scale-95 cursor-pointer"
              >
                {t("settings.logout")}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login?next=/settings")}
              className="w-full py-3.5 bg-primary text-white font-headline font-bold text-sm rounded-full hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
            >
              {t("settings.login")}
            </button>
          )}
        </div>

        <p className="text-center font-body text-[11px] text-on-surface-variant/40 mt-6">
          {t("settings.footer")}
        </p>
      </main>
    </div>
  );
}
