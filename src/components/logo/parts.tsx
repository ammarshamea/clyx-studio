import { useId } from "react";
import type { LogoShape } from "../../brand/logo";

export function useLogoPrefix() {
  return `clyx${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
}

export function fillId(prefix: string, shape: LogoShape) {
  return `${prefix}-${shape.id}`;
}

export function LogoGradients({ prefix, shapes }: { prefix: string; shapes: readonly LogoShape[] }) {
  return (
    <>
      {shapes.map((shape) => {
        const { x1, y1, x2, y2, stops } = shape.gradient;
        return (
          <linearGradient
            key={shape.id}
            id={fillId(prefix, shape)}
            gradientUnits="userSpaceOnUse"
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
          >
            {stops.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        );
      })}
    </>
  );
}

export function LogoShapeElement({ shape, prefix }: { shape: LogoShape; prefix?: string }) {
  const fill = prefix ? `url(#${fillId(prefix, shape)})` : undefined;
  return shape.tag === "path" ? (
    <path d={shape.geometry} fill={fill} />
  ) : (
    <polygon points={shape.geometry} fill={fill} />
  );
}

export function svgLabel(title?: string) {
  return title
    ? ({ role: "img", "aria-label": title } as const)
    : ({ "aria-hidden": true, focusable: false } as const);
}
