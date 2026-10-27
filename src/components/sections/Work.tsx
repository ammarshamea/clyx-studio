import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { media } from "../../content/media";
import { projects, type Project, type ProjectMedia } from "../../content/projects";
import { useLanguage, type Locale } from "../../i18n/LanguageProvider";
import { DURATION, EASE_OUT } from "../../motion/tokens";
import { Curtain, MaskText, Reveal, SectionLabel } from "../ui/motion";
import { Picture } from "../ui/Picture";

function MediaFrame({ item, locale, className }: { item: ProjectMedia; locale: Locale; className?: string }) {
  if (item.type === "video") {
    return (
      <video
        className={className}
        src={item.src}
        poster={item.poster}
        controls
        playsInline
        preload="metadata"
        aria-label={item.alt[locale]}
      />
    );
  }
  return <img className={className} src={item.src} alt={item.alt[locale]} loading="lazy" decoding="async" />;
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const { copy, locale } = useLanguage();
  return (
    <li className="group">
      <button type="button" onClick={onOpen} className="block w-full text-start" aria-label={`${copy.work.open}: ${project.title[locale]}`}>
        <div className="aspect-[16/10] overflow-hidden bg-surface">
          <MediaFrame
            item={{ ...project.cover, type: "image", src: project.cover.poster ?? project.cover.src }}
            locale={locale}
            className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
          />
        </div>
        <p className="mt-4 text-xs text-muted">{copy.work.categories[project.category]}</p>
        <p className="display mt-2 text-2xl md:text-3xl">{project.title[locale]}</p>
      </button>
    </li>
  );
}

function ProjectViewer({ index, onClose, onNext }: { index: number; onClose: () => void; onNext: () => void }) {
  const { copy, locale } = useLanguage();
  const reduced = useReducedMotion();
  const project = projects[index];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const root = document.documentElement;
    root.classList.add("menu-lock");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("menu-lock");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <m.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-night"
      initial={{ opacity: 0, y: reduced ? 0 : 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.reveal, ease: EASE_OUT }}
    >
      <div className="shell flex items-center justify-between py-5">
        <p className="text-xs text-muted">
          {copy.work.viewer.category}: {copy.work.categories[project.category]}
          {project.year ? ` · ${copy.work.viewer.year}: ${project.year}` : ""}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="min-h-11 px-2 text-sm">
          {copy.work.viewer.close}
        </button>
      </div>
      <MediaFrame item={project.cover} locale={locale} className="aspect-video w-full object-cover" />
      <div className="shell grid gap-10 py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="project-title" className="display text-[clamp(2.4rem,6vw,5rem)]">
            {project.title[locale]}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ivory/80">{project.description[locale]}</p>
        </div>
        {project.credits.length ? (
          <dl className="grid content-start gap-4 lg:col-span-4 lg:col-start-9">
            {project.credits.map((credit) => (
              <div key={credit.label.en} className="border-t border-ivory/10 pt-3">
                <dt className="text-xs text-muted">{credit.label[locale]}</dt>
                <dd className="mt-1">{credit.value[locale]}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {project.gallery.length ? (
        <section aria-label={copy.work.viewer.gallery} className="shell grid gap-4 pb-16 sm:grid-cols-2">
          {project.gallery.map((item) => (
            <MediaFrame key={item.src} item={item} locale={locale} className="aspect-[16/10] w-full object-cover" />
          ))}
        </section>
      ) : null}
      {projects.length > 1 ? (
        <div className="shell border-t border-ivory/10 py-10">
          <button type="button" onClick={onNext} className="display text-3xl">
            {copy.work.viewer.next}: {projects[(index + 1) % projects.length].title[locale]}
          </button>
        </div>
      ) : null}
    </m.div>
  );
}

export function Work() {
  const { copy } = useLanguage();
  const work = copy.work;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const open = (index: number) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setOpenIndex(index);
  };
  const close = useCallback(() => {
    setOpenIndex(null);
    returnFocus.current?.focus();
  }, []);

  return (
    <section id="work" className="border-t border-ivory/10" aria-labelledby="work-title">
      <div className="shell section-y">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SectionLabel>{work.label}</SectionLabel>
          <MaskText as="h2" id="work-title" text={work.title} className="display mt-6 text-[clamp(2.4rem,5.6vw,5rem)]" />
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="leading-relaxed text-ivory/75">{work.body}</p>
        </Reveal>
      </div>

      <figure className="mt-16">
        <Curtain className="media-frame media-frame--banner sm:aspect-[2.2/1]">
          <Picture
            image={media.showreel}
            sizes="100vw"
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
          <p className="eyebrow absolute bottom-6 text-ivory/85 start-6 md:bottom-10 md:start-10">{work.reelLabel}</p>
        </Curtain>
        <figcaption className="mt-3 text-xs text-muted">{copy.imagery}</figcaption>
      </figure>

      {projects.length ? (
        <ul className="mt-20 grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} onOpen={() => open(index)} />
          ))}
        </ul>
      ) : null}
      </div>

      <AnimatePresence>
        {openIndex !== null ? (
          <ProjectViewer
            key="viewer"
            index={openIndex}
            onClose={close}
            onNext={() => setOpenIndex((current) => ((current ?? 0) + 1) % projects.length)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}