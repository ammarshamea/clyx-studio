import { animate, useMotionValue, useMotionValueEvent, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState, type RefObject } from "react";
import {
  BOTTOM_HINGE,
  clapperCloseAngle,
  TOP_HINGE,
} from "../../brand/logoClapper";
import { LOGO_SYMBOL, LOGO_VIEWBOX, type LogoShape } from "../../brand/logo";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

const LOOP = 4;
const LAND = 0.28;
type Bezier = [number, number, number, number];
const LINEAR: Bezier = [0, 0, 1, 1];
const EASE_OUT: Bezier = [0.16, 1, 0.3, 1];
/** Ease-in close: steady acceleration, no late snap (avoids “double clap” feel). */
const EASE_CLOSE: Bezier = [0.55, 0, 1, 1];
const SOFT: Bezier = [0.33, 1, 0.68, 1];

/** Symmetric close (~24.3°): inner edges meet at the hub seam. */
const CLOSE = clapperCloseAngle();

function shape(id: string): LogoShape {
  const found = LOGO_SYMBOL.find((item) => item.id === id);
  if (!found) throw new Error(`Missing logo shape ${id}`);
  return found;
}

function useHeroState(section: RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(() => document.visibilityState !== "hidden");

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

  return { inView, tabVisible };
}

type PivotArmProps = {
  hinge: { x: number; y: number };
  logoShape: LogoShape;
  prefix: string;
  rotation: ReturnType<typeof useMotionValue<number>>;
};

/** SVG pivot: translate(hinge) → rotate(θ) → untranslate; tip stays fixed. */
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
  const { inView, tabVisible } = useHeroState(section);
  const active = live && inView && tabVisible;

  const topRotation = useMotionValue(0);
  const bottomRotation = useMotionValue(0);

  useEffect(() => {
    const rotateTimes = [0, 0.12, 0.46, 0.56, 1];
    const rotateEase = [LINEAR, EASE_CLOSE, LINEAR, EASE_OUT];
    const topKeys = [0, 0, CLOSE, CLOSE, 0];
    const bottomKeys = [0, 0, -CLOSE, -CLOSE, 0];

    let controls: AnimationPlaybackControls[] = [];

    if (!active) {
      controls = [
        animate(topRotation, 0, { duration: 0.32, ease: SOFT }),
        animate(bottomRotation, 0, { duration: 0.32, ease: SOFT }),
      ];
    } else {
      topRotation.set(0);
      bottomRotation.set(0);
      const shared = {
        duration: LOOP,
        times: rotateTimes,
        ease: rotateEase,
        repeat: Infinity,
        repeatType: "loop" as const,
        delay: LAND,
      };
      controls = [animate(topRotation, topKeys, shared), animate(bottomRotation, bottomKeys, shared)];
    }

    return () => controls.forEach((c) => c.stop());
  }, [active, topRotation, bottomRotation]);

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
