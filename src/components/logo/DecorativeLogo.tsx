import { m, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { LOGO_CLYX, LOGO_STUDIO, LOGO_SYMBOL, LOGO_VIEWBOX } from "../../brand/logo";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";
import type { LogoPart } from "./StaticLogo";

const DRIFT = [
  { x: -10, y: 12 },
  { x: 16, y: -12 },
  { x: -10, y: -14 },
  { x: 16, y: 12 },
  { x: -8, y: 0 },
] as const;

export function DecorativeLogo({
  part = "lockup",
  title,
  className,
}: {
  part?: LogoPart;
  title?: string;
  className?: string;
}) {
  const prefix = useLogoPrefix();
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { margin: "0px 0px -10% 0px" });
  const reduced = useReducedMotion();
  const run = inView && !reduced;
  const letters = part === "lockup" ? [...LOGO_CLYX, ...LOGO_STUDIO] : [];

  return (
    <svg ref={ref} viewBox={LOGO_VIEWBOX} className={className} direction="ltr" overflow="visible" {...svgLabel(title)}>
      <defs>
        <LogoGradients prefix={prefix} shapes={[...LOGO_SYMBOL, ...letters]} />
      </defs>
      {LOGO_SYMBOL.map((shape, index) => (
        <m.g
          key={shape.id}
          animate={
            run
              ? { x: [0, DRIFT[index].x, 0], y: [0, DRIFT[index].y, 0] }
              : { x: 0, y: 0 }
          }
          transition={
            run
              ? { duration: 9 + index * 1.3, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.6 }
          }
        >
          <LogoShapeElement shape={shape} prefix={prefix} />
        </m.g>
      ))}
      {letters.map((shape) => (
        <LogoShapeElement key={shape.id} shape={shape} prefix={prefix} />
      ))}
    </svg>
  );
}
