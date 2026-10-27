import { useReducedMotion } from "framer-motion";
import { DecorativeLogo } from "./DecorativeLogo";
import { HeroLogo, type HeroLogoProps } from "./HeroLogo";
import { IntroLogo, type IntroLogoProps } from "./IntroLogo";
import { StaticLogo, type LogoPart } from "./StaticLogo";

type Shared = { title?: string; className?: string };

export type ClyxAnimatedLogoProps =
  | ({ mode: "intro" } & IntroLogoProps)
  | ({ mode: "hero" } & HeroLogoProps)
  | ({ mode: "decorative" | "static" | "reduced"; part?: LogoPart; crop?: boolean } & Shared);

/**
 * intro: five symbol shapes and ten letters assemble, each on its own timing.
 * hero: the top clapper arm swings open, then snaps onto the static lower board.
 * decorative: slow drift of the symbol shapes while in view.
 * static / reduced: the original artwork with no motion.
 */
export function ClyxAnimatedLogo(props: ClyxAnimatedLogoProps) {
  const prefersReduced = useReducedMotion();

  switch (props.mode) {
    case "intro":
      return prefersReduced ? (
        <StaticLogo part="lockup" title={props.title} className={props.className} />
      ) : (
        <IntroLogo {...props} />
      );
    case "hero":
      return prefersReduced ? (
        <StaticLogo part="symbol" title={props.title} className={props.className} />
      ) : (
        <HeroLogo {...props} />
      );
    case "decorative":
      return prefersReduced ? (
        <StaticLogo part={props.part} title={props.title} className={props.className} />
      ) : (
        <DecorativeLogo part={props.part} title={props.title} className={props.className} />
      );
    default:
      return <StaticLogo part={props.part} crop={props.crop} title={props.title} className={props.className} />;
  }
}
