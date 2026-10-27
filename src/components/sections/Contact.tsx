import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { media } from "../../content/media";
import { useLanguage } from "../../i18n/LanguageProvider";
import { MaskText, Reveal, SectionLabel } from "../ui/motion";
import { Picture } from "../ui/Picture";

type Field = "name" | "email" | "company" | "service" | "description";
type Values = Record<Field, string>;
type Errors = Partial<Record<Exclude<Field, "company">, string>>;
type Status = "idle" | "opened" | "notConfigured";

const EMPTY: Values = { name: "", email: "", company: "", service: "", description: "" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const INBOX = import.meta.env.VITE_CONTACT_EMAIL?.trim();

const control =
  "mt-2 block min-h-12 w-full border-0 border-b border-ivory/20 bg-transparent px-0 py-3 text-base text-ivory placeholder:text-muted/70 focus:border-magenta-light focus:outline-none aria-[invalid=true]:border-red-400";

export function Contact() {
  const { copy } = useLanguage();
  const contact = copy.contact;
  const form = contact.form;
  const uid = useId();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const fieldId = (field: Field) => `${uid}-${field}`;

  const validate = (next: Values): Errors => {
    const found: Errors = {};
    if (next.name.trim().length < 2) found.name = form.errors.name;
    if (!EMAIL.test(next.email.trim())) found.email = form.errors.email;
    if (!next.service) found.service = form.errors.service;
    if (next.description.trim().length < 20) found.description = form.errors.description;
    return found;
  };

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setStatus("idle");
    if (field !== "company" && errors[field]) setErrors(validate(next));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      setStatus("idle");
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }
    if (!INBOX) {
      setStatus("notConfigured");
      return;
    }
    const labels = form.bodyLabels;
    const service = copy.services.items.find((item) => item.id === values.service)?.title ?? values.service;
    const company = values.company.trim();
    const body = [
      `${labels.name}: ${values.name.trim()}`,
      `${labels.email}: ${values.email.trim()}`,
      ...(company ? [`${labels.company}: ${company}`] : []),
      `${labels.service}: ${service}`,
      "",
      values.description.trim(),
    ].join("\n");
    window.location.href = `mailto:${INBOX}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`;
    setStatus("opened");
  };

  useEffect(() => {
    if (status !== "idle") summaryRef.current?.focus();
  }, [status]);

  const errorCount = Object.keys(errors).length;
  const describe = (field: Exclude<Field, "company">) => (errors[field] ? `${fieldId(field)}-error` : undefined);
  const errorText = (field: Exclude<Field, "company">) =>
    errors[field] ? (
      <p id={`${fieldId(field)}-error`} className="mt-2 text-sm text-red-300">
        {errors[field]}
      </p>
    ) : null;
  const label = (field: Field, text: string, required: boolean) => (
    <label htmlFor={fieldId(field)} className="flex items-baseline justify-between gap-4 text-sm text-ivory/80">
      <span>{text}</span>
      {required ? <span className="text-xs text-muted">{form.required}</span> : null}
    </label>
  );

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-ivory/10"
      aria-labelledby="contact-title"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        <Picture image={media.contact} sizes="100vw" className="block h-full w-full" imgClassName="h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/85 to-night" />
      </div>

      <div className="shell section-y grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel>{contact.label}</SectionLabel>
          <MaskText as="h2" id="contact-title" text={contact.title} className="display mt-6 text-[clamp(2.4rem,5.6vw,5rem)]" />
          <Reveal>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/75">{contact.body}</p>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-6 lg:col-start-7">
          <form noValidate onSubmit={submit} className="grid gap-8 sm:grid-cols-2">
            <div aria-live="polite" className="sm:col-span-2 empty:hidden">
              {errorCount ? (
                <p className="border-s-2 border-red-400 ps-4 text-sm text-red-200">{form.errors.summary}</p>
              ) : null}
              {status !== "idle" ? (
                <p
                  ref={summaryRef}
                  tabIndex={-1}
                  className={`border-s-2 ps-4 text-sm ${status === "opened" ? "border-magenta-light text-ivory" : "border-muted text-ivory/80"}`}
                >
                  {status === "opened" ? form.opened : form.notConfigured}
                </p>
              ) : null}
            </div>

            <div>
              {label("name", form.name, true)}
              <input
                id={fieldId("name")}
                name="name"
                autoComplete="name"
                required
                value={values.name}
                onChange={(event) => update("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={describe("name")}
                className={control}
              />
              {errorText("name")}
            </div>

            <div>
              {label("email", form.email, true)}
              <input
                id={fieldId("email")}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                required
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describe("email")}
                className={`${control} rtl:text-right`}
              />
              {errorText("email")}
            </div>

            <div>
              {label("company", form.company, false)}
              <input
                id={fieldId("company")}
                name="company"
                autoComplete="organization"
                value={values.company}
                onChange={(event) => update("company", event.target.value)}
                className={control}
              />
            </div>

            <div>
              {label("service", form.service, true)}
              <select
                id={fieldId("service")}
                name="service"
                required
                value={values.service}
                onChange={(event) => update("service", event.target.value)}
                aria-invalid={Boolean(errors.service)}
                aria-describedby={describe("service")}
                className={`${control} cursor-pointer [&>option]:bg-surface`}
              >
                <option value="" disabled>
                  {form.servicePlaceholder}
                </option>
                {copy.services.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
              {errorText("service")}
            </div>

            <div className="sm:col-span-2">
              {label("description", form.description, true)}
              <textarea
                id={fieldId("description")}
                name="description"
                required
                rows={5}
                placeholder={form.descriptionPlaceholder}
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={describe("description")}
                className={`${control} resize-y`}
              />
              {errorText("description")}
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="group inline-flex min-h-12 items-center gap-3 bg-magenta px-7 text-sm font-medium text-ivory transition-colors duration-300 hover:bg-magenta-light"
              >
                {form.submit}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1">
                  →
                </span>
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
