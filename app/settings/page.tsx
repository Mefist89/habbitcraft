"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SettingsItem {
  icon: string;
  label: string;
  description: string;
  toggle?: boolean;
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

  const handleLanguageToggle = () => {
    setLanguage(language === "en" ? "ro" : "en");
  };

  const settingsSections: SettingsSection[] = [
    {
      title: t("settings.profile.title"),
      items: [
        { icon: "person", label: t("settings.profile.edit"), description: t("settings.profile.editDesc") },
        { icon: "cake", label: t("settings.profile.age"), description: t("settings.profile.ageDesc") },
      ],
    },
    {
      title: t("settings.preferences.title"),
      items: [
        { 
          icon: "language", 
          label: t("settings.preferences.language"), 
          description: t("settings.preferences.languageDesc"), 
          value: t("common.language_names." + language),
          onClick: handleLanguageToggle
        },
        { icon: "notifications", label: t("settings.preferences.notifications"), description: t("settings.preferences.notificationsDesc"), toggle: true },
        { icon: "volume_up", label: t("settings.preferences.sound"), description: t("settings.preferences.soundDesc"), toggle: true },
        { icon: "palette", label: t("settings.preferences.theme"), description: t("settings.preferences.themeDesc"), href: "/choose-theme" },
      ],
    },
    {
      title: t("settings.about.title"),
      items: [
        { icon: "info", label: t("settings.about.version"), description: "v1.0.0" },
        { icon: "description", label: t("settings.about.terms"), description: t("settings.about.termsDesc") },
        { icon: "shield", label: t("settings.about.privacy"), description: t("settings.about.privacyDesc") },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-bg-start to-bg-end">
      {/* Top App Bar */}
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

      {/* Main Content */}
      <main className="flex-1 w-full max-w-md p-6 pb-10">
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative w-24 h-24 mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-light puf-shape shadow-floating flex items-center justify-center border-4 border-white">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-4">
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                </div>
                <div className="w-5 h-0.5 bg-white/40 rounded-full mt-1" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-soft">
              <span className="material-symbols-outlined text-white text-sm">
                edit
              </span>
            </div>
          </div>
          <h2 className="font-headline font-bold text-xl text-on-surface">
            Young Hero
          </h2>
          <p className="font-body text-sm text-on-surface-variant">
            Level 1 • 0 XP
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          {settingsSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant/60 mb-3 px-1">
                {section.title}
              </h3>
              <div className="bg-surface rounded-2xl shadow-soft border border-outline overflow-hidden divide-y divide-outline">
                {section.items.map((item) => (
                  <div
                    key={item.label}
                    onClick={item.href ? () => router.push(item.href!) : item.onClick}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                      item.disabled
                        ? "opacity-40"
                        : "hover:bg-primary/5 cursor-pointer"
                    }`}
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
                          item.disabled ? "bg-outline" : "bg-primary"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                            item.disabled ? "left-0.5" : "left-[22px]"
                          }`}
                        />
                      </div>
                    ) : item.value ? (
                      <div className="flex items-center gap-2">
                        <span className="font-body text-sm text-primary font-bold">{item.value}</span>
                        <span className="material-symbols-outlined text-on-surface-variant/40 text-xl">
                          chevron_right
                        </span>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant/40 text-xl">
                        chevron_right
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-10 px-4">
          <form action="/auth/logout" method="POST">
            <button type="submit" className="w-full py-3.5 bg-secondary/10 text-secondary font-headline font-bold text-sm rounded-full hover:bg-secondary/20 transition-all active:scale-95 cursor-pointer">
              {t("settings.logout")}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center font-body text-[11px] text-on-surface-variant/40 mt-6">
          {t("settings.footer")}
        </p>
      </main>
    </div>
  );
}
