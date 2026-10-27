import { clients } from "../../content/clients";
import { useLanguage } from "../../i18n/LanguageProvider";
import { MaskText, SectionLabel } from "../ui/motion";

/** Renders nothing until verified client logos are added to content/clients.ts. */
export function Clients() {
  const { copy } = useLanguage();
  if (!clients.length) return null;

  return (
    <section className="border-t border-ivory/10" aria-labelledby="clients-title">
      <div className="shell section-y">
      <SectionLabel>{copy.clients.label}</SectionLabel>
      <MaskText as="h2" id="clients-title" text={copy.clients.title} className="display mt-6 text-[clamp(2rem,4.5vw,3.8rem)]" />
      <ul className="mt-14 grid grid-cols-2 gap-px bg-ivory/10 sm:grid-cols-3 lg:grid-cols-5">
        {clients.map((client) => (
          <li key={client.name} className="flex aspect-[3/2] items-center justify-center bg-night p-8">
            <img
              src={client.logo}
              alt={client.name}
              loading="lazy"
              className="max-h-12 w-auto opacity-60 grayscale transition-opacity duration-300 hover:opacity-100"
            />
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
