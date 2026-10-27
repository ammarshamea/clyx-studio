import { media } from "../../content/media";
import { useLanguage } from "../../i18n/LanguageProvider";
import { MaskText, Reveal } from "../ui/motion";
import { Picture } from "../ui/Picture";

export function Vision() {
  const { copy } = useLanguage();
  const vision = copy.vision;

  return (
    <section id="vision" className="relative overflow-hidden border-t border-ivory/10 bg-surface" aria-labelledby="vision-title">
      <div className="shell section-y">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <figure className="lg:col-span-5">
            <div className="media-frame media-frame--portrait">
              <Picture
                image={media.mission}
                sizes="(min-width: 1024px) 36vw, 100vw"
                className="block h-full w-full"
                imgClassName="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-xs text-muted">{copy.imagery}</figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="vision-title" className="eyebrow flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-8 bg-magenta" />
              {vision.label}
            </h2>

            <div className="mt-12">
              <p className="text-sm text-magenta-light">{vision.visionLabel}</p>
              <MaskText as="p" text={vision.vision} className="display mt-4 text-[clamp(2rem,4.2vw,3.6rem)]" />
            </div>

            <div className="fragment-rule my-14 w-40" aria-hidden />

            <Reveal>
              <p className="text-sm text-magenta-light">{vision.missionLabel}</p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ivory/85 md:text-xl">{vision.mission}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
