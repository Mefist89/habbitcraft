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
    "rounded-[2rem] bg-linear-to-r from-primary to-primary-container",
    "font-headline font-extrabold text-on-primary",
    "shadow-[0_18px_38px_rgba(88,96,254,0.28)]",
    "transition-all",
    disabled
      ? "cursor-not-allowed opacity-50"
      : "hover:scale-[1.02] hover:shadow-[0_22px_44px_rgba(88,96,254,0.34)] active:scale-95",
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
