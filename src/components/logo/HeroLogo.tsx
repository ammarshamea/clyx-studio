import { animate, useMotionValue, useMotionValueEvent, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import { LOGO_SYMBOL, LOGO_VIEWBOX, type LogoShape } from "../../brand/logo";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

/** Inner-left tips of the long bars (verbatim from logo geometry). */
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

type PivotArmProps = {
  hinge: { x: number; y: number };
  logoShape: LogoShape;
  prefix: string;
  rotation: ReturnType<typeof useMotionValue<number>>;
};

/** SVG user-space pivot: outer translate → rotate(angle) → inner untranslate. */
function PivotArm({ hinge, logoShape, prefix, rotation }: PivotArmProps) {
  const rotateRef = useRef<SVGGElement>(null);

  useMotionValueEvent(rotation, "change", (angle) => {
    rotateRef.current?.setAttribute("transform", `rotate(${angle})`);
  });

  return (
    <g transform={`translate(${hinge.x} ${hinge.y})`}>
      <g ref={rotateRef} transform="rotate(0)">
        <g transform={`translate(${-hinge.x} ${-hinge.y})`}>
          <LogoShapeElement shape={logoShape} prefix={prefix} />
        </g>
      </g>
    </g>
  );
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
  const close = compact ? 11.5 : 13.2;

  const topRotation = useMotionValue(0);
  const bottomRotation = useMotionValue(0);

  useEffect(() => {
    const rotateTimes = [0, 0.12, 0.38, 0.46, 0.56, 1];
    const rotateEase = [LINEAR, EASE_OUT, EASE_SNAP, LINEAR, EASE_OUT];
    const topKeys = [0, 0, close * 0.82, close, close, 0];
    const bottomKeys = [0, 0, -close * 0.82, -close, -close, 0];

    let controls: AnimationPlaybackControls[] = [];

    if (!active) {
      controls = [
        animate(topRotation, 0, { duration: 0.32, ease: SOFT }),
        animate(bottomRotation, 0, { duration: 0.32, ease: SOFT }),
      ];
    } else {
      const shared = {
        duration: LOOP,
        times: rotateTimes,
        ease: rotateEase,
        repeat: Infinity,
        delay: LAND,
      };
      controls = [animate(topRotation, topKeys, shared), animate(bottomRotation, bottomKeys, shared)];
    }

    return () => controls.forEach((c) => c.stop());
  }, [active, close, topRotation, bottomRotation]);

  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="visible" {...svgLabel(title)}>
      <defs>
        <LogoGradients prefix={prefix} shapes={LOGO_SYMBOL} />
      </defs>

      <LogoShapeElement shape={shape("wedge-lower")} prefix={prefix} />
      <PivotArm hinge={TOP_HINGE} logoShape={shape("arm-top")} prefix={prefix} rotation={topRotation} />
      <LogoShapeElement shape={shape("wedge-upper")} prefix={prefix} />
      <PivotArm hinge={BOTTOM_HINGE} logoShape={shape("arm-bottom")} prefix={prefix} rotation={bottomRotation} />
      <LogoShapeElement shape={shape("ring")} prefix={prefix} />
    </svg>
  );
}
