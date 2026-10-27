import { m } from "framer-motion";
import { useEffect, useState, type RefObject } from "react";
import { LOGO_SYMBOL, LOGO_VIEWBOX, type LogoShape } from "../../brand/logo";
import { EASE_SOFT } from "../../motion/tokens";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

/** Each large right arm pivots on its own inner vertex. */
const TOP_HINGE = { x: 889.92, y: 748.7 };
const BOTTOM_HINGE = { x: 889.92, y: 763.27 };
const SPARK_AT = { x: 1480, y: 756 };

const LOOP = 4;
const LAND = 0.28;
const LINEAR = [0, 0, 1, 1] as const;
const EASE_IN = [0.55, 0, 1, 1] as const;
const EASE_CLOSE = [0.72, 0, 0.98, 0.12] as const;
const EASE_HIT = [0.16, 1, 0.3, 1] as const;

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

function loopOf(times: number[], ease: ReadonlyArray<readonly number[]>) {
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
  const spread = compact ? 12 : 16;
  const clap = compact ? 22 : 24;
  const rest = { duration: 0.32, ease: EASE_SOFT };

  const top = shape("arm-top");
  const bottom = shape("arm-bottom");
  const rotateTimes = [0, 0.16, 0.24, 0.4, 0.5, 0.575, 0.61, 0.76, 1];
  const rotateEase = [LINEAR, EASE_IN, EASE_SOFT, LINEAR, EASE_CLOSE, LINEAR, EASE_SOFT, LINEAR];
  const squashTimes = [0, 0.575, 0.605, 0.68, 1];
  const squashEase = [LINEAR, EASE_HIT, EASE_SOFT, LINEAR];

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="visible" {...svgLabel(title)}>
      <defs>
        <LogoGradients prefix={prefix} shapes={LOGO_SYMBOL} />
      </defs>

      <LogoShapeElement shape={shape("wedge-lower")} prefix={prefix} />

      <m.g
        initial={false}
        animate={active ? { rotate: [0, 0, -4, -spread, -spread, clap, clap, 0, 0], scaleY: [1, 1, 0.94, 1, 1] } : { rotate: 0, scaleY: 1 }}
        transition={
          active
            ? { rotate: loopOf(rotateTimes, rotateEase), scaleY: loopOf(squashTimes, squashEase) }
            : rest
        }
        transformTemplate={around(TOP_HINGE)}
      >
        <LogoShapeElement shape={top} prefix={prefix} />
      </m.g>

      <LogoShapeElement shape={shape("wedge-upper")} prefix={prefix} />

      <m.g
        initial={false}
        animate={active ? { rotate: [0, 0, 4, spread, spread, -clap, -clap, 0, 0], scaleY: [1, 1, 0.94, 1, 1] } : { rotate: 0, scaleY: 1 }}
        transition={
          active
            ? { rotate: loopOf(rotateTimes, rotateEase), scaleY: loopOf(squashTimes, squashEase) }
            : rest
        }
        transformTemplate={around(BOTTOM_HINGE)}
      >
        <LogoShapeElement shape={bottom} prefix={prefix} />
      </m.g>

      <LogoShapeElement shape={shape("ring")} prefix={prefix} />

      <m.g
        pointerEvents="none"
        initial={false}
        animate={active ? { opacity: [0, 0, 1, 0, 0], scale: [0.45, 0.45, 1.08, 0.7, 0.45] } : { opacity: 0, scale: 0.45 }}
        transition={active ? loopOf([0, 0.57, 0.59, 0.68, 1], [LINEAR, EASE_HIT, EASE_SOFT, LINEAR]) : rest}
        transformTemplate={({ scale = 1 }) =>
          `translate(${SPARK_AT.x}px, ${SPARK_AT.y}px) scale(${scale}) translate(${-SPARK_AT.x}px, ${-SPARK_AT.y}px)`
        }
        style={{ mixBlendMode: "plus-lighter" }}
      >
        <polygon points="1240,750 1760,756 1240,762" fill="#F5F2F5" />
        <polygon points="1360,756 1680,734 1440,756" fill="#C43A8A" />
        <polygon points="1360,756 1680,778 1440,756" fill="#C43A8A" />
      </m.g>
    </svg>
  );
}
