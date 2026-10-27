import { m, type Variants } from "framer-motion";
import { useMemo } from "react";
import { LOGO_CLYX, LOGO_STUDIO, LOGO_SYMBOL, LOGO_VIEWBOX } from "../../brand/logo";
import { EASE_IN_OUT, EASE_OUT } from "../../motion/tokens";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

export type IntroStage = "play" | "leave";

type Entry = {
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  duration: number;
};

export const SYMBOL_ENTRY: Record<string, Omit<Entry, "delay" | "duration"> & { at: number }> = {
  ring: { x: -460, y: 40, rotate: -14, scale: 0.9, at: 0.1 },
  "wedge-lower": { x: -300, y: 380, rotate: -24, scale: 0.86, at: 0.18 },
  "arm-top": { x: 520, y: -360, rotate: 16, scale: 0.92, at: 0.26 },
  "wedge-upper": { x: -320, y: -360, rotate: 22, scale: 0.86, at: 0.34 },
  "arm-bottom": { x: 520, y: 380, rotate: -16, scale: 0.92, at: 0.42 },
};

const FRAGMENT_SECONDS = 0.75;
const CLYX_START = 1.0;
const CLYX_STEP = 0.07;
const STUDIO_START = 1.32;
const STUDIO_STEP = 0.045;
const SHEEN_START = 1.6;

const fragmentVariants: Variants = {
  hidden: (entry: Entry) => ({
    x: entry.x,
    y: entry.y,
    rotate: entry.rotate,
    scale: entry.scale,
    opacity: 0,
    filter: "blur(14px)",
  }),
  play: (entry: Entry) => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: entry.delay,
      duration: entry.duration,
      ease: EASE_OUT,
      opacity: { delay: entry.delay, duration: entry.duration * 0.45, ease: "linear" },
    },
  }),
  settle: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

const letterVariants: Variants = {
  hidden: (rise: { y: number }) => ({ y: rise.y, opacity: 0 }),
  play: (rise: { y: number; delay: number; duration: number }) => ({
    y: 0,
    opacity: 1,
    transition: { delay: rise.delay, duration: rise.duration, ease: EASE_OUT },
  }),
  leave: { opacity: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

export type IntroLogoProps = {
  stage: IntroStage;
  timeScale: number;
  title?: string;
  className?: string;
};

export function IntroLogo({ stage, timeScale, title, className }: IntroLogoProps) {
  const prefix = useLogoPrefix();
  const k = timeScale;

  const entries = useMemo(
    () =>
      LOGO_SYMBOL.map((shape) => {
        const { at, ...from } = SYMBOL_ENTRY[shape.id];
        return { ...from, delay: at * k, duration: FRAGMENT_SECONDS * k };
      }),
    [k],
  );

  const clyxRise = useMemo(
    () => LOGO_CLYX.map((_, i) => ({ y: 220, delay: (CLYX_START + i * CLYX_STEP) * k, duration: 0.45 * k })),
    [k],
  );
  const studioRise = useMemo(
    () => LOGO_STUDIO.map((_, i) => ({ y: 120, delay: (STUDIO_START + i * STUDIO_STEP) * k, duration: 0.4 * k })),
    [k],
  );

  const all = [...LOGO_SYMBOL, ...LOGO_CLYX, ...LOGO_STUDIO];
  const lettersTarget = stage === "play" ? "play" : "leave";

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="visible" {...svgLabel(title)}>
      <defs>
        <LogoGradients prefix={prefix} shapes={all} />
        <clipPath id={`${prefix}-clyx-line`}>
          <rect x="0" y="1500" width="2000" height="262" />
        </clipPath>
        <clipPath id={`${prefix}-studio-line`}>
          <rect x="0" y="1790" width="2000" height="112" />
        </clipPath>
        <clipPath id={`${prefix}-all`}>
          {all.map((shape) => (
            <LogoShapeElement key={shape.id} shape={shape} />
          ))}
        </clipPath>
        <linearGradient id={`${prefix}-sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#F5F2F5" stopOpacity="0" />
          <stop offset="0.5" stopColor="#F5F2F5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F5F2F5" stopOpacity="0" />
        </linearGradient>
      </defs>

      {LOGO_SYMBOL.map((shape, index) => (
        <m.g
          key={shape.id}
          custom={entries[index]}
          variants={fragmentVariants}
          initial="hidden"
          animate={stage === "play" ? "play" : "settle"}
        >
          <LogoShapeElement shape={shape} prefix={prefix} />
        </m.g>
      ))}

      <g clipPath={`url(#${prefix}-clyx-line)`}>
        {LOGO_CLYX.map((shape, index) => (
          <m.g key={shape.id} custom={clyxRise[index]} variants={letterVariants} initial="hidden" animate={lettersTarget}>
            <LogoShapeElement shape={shape} prefix={prefix} />
          </m.g>
        ))}
      </g>
      <g clipPath={`url(#${prefix}-studio-line)`}>
        {LOGO_STUDIO.map((shape, index) => (
          <m.g key={shape.id} custom={studioRise[index]} variants={letterVariants} initial="hidden" animate={lettersTarget}>
            <LogoShapeElement shape={shape} prefix={prefix} />
          </m.g>
        ))}
      </g>

      <g clipPath={`url(#${prefix}-all)`} pointerEvents="none">
        <g transform="skewX(-18)">
          <m.rect
            y="-200"
            width="380"
            height="2400"
            fill={`url(#${prefix}-sheen)`}
            initial={{ x: -700, opacity: 1 }}
            animate={
              stage === "play"
                ? { x: 2900, transition: { delay: SHEEN_START * k, duration: 0.65 * k, ease: EASE_IN_OUT } }
                : { opacity: 0, transition: { duration: 0.4, ease: EASE_OUT } }
            }
          />
        </g>
      </g>
    </svg>
  );
}
