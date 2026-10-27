import { media } from "../../content/media";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Curtain, MaskText, Reveal, SectionLabel } from "../ui/motion";
import { Picture } from "../ui/Picture";

export function About() {
  const { copy } = useLanguage();
  const about = copy.about;

  return (
    <section id="about" className="relative" aria-labelledby="about-title">
      <div className="shell section-y">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-10">
          <SectionLabel>{about.label}</SectionLabel>
          <MaskText
            as="h2"
            id="about-title"
            text={about.title}
            className="display mt-6 text-[clamp(2.2rem,5vw,4.4rem)]"
          />
          <div className="mt-10 grid max-w-xl gap-5 text-base leading-relaxed text-ivory/80 md:text-lg">
            {about.paragraphs.map((paragraph) => (
              <Reveal key={paragraph}>
                <p>{paragraph}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <figure className="lg:col-span-6">
          <Curtain className="media-frame media-frame--portrait md:aspect-[5/4] lg:aspect-[4/5]">
            <Picture
              image={media.about}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover object-[60%_50%]"
            />
          </Curtain>
          <figcaption className="mt-3 text-xs text-muted">{copy.imagery}</figcaption>
        </figure>
      </div>

      <ul className="mt-20 grid gap-px overflow-hidden border-y border-ivory/10 bg-ivory/10 md:grid-cols-3">
        {about.points.map((point, index) => (
          <li key={point.title} className="bg-night py-8 md:px-8 md:first:ps-0">
            <Reveal delay={index * 0.08}>
              <p className="text-xs text-magenta-light" dir="ltr">
                {`0${index + 1}`}
              </p>
              <h3 className="mt-4 text-xl font-medium">{point.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{point.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
