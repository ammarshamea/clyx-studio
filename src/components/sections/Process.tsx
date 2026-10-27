import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { stepMedia } from "../../content/media";
import { useLanguage } from "../../i18n/LanguageProvider";
import { EASE_OUT } from "../../motion/tokens";
import { MaskText, Reveal, SectionLabel } from "../ui/motion";
import { Picture } from "../ui/Picture";

export function Process() {
  const { copy } = useLanguage();
  const process = copy.process;
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const line = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0, 1]);

  return (
    <section
      id="process"
      className="border-t border-ivory/10 bg-surface"
      aria-labelledby="process-title"
    >
      <div className="shell section-y">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel>{process.label}</SectionLabel>
          <MaskText as="h2" id="process-title" text={process.title} className="display mt-6 text-[clamp(2.4rem,5.6vw,5rem)]" />
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-lg text-ivory/75">{process.body}</p>
        </Reveal>
      </div>

      <ol ref={listRef} className="relative mt-20 grid gap-16 ps-10 md:gap-24 md:ps-20">
        <span aria-hidden className="absolute inset-y-0 w-px bg-ivory/10 start-3 md:start-6" />
        <m.span
          aria-hidden
          className="absolute inset-y-0 w-px origin-top bg-gradient-to-b from-magenta-light to-magenta start-3 md:start-6"
          style={{ scaleY: line }}
        />
        {process.steps.map((step, index) => (
          <li key={step.id} className="relative grid items-center gap-8 md:grid-cols-12 md:gap-10">
            <m.span
              aria-hidden
              className="absolute top-2 -ms-[2.1rem] block h-3 w-3 rotate-45 border border-magenta-light bg-surface md:-ms-[3.85rem]"
              initial={reduced ? false : { scale: 0.2, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "0px 0px -30% 0px" }}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            />
            <div className={`md:col-span-5 ${index % 2 ? "md:order-2 md:col-start-8" : ""}`}>
              <p className="text-xs text-magenta-light" dir="ltr">
                {step.no}
              </p>
              <h3 className="display mt-3 text-3xl md:text-4xl">{step.title}</h3>
              <Reveal>
                <p className="mt-4 max-w-md leading-relaxed text-ivory/80">{step.body}</p>
              </Reveal>
            </div>
            <m.div
              className={`overflow-hidden md:col-span-6 ${index % 2 ? "md:order-1" : "md:col-start-7"}`}
              initial={reduced ? false : { opacity: 0.25 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: "-30% 0px -30% 0px" }}
              transition={{ duration: 0.6 }}
            >
              <Picture
                image={stepMedia[step.id]}
                sizes="(min-width: 768px) 45vw, 100vw"
                className="media-frame media-frame--editorial"
                imgClassName="h-full w-full object-cover"
              />
            </m.div>
          </li>
        ))}
      </ol>
      <p className="mt-12 text-xs text-muted">{copy.imagery}</p>
      </div>
    </section>
  );
}
