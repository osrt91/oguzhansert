"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, string> = {
  tr: "TR",
  en: "EN",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "tr" ? "en" : "tr";

  function handleSwitch() {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=${365 * 24 * 60 * 60}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.replace(pathname as any, { locale: nextLocale });
  }

  return (
    <Button
      type="button"
      variant="link"
      size="icon"
      className={cn("text-xs font-semibold", className)}
      onClick={handleSwitch}
      title={nextLocale === "en" ? "Switch to English" : "Turkceye Gec"}
    >
      {localeLabels[nextLocale]}
    </Button>
  );
}
