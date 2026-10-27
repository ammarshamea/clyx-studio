import { useLanguage } from "../../i18n/LanguageProvider";
import { ClyxAnimatedLogo } from "../logo/ClyxAnimatedLogo";
import { SECTIONS } from "../SiteHeader";

export function Footer() {
  const { copy } = useLanguage();
  const footer = copy.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-ivory/10 bg-surface">
      <div className="shell pt-20 pb-10">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ClyxAnimatedLogo mode="decorative" part="lockup" title={copy.brand} className="w-44 md:w-56" />
          <p className="display mt-8 max-w-sm text-2xl text-ivory/85">{footer.tagline}</p>
        </div>

        <nav aria-label={footer.studio} className="lg:col-span-2 lg:col-start-7">
          <p className="eyebrow">{footer.studio}</p>
          <ul className="mt-5 grid gap-2">
            {SECTIONS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="inline-flex min-h-10 items-center text-ivory/75 transition-colors hover:text-ivory">
                  {copy.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="eyebrow">{footer.services}</p>
          <ul className="mt-5 grid gap-2">
            {copy.services.items.map((item) => (
              <li key={item.id}>
                <a href="#services" className="inline-flex min-h-10 items-center text-ivory/75 transition-colors hover:text-ivory">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow">{footer.contact}</p>
          <a href="#contact" className="mt-5 inline-flex min-h-10 items-center text-ivory/75 transition-colors hover:text-ivory">
            {copy.nav.start}
          </a>
        </div>
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-ivory/10 pt-6 text-xs text-muted">
        <p>
          <span dir="ltr">© {year} CLYX STUDIO</span> · {footer.rights}
        </p>
        <a href="#top" className="group inline-flex min-h-11 items-center gap-2 text-ivory/75 hover:text-ivory">
          {footer.back}
          <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-1">
            ↑
          </span>
        </a>
      </div>
      </div>
    </footer>
  );
}
