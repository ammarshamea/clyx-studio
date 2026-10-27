export type Localized = { en: string; ar: string };

export type ProjectCategory = "commercials" | "corporate" | "events" | "motion" | "ai";

export type ProjectMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: Localized;
};

export type Project = {
  slug: string;
  title: Localized;
  category: ProjectCategory;
  year?: string;
  summary: Localized;
  description: Localized;
  cover: ProjectMedia;
  gallery: ProjectMedia[];
  credits: { label: Localized; value: Localized }[];
};

/**
 * Published CLYX work only. Each entry needs cleared media and approval from whoever
 * commissioned it. The Work section shows no project cards while this list is empty.
 */
export const projects: readonly Project[] = [];
