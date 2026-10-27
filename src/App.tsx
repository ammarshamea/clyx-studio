import { LazyMotion, domMax, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Intro } from "./components/Intro";
import { Landing } from "./components/Landing";
import { LanguageProvider } from "./i18n/LanguageProvider";
import { introActive, type IntroState } from "./intro/session";

function pinToHero() {
  const root = document.documentElement;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
}

function releaseHeroPin() {
  document.documentElement.style.scrollBehavior = "";
}

/** Drop a leftover fragment so the browser does not scroll to it when the intro unlocks. */
function dropHash() {
  if (!window.location.hash) return;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
}

export function App() {
  return (
    <LanguageProvider>
      <LazyMotion features={domMax} strict>
        <Site />
      </LazyMotion>
    </LanguageProvider>
  );
}

function Site() {
  const reduced = useReducedMotion();
  const [state, setState] = useState<IntroState>("initial");
  const [swapped, setSwapped] = useState(false);
  const heroMarkRef = useRef<HTMLDivElement>(null);
  const active = introActive(state);

  useLayoutEffect(() => {
    if (state !== "initial") return;
    setSwapped(Boolean(reduced));
    dropHash();
    pinToHero();
    setState("playing");
  }, [reduced, state]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("intro-lock", active);
    dropHash();
    pinToHero();

    const pin = () => {
      if (window.scrollY === 0) return;
      dropHash();
      pinToHero();
    };
    window.addEventListener("scroll", pin, { passive: true });
    window.addEventListener("hashchange", dropHash);

    if (active) {
      return () => {
        window.removeEventListener("scroll", pin);
        window.removeEventListener("hashchange", dropHash);
        root.classList.remove("intro-lock");
      };
    }

    const release = () => {
      window.removeEventListener("scroll", pin);
      window.removeEventListener("hashchange", dropHash);
      window.removeEventListener("pointerdown", onIntent);
      window.removeEventListener("wheel", onIntent);
      window.removeEventListener("keydown", onIntent);
      releaseHeroPin();
    };
    const onIntent = (event: Event) => {
      if (event instanceof KeyboardEvent && !["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) return;
      release();
    };
    window.addEventListener("pointerdown", onIntent);
    window.addEventListener("wheel", onIntent, { passive: true });
    window.addEventListener("keydown", onIntent);
    const timer = window.setTimeout(release, 1200);

    return () => {
      window.clearTimeout(timer);
      release();
      root.classList.remove("intro-lock");
    };
  }, [active]);

  const onHandoff = useCallback(() => setState("handoff"), []);
  const onSwap = useCallback(() => setSwapped(true), []);
  const onDone = useCallback((skipped: boolean) => {
    setSwapped(true);
    setState(skipped ? "skipped" : "completed");
  }, []);

  return (
    <>
      <Landing heroMarkRef={heroMarkRef} live={state !== "initial" && state !== "playing"} markVisible={swapped} inert={active} />
      {state === "playing" || state === "handoff" ? (
        <Intro target={heroMarkRef} onHandoff={onHandoff} onSwap={onSwap} onDone={onDone} />
      ) : null}
    </>
  );
}
