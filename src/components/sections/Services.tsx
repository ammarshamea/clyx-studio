import { m, useReducedMotion } from "framer-motion";
import { serviceMedia } from "../../content/media";
import { useLanguage } from "../../i18n/LanguageProvider";
import type { Dictionary } from "../../i18n/types";
import { EASE_OUT } from "../../motion/tokens";
import { Curtain, MaskText, Reveal, SectionLabel } from "../ui/motion";
import { Picture } from "../ui/Picture";

type Service = Dictionary["services"]["items"][number];

function ServiceBand({ service, cta }: { service: Service; cta: string }) {
  const reduced = useReducedMotion();
  return (
    <li className="group border-t border-ivory/10 pt-10 md:pt-14">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="flex items-start gap-6">
            <m.span
              aria-hidden
              dir="ltr"
              className="font-latin text-[clamp(4rem,10vw,8.5rem)] leading-none font-semibold text-transparent [-webkit-text-stroke:1px_rgba(245,242,245,0.28)] transition-colors duration-500 group-hover:[-webkit-text-stroke:1px_#c0559b]"
              initial={reduced ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -15% 0px" }}
              transition={{ duration: 0.9, ease: EASE_OUT }}
            >
              {service.no}
            </m.span>
          </div>
          <MaskText as="h3" text={service.title} className="display mt-6 text-[clamp(1.9rem,3.6vw,3rem)]" />
          <Reveal>
            <p className="mt-5 max-w-md leading-relaxed text-ivory/80">{service.body}</p>
          </Reveal>
          <a
            href="#contact"
            className="mt-8 inline-flex min-h-11 items-center gap-3 border-b border-ivory/25 text-sm text-ivory transition-colors duration-200 hover:border-magenta-light"
          >
            {cta}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
              →
            </span>
          </a>
        </div>

        <div className="lg:col-span-7">
          <Curtain className="media-frame media-frame--editorial">
            <Picture
              image={serviceMedia[service.id]}
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            />
          </Curtain>
          <ul className="mt-6 grid gap-x-8 gap-y-2 text-sm text-muted sm:grid-cols-2">
            {service.list.map((item) => (
              <li key={item} className="flex gap-3 border-b border-ivory/5 py-2">
                <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-magenta" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function Services() {
  const { copy } = useLanguage();
  const services = copy.services;

  return (
    <section id="services" aria-labelledby="services-title">
      <div className="shell section-y">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel>{services.label}</SectionLabel>
          <MaskText
            as="h2"
            id="services-title"
            text={services.title}
            className="display mt-6 text-[clamp(2.4rem,5.6vw,5rem)]"
          />
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="leading-relaxed text-ivory/75">{services.body}</p>
        </Reveal>
      </div>

      <ol className="mt-20 grid gap-20 md:gap-28">
        {services.items.map((service) => (
          <ServiceBand key={service.id} service={service} cta={services.cta} />
        ))}
      </ol>
      <p className="mt-10 text-xs text-muted">{copy.imagery}</p>
      </div>
    </section>
  );
}
