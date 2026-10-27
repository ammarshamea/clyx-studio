import { m } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { LOGO_SYMBOL, LOGO_VIEWBOX, type LogoShape } from "../../brand/logo";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

/**
 * Right-side clapper: `arm-top` / `arm-bottom` are the long diagonal bars (flat vertical
 * outer edges). Hub wedges + `ring` stay static. Each bar pivots on its inner corner.
 */
const TOP_HINGE = { x: 889.92, y: 748.7 };
const BOTTOM_HINGE = { x: 889.92, y: 763.27 };

const LOOP = 4;
const LAND = 0.28;
type Bezier = [number, number, number, number];
const LINEAR: Bezier = [0, 0, 1, 1];
const EASE_IN: Bezier = [0.55, 0, 1, 1];
const EASE_CLOSE: Bezier = [0.82, 0, 0.98, 0.06];
const EASE_HIT: Bezier = [0.16, 1, 0.3, 1];
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

function around(hinge: { x: number; y: number }) {
  return ({ rotate = "0deg", scaleY = "1" }: { rotate?: string | number; scaleY?: string | number }) =>
    `translate(${hinge.x}px, ${hinge.y}px) scale(1, ${scaleY}) rotate(${rotate}) translate(${-hinge.x}px, ${-hinge.y}px)`;
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
  const open = compact ? 30 : 34;
  const bite = compact ? 2 : 2.5;
  const rest = { duration: 0.32, ease: SOFT };

  const top = shape("arm-top");
  const bottom = shape("arm-bottom");

  const rotateTimes = [0, 0.1, 0.15, 0.32, 0.42, 0.495, 0.52, 0.545, 0.7, 1];
  const rotateEase = [LINEAR, EASE_IN, SOFT, LINEAR, EASE_CLOSE, EASE_HIT, SOFT, EASE_HIT, SOFT];
  const squashTimes = [0, 0.495, 0.51, 0.56, 1];
  const squashEase = [LINEAR, EASE_HIT, SOFT, LINEAR];

  const topRotate = [0, 0, -3, -open, -open, bite, -0.6, 0, -open * 0.28, 0];
  const bottomRotate = [0, 0, 3, open, open, -bite, 0.6, 0, open * 0.28, 0];
  const impactSquash = [1, 1, 0.94, 1, 1];

  const armTransition = active
    ? {
        rotate: loopOf(rotateTimes, rotateEase),
        scaleY: loopOf(squashTimes, squashEase),
      }
    : rest;

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="visible" {...svgLabel(title)}>
      <defs>
        <LogoGradients prefix={prefix} shapes={LOGO_SYMBOL} />
      </defs>

      <LogoShapeElement shape={shape("wedge-lower")} prefix={prefix} />

      <m.g
        initial={false}
        animate={active ? { rotate: topRotate, scaleY: impactSquash } : { rotate: 0, scaleY: 1 }}
        transition={armTransition}
        transformTemplate={around(TOP_HINGE)}
      >
        <LogoShapeElement shape={top} prefix={prefix} />
      </m.g>

      <LogoShapeElement shape={shape("wedge-upper")} prefix={prefix} />

      <m.g
        initial={false}
        animate={active ? { rotate: bottomRotate, scaleY: impactSquash } : { rotate: 0, scaleY: 1 }}
        transition={armTransition}
        transformTemplate={around(BOTTOM_HINGE)}
      >
        <LogoShapeElement shape={bottom} prefix={prefix} />
      </m.g>

      <LogoShapeElement shape={shape("ring")} prefix={prefix} />
    </svg>
  );
}
