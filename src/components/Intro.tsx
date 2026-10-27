import { animate, m, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { useLanguage } from "../i18n/LanguageProvider";
import { EASE_SOFT } from "../motion/tokens";
import { ClyxAnimatedLogo } from "./logo/ClyxAnimatedLogo";
import type { IntroStage } from "./logo/IntroLogo";

const HOLD_UNTIL = 2.12;
const TRAVEL_DELAY = 0.28;
const TRAVEL = 1.2;
const SKIP_TRAVEL = 0.75;
const REDUCED_HOLD = 0.7;

type Props = {
  target: RefObject<HTMLElement | null>;
  onHandoff: () => void;
  onSwap: () => void;
  onDone: (skipped: boolean) => void;
};

export function Intro({ target, onHandoff, onSwap, onDone }: Props) {
  const { copy } = useLanguage();
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<IntroStage>("play");
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);
  const running = useRef<AnimationPlaybackControls[]>([]);

  const leave = useCallback(
    (skipped: boolean) => {
      if (leaving.current) return;
      leaving.current = true;
      setStage("leave");
      const scrolling = document.documentElement;
      const previous = scrolling.style.scrollBehavior;
      scrolling.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
      scrolling.style.scrollBehavior = previous;
      onHandoff();

      const root = rootRef.current;
      const box = boxRef.current;
      const veil = veilRef.current;
      const to = target.current?.getBoundingClientRect();
      const from = box?.getBoundingClientRect();
      const finish = () => onDone(skipped);
      const swap = () => {
        onSwap();
        if (box) box.style.opacity = "0";
        window.requestAnimationFrame(finish);
      };

      if (reduced || !root || !box || !veil || !to || !from || to.width === 0 || from.width === 0) {
        const fade = root ? animate(root, { opacity: 0 }, { duration: 0.3, ease: "linear" }) : null;
        if (fade) {
          running.current.push(fade);
          fade.then(swap);
        } else {
          swap();
        }
        return;
      }

      const duration = skipped ? SKIP_TRAVEL : TRAVEL;
      const delay = skipped ? 0 : TRAVEL_DELAY;
      const x = to.left + to.width / 2 - (from.left + from.width / 2);
      const y = to.top + to.height / 2 - (from.top + from.height / 2);
      const scale = to.width / from.width;

      const travel = animate(box, { x, y, scale }, { duration, delay, ease: EASE_SOFT });
      const reveal = animate(veil, { opacity: 0 }, { duration: duration + delay + 0.25, delay, ease: EASE_SOFT });
      running.current.push(travel, reveal);
      Promise.all([travel, reveal]).then(swap);
    },
    [onDone, onHandoff, onSwap, reduced, target],
  );

  useEffect(() => {
    const hold = (reduced ? REDUCED_HOLD : HOLD_UNTIL) * 1000;
    const timer = window.setTimeout(() => leave(false), hold);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") leave(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [leave, reduced]);

  useEffect(() => {
    const controls = running.current;
    return () => controls.forEach((control) => control.stop());
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] overflow-hidden"
      aria-label={copy.brand}
      role="presentation"
    >
      <div ref={veilRef} className="absolute inset-0 bg-night">
        <m.div
          aria-hidden
          className="intro-glow absolute inset-0"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={stage === "play" ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: stage === "play" ? 0.6 : 0.85, ease: EASE_SOFT }}
        />
        <div aria-hidden className="intro-beam absolute inset-0" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={boxRef} className="aspect-square w-[min(78vw,64vh,560px)]">
          <ClyxAnimatedLogo
            mode="intro"
            stage={stage}
            timeScale={1}
            title={copy.brand}
            className="block h-full w-full"
          />
        </div>
      </div>

    </div>
  );
}
