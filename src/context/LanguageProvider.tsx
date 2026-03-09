import { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import type { Lang } from "../lib/types";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (tr: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

async function detectCountry(): Promise<string> {
  try {
    const stored = localStorage.getItem("preferred_lang");
    if (stored === "tr" || stored === "en") return stored;

    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) });
    const data = await res.json();
    return data.country_code === "TR" ? "tr" : "en";
  } catch {
    return "en";
  }
}

export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [lang, setLangState] = useState<Lang>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    detectCountry().then((detected) => {
      setLangState(detected as Lang);
      setReady(true);
    });
  }, []);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("preferred_lang", newLang);
  };

  const t = (tr: string, en: string) => (lang === "tr" ? tr : en);

  if (!ready) return null;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
};
