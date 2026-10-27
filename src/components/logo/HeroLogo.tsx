import { m } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { LOGO_SYMBOL, LOGO_VIEWBOX } from "../../brand/logo";
import { EASE_SOFT } from "../../motion/tokens";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

/** Junction of the two right-hand wedges. */
const HINGE = { x: 889.92, y: 756 };
const STICK = new Set(["arm-top", "wedge-upper"]);

const LOOP = 4;
const LAND = 0.28;
const LINEAR = [0, 0, 1, 1] as const;
const EASE_IN = [0.55, 0, 1, 1] as const;
const EASE_CLOSE = [0.72, 0, 0.98, 0.12] as const;
const EASE_HIT = [0.16, 1, 0.3, 1] as const;

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

function loopOf(times: number[], ease: ReadonlyArray<readonly number[]>) {
  return {
    duration: LOOP,
    times,
    ease,
    repeat: Infinity,
    delay: LAND,
  };
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
  const open = compact ? -26 : -30;
  const rest = { duration: 0.32, ease: EASE_SOFT };

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
          <stop offset="0.5" stopColor="#F5F2F5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F5F2F5" stopOpacity="0" />
        </linearGradient>
      </defs>

      <m.g
        initial={false}
        animate={
          active
            ? { x: [0, 0, 9, -6, 3, 0, 0], y: [0, 0, 4, -3, 1, 0, 0] }
            : { x: 0, y: 0 }
        }
        transition={
          active
            ? loopOf([0, 0.445, 0.455, 0.47, 0.488, 0.52, 1], [LINEAR, EASE_HIT, EASE_HIT, EASE_HIT, EASE_HIT, LINEAR])
            : rest
        }
      >
        {slate.map((shape) => (
          <LogoShapeElement key={shape.id} shape={shape} prefix={prefix} />
        ))}

        <m.g
          initial={false}
          animate={
            active
              ? { rotate: [0, 4, open, open, 0, 0], scale: [1, 1, 1, 0.965, 1, 1] }
              : { rotate: 0, scale: 1 }
          }
          transition={
            active
              ? {
                  rotate: loopOf([0, 0.03, 0.26, 0.388, 0.445, 1], [EASE_IN, EASE_SOFT, LINEAR, EASE_CLOSE, LINEAR]),
                  scale: loopOf([0, 0.445, 0.452, 0.48, 0.52, 1], [LINEAR, EASE_HIT, EASE_HIT, LINEAR, LINEAR]),
                }
              : rest
          }
          transformTemplate={({ rotate, scale }) =>
            `translate(${HINGE.x}px, ${HINGE.y}px) rotate(${rotate}) scale(${scale}) translate(${-HINGE.x}px, ${-HINGE.y}px)`
          }
        >
          {stick.map((shape) => (
            <LogoShapeElement key={shape.id} shape={shape} prefix={prefix} />
          ))}
        </m.g>

        <m.g
          pointerEvents="none"
          initial={false}
          animate={
            active
              ? { opacity: [0, 0, 1, 0.55, 0, 0], scale: [0.35, 0.35, 1.12, 0.82, 0.4, 0.35] }
              : { opacity: 0, scale: 0.35 }
          }
          transition={
            active
              ? loopOf([0, 0.442, 0.45, 0.475, 0.53, 1], [LINEAR, EASE_HIT, EASE_HIT, EASE_SOFT, LINEAR])
              : rest
          }
          transformTemplate={({ scale }) =>
            `translate(${HINGE.x}px, ${HINGE.y}px) scale(${scale}) translate(${-HINGE.x}px, ${-HINGE.y}px)`
          }
          style={{ mixBlendMode: "plus-lighter" }}
        >
          <polygon points="889.92,738 1118,756 889.92,774" fill="#F5F2F5" />
          <polygon points="889.92,748 1048,728 904,756" fill="#8D2168" />
          <polygon points="889.92,764 1048,784 904,756" fill="#8D2168" />
          <circle cx={HINGE.x} cy={HINGE.y} r="20" fill="#F5F2F5" />
        </m.g>
      </m.g>

      <g clipPath={`url(#${prefix}-symbol)`} pointerEvents="none">
        <g transform="skewX(-18)">
          <m.rect
            y="-200"
            width="380"
            height="2400"
            fill={`url(#${prefix}-sheen)`}
            initial={false}
            animate={active ? { x: [-800, -800, -800, 2900, 2900], opacity: [0, 0, 1, 0.35, 0] } : { x: -800, opacity: 0 }}
            transition={
              active ? loopOf([0, 0.442, 0.445, 0.53, 1], [LINEAR, LINEAR, EASE_SOFT, LINEAR]) : rest
            }
          />
        </g>
      </g>
    </svg>
  );
}
