import { LOGO_CLYX, LOGO_STUDIO, LOGO_SYMBOL, LOGO_VIEWBOX, SYMBOL_VIEWBOX } from "../../brand/logo";
import { LogoGradients, LogoShapeElement, svgLabel, useLogoPrefix } from "./parts";

export type LogoPart = "lockup" | "symbol";

export type StaticLogoProps = {
  part?: LogoPart;
  crop?: boolean;
  title?: string;
  className?: string;
};

export function StaticLogo({ part = "lockup", crop = false, title, className }: StaticLogoProps) {
  const prefix = useLogoPrefix();
  const shapes = part === "lockup" ? [...LOGO_SYMBOL, ...LOGO_CLYX, ...LOGO_STUDIO] : LOGO_SYMBOL;
  return (
    <svg
      viewBox={crop && part === "symbol" ? SYMBOL_VIEWBOX : LOGO_VIEWBOX}
      className={className}
      direction="ltr"
      {...svgLabel(title)}
    >
      <defs>
        <LogoGradients prefix={prefix} shapes={shapes} />
      </defs>
      {shapes.map((shape) => (
        <LogoShapeElement key={shape.id} shape={shape} prefix={prefix} />
      ))}
    </svg>
  );
}
