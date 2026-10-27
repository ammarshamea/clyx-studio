import { m, useReducedMotion } from "framer-motion";
import { useLanguage } from "../../i18n/LanguageProvider";
import { DURATION, EASE_OUT, STAGGER } from "../../motion/tokens";
import { Reveal, SectionLabel } from "../ui/motion";

export function Approach() {
  const { copy } = useLanguage();
  const approach = copy.approach;
  const reduced = useReducedMotion();

  return (
    <section id="approach" className="relative overflow-hidden border-t border-ivory/10" aria-labelledby="approach-title">
      <div className="shell section-y">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel>{approach.label}</SectionLabel>
            <Reveal>
              <h2 id="approach-title" className="display mt-6 max-w-3xl text-[clamp(2.4rem,5.6vw,5rem)]">
                {approach.title}
              </h2>
            </Reveal>
          </div>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden border border-ivory/10 bg-ivory/10 sm:grid-cols-2 lg:grid-cols-6">
          {approach.values.map((value, index) => (
            <li
              key={value.title}
              className={`group bg-night ${index < 3 ? "lg:col-span-2" : index === 4 ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-3"}`}
            >
              <m.article
                className="flex h-full min-h-[16.5rem] flex-col gap-6 px-7 py-9 md:min-h-[18rem] md:px-9 md:py-11"
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: DURATION.reveal, delay: index * STAGGER.tight, ease: EASE_OUT }}
              >
                <span className="text-xs tracking-[0.2em] text-magenta-light" dir="ltr">
                  {`0${index + 1}`}
                </span>
                <h3 className="display text-[clamp(1.9rem,3.2vw,2.85rem)] text-ivory transition-colors duration-500 group-hover:text-magenta-light">
                  {value.title}
                </h3>
                <span aria-hidden className="fragment-rule w-16 opacity-70" />
                <p className="max-w-md text-sm leading-relaxed text-ivory/75 md:text-base">{value.body}</p>
              </m.article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
