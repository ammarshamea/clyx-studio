import { m } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { LOGO_SYMBOL, LOGO_VIEWBOX } from "../../brand/logo";
import { EASE_IN_OUT, EASE_SOFT } from "../../motion/tokens";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

/** Junction of the two arms — the clapper hinge. */
const HINGE = { x: 889.92, y: 756 };
const STICK = new Set(["arm-top", "wedge-upper"]);

const HOLD_AFTER_LAND = 0.5;
const OPEN_FOR = 0.78;
const HOLD_OPEN = 0.42;
const SNAP_FOR = 0.18;
const HOLD_SHUT = 1.9;
const EASE_SNAP = [0.62, 0, 0.98, 0.18] as const;

type Pose = "shut" | "open";

function useHeroState(section: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState !== "hidden");
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [section]);

  useEffect(() => {
    const onVisibility = () => setTabVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(narrow.matches);
    sync();
    narrow.addEventListener("change", sync);
    return () => narrow.removeEventListener("change", sync);
  }, []);

  return { inView, tabVisible, compact };
}

export type HeroLogoProps = {
  live: boolean;
  section: RefObject<HTMLElement | null>;
  title?: string;
  className?: string;
};

export function HeroLogo({ live, section, title, className }: HeroLogoProps) {
  const prefix = useLogoPrefix();
  const { inView, tabVisible, compact } = useHeroState(section);
  const active = live && inView && tabVisible;
  const openDeg = compact ? -14 : -18;
  const [pose, setPose] = useState<Pose>("shut");
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (!active) {
      setPose("shut");
      setHasOpened(false);
      return;
    }

    setPose("shut");
    setHasOpened(false);
    const timers: number[] = [];
    let cancelled = false;

    const clap = () => {
      if (cancelled) return;
      setPose("open");
      setHasOpened(true);
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setPose("shut");
          timers.push(window.setTimeout(clap, (SNAP_FOR + HOLD_SHUT) * 1000));
        }, (OPEN_FOR + HOLD_OPEN) * 1000),
      );
    };

    timers.push(window.setTimeout(clap, HOLD_AFTER_LAND * 1000));

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [active]);

  const stickTransition =
    pose === "open"
      ? { duration: OPEN_FOR, ease: EASE_SOFT }
      : { duration: SNAP_FOR, ease: EASE_SNAP };

  const slate = LOGO_SYMBOL.filter((shape) => !STICK.has(shape.id));
  const stick = LOGO_SYMBOL.filter((shape) => STICK.has(shape.id));

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="visible" {...svgLabel(title)}>
      <defs>
        <LogoGradients prefix={prefix} shapes={LOGO_SYMBOL} />
        <clipPath id={`${prefix}-symbol`}>
          {LOGO_SYMBOL.map((shape) => (
            <LogoShapeElement key={shape.id} shape={shape} />
          ))}
        </clipPath>
        <linearGradient id={`${prefix}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F5F2F5" stopOpacity="0" />
          <stop offset="0.5" stopColor="#F5F2F5" stopOpacity="0.5" />
          <stop offset="1" stopColor="#F5F2F5" stopOpacity="0" />
        </linearGradient>
      </defs>

      {slate.map((shape) => (
        <LogoShapeElement key={shape.id} shape={shape} prefix={prefix} />
      ))}

      <m.g
        initial={false}
        animate={{ rotate: active && pose === "open" ? openDeg : 0 }}
        transition={stickTransition}
        transformTemplate={({ rotate }) =>
          `translate(${HINGE.x}px, ${HINGE.y}px) rotate(${rotate}) translate(${-HINGE.x}px, ${-HINGE.y}px)`
        }
      >
        {stick.map((shape) => (
          <LogoShapeElement key={shape.id} shape={shape} prefix={prefix} />
        ))}
      </m.g>

      <g clipPath={`url(#${prefix}-symbol)`} pointerEvents="none">
        <g transform="skewX(-18)">
          <m.rect
            y="-200"
            width="380"
            height="2400"
            fill={`url(#${prefix}-sheen)`}
            initial={{ x: -700, opacity: 0 }}
            animate={
              active && pose === "shut" && hasOpened
                ? { x: 2900, opacity: 1, transition: { duration: 0.38, delay: 0.02, ease: EASE_IN_OUT } }
                : { x: -700, opacity: 0, transition: { duration: 0.15 } }
            }
          />
        </g>
      </g>
    </svg>
  );
}
