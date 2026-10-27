import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE_IN_OUT, EASE_OUT, STAGGER } from "../../motion/tokens";

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.reveal, delay, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}

/** Word-masked heading reveal. Words stay whole, so Arabic letter joining is never broken. */
export function MaskText({
  text,
  as: Tag = "h2",
  id,
  className,
  delay = 0,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  const Heading = MASK_TAGS[Tag];
  return (
    <Heading
      id={id}
      className={className}
      initial={reduced ? false : "hidden"}
      whileInView="shown"
      viewport={VIEWPORT}
      custom={delay}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, index) => (
          <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <m.span className="inline-block" variants={WORD} custom={delay + index * STAGGER.tight}>
              {word}
            </m.span>
            {index < words.length - 1 ? "\u00a0" : null}
          </span>
        ))}
      </span>
    </Heading>
  );
}

const MASK_TAGS = { h1: m.h1, h2: m.h2, h3: m.h3, p: m.p } as const;

/** The heading is observed, not the words: a word starts clipped by its mask and would never intersect. */
const WORD = {
  hidden: { y: "110%" },
  shown: (delay: number) => ({ y: "0%", transition: { duration: DURATION.reveal, delay, ease: EASE_OUT } }),
};

/** Image reveal with a curtain that slides off toward the reading end. */
export function Curtain({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <m.div
        className="h-full w-full"
        initial={reduced ? false : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.2, ease: EASE_OUT }}
      >
        {children}
      </m.div>
      {reduced ? null : (
        <m.div
          aria-hidden
          className="absolute inset-0 origin-[100%_50%] bg-night rtl:origin-[0%_50%]"
          initial={{ scaleX: 1 }}
          whileInView={{ scaleX: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.9, ease: EASE_IN_OUT }}
        />
      )}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3">
      <span aria-hidden className="inline-block h-px w-8 bg-magenta" />
      {children}
    </p>
  );
}
