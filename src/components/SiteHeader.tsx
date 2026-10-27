import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useLanguage, type Locale } from "../i18n/LanguageProvider";
import type { SectionId } from "../i18n/types";
import { DURATION, EASE_IN_OUT, EASE_OUT, STAGGER } from "../motion/tokens";
import { ClyxAnimatedLogo } from "./logo/ClyxAnimatedLogo";

export const SECTIONS: SectionId[] = ["about", "services", "work", "process", "contact"];

function LanguageSwitch({ className }: { className?: string }) {
  const { locale, setLocale, copy } = useLanguage();
  const options: { id: Locale; label: string }[] = [
    { id: "en", label: "EN" },
    { id: "ar", label: "AR" },
  ];
  return (
    <div role="group" aria-label={copy.languageLabel} className={`flex items-center ${className ?? ""}`} dir="ltr">
      {options.map((option, index) => (
        <span key={option.id} className="flex items-center">
          {index > 0 ? (
            <span aria-hidden className="px-1 text-ivory/30">
              /
            </span>
          ) : null}
          <button
            type="button"
            lang={option.id}
            aria-pressed={locale === option.id}
            onClick={() => setLocale(option.id)}
            className={`min-h-11 min-w-9 px-1 text-sm transition-colors duration-200 ${
              locale === option.id ? "text-ivory" : "text-ivory/50 hover:text-ivory/80"
            }`}
          >
            {option.label}
          </button>
        </span>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const { copy } = useLanguage();
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("menu-lock", open);
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      root.classList.remove("menu-lock");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid ? "border-b border-ivory/10 bg-charcoal/70 backdrop-blur-md" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="shell relative z-10 flex h-16 items-center justify-between gap-6 lg:h-20">
          <a href="#top" className="flex shrink-0 items-center gap-3" aria-label={copy.brand}>
            <ClyxAnimatedLogo mode="static" part="symbol" crop className="h-8 w-auto lg:h-9" />
            <span className="latin-mark hidden text-[0.7rem] font-medium text-ivory/85 sm:inline" dir="ltr">
              CLYX STUDIO
            </span>
          </a>

          <nav aria-label={copy.navLabel} className="hidden items-center gap-8 lg:flex">
            {SECTIONS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="group relative py-2 text-sm text-ivory/75 transition-colors duration-200 hover:text-ivory"
              >
                {copy.nav[id]}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-[0%_50%] scale-x-0 bg-magenta transition-transform duration-300 group-hover:scale-x-100 rtl:origin-[100%_50%]"
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitch className="hidden sm:flex" />
            <a
              href="#contact"
              className="hidden min-h-11 items-center bg-magenta px-5 text-sm font-medium text-ivory transition-colors duration-200 hover:bg-magenta-light lg:inline-flex"
            >
              {copy.nav.start}
            </a>
            <button
              ref={toggleRef}
              type="button"
              className="flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? copy.close : copy.menu}
              onClick={() => setOpen((value) => !value)}
            >
              <span aria-hidden className="relative block h-3.5 w-5">
                <span
                  className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    open ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-[7px] h-px bg-current transition-opacity duration-200 motion-reduce:transition-none ${
                    open ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    open ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <m.div
            id="mobile-menu"
            className="fixed inset-0 z-30 bg-night/95 backdrop-blur-lg lg:hidden"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: "-4%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: reduced ? "0%" : "-3%" }}
            transition={{ duration: DURATION.micro * 1.6, ease: EASE_IN_OUT }}
          >
            <div className="shell flex h-full flex-col pt-24 pb-8">
            <nav aria-label={copy.navLabel}>
              <ul className="grid gap-1">
                {SECTIONS.map((id, index) => (
                  <li key={id} className="overflow-hidden">
                    <m.a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      className="display flex min-h-14 items-baseline gap-4 py-2 text-4xl sm:text-5xl"
                      initial={reduced ? false : { y: "100%" }}
                      animate={{ y: "0%" }}
                      transition={{ duration: DURATION.reveal, delay: 0.08 + index * STAGGER.base, ease: EASE_OUT }}
                    >
                      <span className="text-xs text-magenta-light" dir="ltr">
                        {`0${index + 1}`}
                      </span>
                      {copy.nav[id]}
                    </m.a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 pt-6">
              <LanguageSwitch />
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex min-h-12 items-center bg-magenta px-6 text-sm font-medium text-ivory"
              >
                {copy.nav.start}
              </a>
            </div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
