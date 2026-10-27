import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ar } from "./ar";
import { en } from "./en";
import type { Dictionary } from "./types";

export type Locale = "ar" | "en";

const catalogs: Record<Locale, Dictionary> = { ar, en };
const STORAGE_KEY = "clyx-locale";

type LanguageContextValue = {
  locale: Locale;
  copy: Dictionary;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readLocale(): Locale {
  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ar";
  } catch {
    return "ar";
  }
}

function setMeta(selector: string, content: string) {
  document.querySelector(selector)?.setAttribute("content", content);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(readLocale);

  useEffect(() => {
    const copy = catalogs[locale];
    const root = document.documentElement;
    root.lang = locale;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = copy.meta.title;
    setMeta('meta[name="description"]', copy.meta.description);
    setMeta('meta[property="og:title"]', copy.meta.title);
    setMeta('meta[property="og:description"]', copy.meta.description);
    setMeta('meta[property="og:locale"]', locale === "ar" ? "ar_AR" : "en_US");
    setMeta('meta[name="twitter:title"]', copy.meta.title);
    setMeta('meta[name="twitter:description"]', copy.meta.description);
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Storage blocked: the choice lasts for this page view only.
    }
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      copy: catalogs[locale],
      dir: locale === "ar" ? "rtl" : "ltr",
      setLocale,
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return value;
}
