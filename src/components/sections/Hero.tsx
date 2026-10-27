import { m, useReducedMotion } from "framer-motion";
import { useRef, type RefObject } from "react";
import { media } from "../../content/media";
import { useLanguage } from "../../i18n/LanguageProvider";
import { DURATION, EASE_OUT } from "../../motion/tokens";
import { ClyxAnimatedLogo } from "../logo/ClyxAnimatedLogo";
import { Picture } from "../ui/Picture";

type Props = {
  markRef: RefObject<HTMLDivElement | null>;
  live: boolean;
  markVisible: boolean;
};

export function Hero({ markRef, live, markVisible }: Props) {
  const { copy, dir } = useLanguage();
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const hidden = reduced ? { opacity: 0 } : { opacity: 0, y: 28 };
  const shown = live ? { opacity: 1, y: 0 } : hidden;
  const reveal = { duration: DURATION.reveal, ease: EASE_OUT };

  const text = (
    <div dir={dir} className="hero-copy min-w-0">
      <m.p className="eyebrow flex items-center gap-3 text-[0.82rem]" initial={hidden} animate={shown} transition={{ ...reveal, delay: 0.04 }}>
        <span aria-hidden className="inline-block h-px w-8 bg-magenta" />
        {copy.hero.eyebrow}
      </m.p>
      <m.h1
        id="hero-title"
        className="display mt-5 text-[clamp(2.75rem,6.4vw,5.4rem)]"
        initial={hidden}
        animate={shown}
        transition={{ ...reveal, delay: 0.12 }}
      >
        {copy.hero.title}
      </m.h1>
      <m.p
        className="mt-6 max-w-xl text-lg leading-relaxed text-ivory/80 md:text-xl"
        initial={hidden}
        animate={shown}
        transition={{ ...reveal, delay: 0.22 }}
      >
        {copy.hero.body}
      </m.p>
      <m.div className="mt-9 flex flex-wrap gap-3" initial={hidden} animate={shown} transition={{ ...reveal, delay: 0.32 }}>
        <a href="#work" className="cta group gap-3 bg-magenta text-ivory hover:bg-magenta-light">
          {copy.hero.primary}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
            →
          </span>
        </a>
        <a href="#contact" className="cta border border-ivory/35 text-ivory hover:border-ivory/80">
          {copy.hero.secondary}
        </a>
      </m.div>
    </div>
  );

  return (
    <section ref={sectionRef} id="top" className="hero relative overflow-hidden bg-night" aria-labelledby="hero-title">
      <div className="absolute inset-0">
        <div className="hero-stage">
          <Picture
            image={media.hero}
            portrait={media.heroMobile}
            priority
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover brightness-[0.5] saturate-[0.88]"
          />
          <div aria-hidden className="hero-soften">
            <Picture
              image={media.hero}
              portrait={media.heroMobile}
              priority
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
      <div className="hero-scrim absolute inset-0" />
      <div className="grain" />

      <div className="relative z-10 h-full">
        <div className="shell hero-split" dir="ltr">
          {text}
          <div ref={markRef} className="hero-mark" style={{ opacity: markVisible ? 1 : 0 }}>
            <ClyxAnimatedLogo mode="hero" live={markVisible} section={sectionRef} className="block h-full w-full" />
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-7 z-10 hidden flex-col items-center gap-3 text-xs text-muted end-[max(1.25rem,calc((100vw-80rem)/2+2.5rem))] wide:flex"
      >
        <span>{copy.hero.scroll}</span>
        <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-ivory/15">
          <span className="scroll-cue absolute inset-0 bg-ivory/70" />
        </span>
      </a>
    </section>
  );
}
