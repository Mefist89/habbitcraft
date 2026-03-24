"use client";

import Link from "next/link";
import { ReactNode } from "react";

type PrimaryPillButtonProps = {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  size?: "md" | "lg";
  href?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

function getButtonClasses(size: "md" | "lg", disabled?: boolean, className?: string) {
  const baseClasses = [
    "inline-flex items-center justify-center gap-3",
    "rounded-[999px] bg-linear-to-r from-[#666CF7] to-[#7D86F6]",
    "font-headline font-extrabold text-on-primary",
    "shadow-[0_16px_34px_rgba(102,108,247,0.26)]",
    "transition-all",
    disabled
      ? "cursor-not-allowed opacity-50"
      : "hover:scale-[1.02] hover:shadow-[0_20px_42px_rgba(102,108,247,0.34)] active:scale-95",
    size === "lg" ? "px-6 py-5 text-lg" : "px-5 py-3 text-base",
    className ?? "",
  ];

  return baseClasses.join(" ").trim();
}

export default function PrimaryPillButton({
  children,
  icon,
  className,
  size = "lg",
  href,
  disabled,
  onClick,
  type = "button",
}: PrimaryPillButtonProps) {
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={getButtonClasses(size, false, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses(size, disabled, className)}
    >
      {content}
    </button>
  );
}
