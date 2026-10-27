import type { ServiceId, StepId } from "../content/media";
import type { ProjectCategory } from "../content/projects";

export type SectionId = "about" | "services" | "work" | "process" | "contact";

export type Dictionary = {
  meta: { title: string; description: string };
  brand: string;
  skip: string;
  menu: string;
  close: string;
  navLabel: string;
  languageLabel: string;
  nav: Record<SectionId, string> & { start: string };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primary: string;
    secondary: string;
    scroll: string;
  };
  imagery: string;
  about: {
    label: string;
    title: string;
    paragraphs: string[];
    points: { title: string; body: string }[];
  };
  vision: {
    label: string;
    visionLabel: string;
    vision: string;
    missionLabel: string;
    mission: string;
  };
  services: {
    label: string;
    title: string;
    body: string;
    cta: string;
    items: { id: ServiceId; no: string; title: string; body: string; list: string[] }[];
  };
  work: {
    label: string;
    title: string;
    body: string;
    reelLabel: string;
    categories: Record<ProjectCategory, string>;
    open: string;
    viewer: { close: string; next: string; category: string; year: string; gallery: string };
  };
  process: {
    label: string;
    title: string;
    body: string;
    steps: { id: StepId; no: string; title: string; body: string }[];
  };
  approach: {
    label: string;
    title: string;
    values: { title: string; body: string }[];
  };
  clients: { label: string; title: string };
  contact: {
    label: string;
    title: string;
    body: string;
    form: {
      name: string;
      email: string;
      company: string;
      service: string;
      servicePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      submit: string;
      required: string;
      errors: {
        name: string;
        email: string;
        service: string;
        description: string;
        summary: string;
      };
      opened: string;
      notConfigured: string;
      subject: string;
      bodyLabels: { name: string; email: string; company: string; service: string };
    };
  };
  footer: {
    tagline: string;
    studio: string;
    services: string;
    contact: string;
    back: string;
    rights: string;
  };
};
