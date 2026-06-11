"use client";
import { useLocale, useTranslations } from "next-intl";
import { setLocale } from "@/actions/locale";
import { usePathname } from "next/navigation";
import { useTransition } from "react";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("Common");
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === "ar" ? "en" : "ar";

  function handleSwitch() {
    startTransition(async () => {
      await setLocale(nextLocale, pathname);
    });
  }

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      className={`px-3 py-1.5 text-sm font-semibold rounded-lg border border-current/30 hover:bg-white/10 transition-colors disabled:opacity-50 ${className}`}
    >
      {isPending ? "…" : t("langSwitch")}
    </button>
  );
}
