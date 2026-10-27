import { m } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { LOGO_SYMBOL, LOGO_VIEWBOX, type LogoShape } from "../../brand/logo";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

/**
 * Long right bars: `arm-top` / `arm-bottom`. Each pivots on its inner-left tip;
 * those hinge points stay fixed in SVG space (translate–rotate–untranslate only).
 */
const TOP_HINGE = { x: 889.92, y: 748.7 };
const BOTTOM_HINGE = { x: 889.92, y: 763.27 };

const LOOP = 4;
const LAND = 0.28;
type Bezier = [number, number, number, number];
const LINEAR: Bezier = [0, 0, 1, 1];
const EASE_OUT: Bezier = [0.16, 1, 0.3, 1];
const EASE_SNAP: Bezier = [0.82, 0, 0.98, 0.05];
const SOFT: Bezier = [0.33, 1, 0.68, 1];

function shape(id: string): LogoShape {
  const found = LOGO_SYMBOL.find((item) => item.id === id);
  if (!found) throw new Error(`Missing logo shape ${id}`);
  return found;
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

function loopOf(times: number[], ease: Bezier[]) {
  return {
    duration: LOOP,
    times,
    ease,
    repeat: Infinity,
    delay: LAND,
  };
}

/** Rotation only; pivot fixed at hinge in userSpaceOnUse coordinates. */
function pivotAt(hinge: { x: number; y: number }) {
  return ({ rotate = "0deg" }: { rotate?: string | number }) =>
    `translate(${hinge.x}px, ${hinge.y}px) rotate(${rotate}) translate(${-hinge.x}px, ${-hinge.y}px)`;
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
  /** Degrees to swing inward from resting artwork until the bars meet. */
  const close = compact ? 11.5 : 13.2;
  const rest = { duration: 0.32, ease: SOFT };

  const top = shape("arm-top");
  const bottom = shape("arm-bottom");

  // Rest (0°) → smooth close → fast snap shut → hold → smooth reopen → rest
  const rotateTimes = [0, 0.12, 0.38, 0.46, 0.56, 1];
  const rotateEase = [LINEAR, EASE_OUT, EASE_SNAP, LINEAR, EASE_OUT];

  const topRotate = [0, 0, close * 0.82, close, close, 0];
  const bottomRotate = [0, 0, -close * 0.82, -close, -close, 0];

  const rotateTransition = active ? loopOf(rotateTimes, rotateEase) : rest;

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="visible" {...svgLabel(title)}>
      <defs>
        <LogoGradients prefix={prefix} shapes={LOGO_SYMBOL} />
      </defs>

      <LogoShapeElement shape={shape("wedge-lower")} prefix={prefix} />

      <m.g
        initial={false}
        animate={active ? { rotate: topRotate } : { rotate: 0 }}
        transition={{ rotate: rotateTransition }}
        transformTemplate={pivotAt(TOP_HINGE)}
      >
        <LogoShapeElement shape={top} prefix={prefix} />
      </m.g>

      <LogoShapeElement shape={shape("wedge-upper")} prefix={prefix} />

      <m.g
        initial={false}
        animate={active ? { rotate: bottomRotate } : { rotate: 0 }}
        transition={{ rotate: rotateTransition }}
        transformTemplate={pivotAt(BOTTOM_HINGE)}
      >
        <LogoShapeElement shape={bottom} prefix={prefix} />
      </m.g>

      <LogoShapeElement shape={shape("ring")} prefix={prefix} />
    </svg>
  );
}
