import { m, type Variants } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { LOGO_SYMBOL, LOGO_VIEWBOX } from "../../brand/logo";
import { EASE_IN_OUT, EASE_OUT, HERO_CYCLE, HERO_TRAVEL } from "../../motion/tokens";
import { SYMBOL_ENTRY } from "./IntroLogo";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

const AMPLITUDE = 0.28;
const AMPLITUDE_COMPACT = 0.22;

type Pose = "together" | "apart";

function fragmentVariants(amp: number): Variants {
  return {
    together: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
    },
    apart: (from: (typeof SYMBOL_ENTRY)[string]) => ({
      x: from.x * amp,
      y: from.y * amp,
      rotate: from.rotate * amp,
      scale: from.scale,
      opacity: 1,
      filter: "blur(12px)",
    }),
  };
}

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
  const amp = compact ? AMPLITUDE_COMPACT : AMPLITUDE;
  const variants = fragmentVariants(amp);
  const [pose, setPose] = useState<Pose>("together");

  useEffect(() => {
    if (!active) {
      setPose("together");
      return;
    }
    setPose("apart");
    const id = window.setInterval(() => {
      setPose((current) => (current === "together" ? "apart" : "together"));
    }, HERO_CYCLE * 1000);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="hidden" {...svgLabel(title)}>
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

      {LOGO_SYMBOL.map((shape) => {
        const from = SYMBOL_ENTRY[shape.id];
        const assembling = pose === "together";
        return (
          <m.g
            key={shape.id}
            custom={from}
            variants={variants}
            initial="together"
            animate={active ? pose : "together"}
            transition={{
              delay: from.at * 0.55,
              duration: HERO_TRAVEL,
              ease: EASE_OUT,
              filter: {
                delay: from.at * 0.55,
                duration: assembling ? HERO_TRAVEL * 0.4 : HERO_TRAVEL * 0.5,
                ease: "linear",
              },
            }}
          >
            <LogoShapeElement shape={shape} prefix={prefix} />
          </m.g>
        );
      })}

      <g clipPath={`url(#${prefix}-symbol)`} pointerEvents="none">
        <g transform="skewX(-18)">
          <m.rect
            y="-200"
            width="380"
            height="2400"
            fill={`url(#${prefix}-sheen)`}
            initial={{ x: -700, opacity: 0 }}
            animate={
              active && pose === "together"
                ? { x: 2900, opacity: 1, transition: { duration: 0.5, delay: 0.08, ease: EASE_IN_OUT } }
                : { x: -700, opacity: 0, transition: { duration: 0.2 } }
            }
          />
        </g>
      </g>
    </svg>
  );
}
