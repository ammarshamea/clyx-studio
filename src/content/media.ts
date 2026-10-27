export type ImageAsset = {
  png: string;
  webp: string;
  width: number;
  height: number;
};

const FOLDER = `${import.meta.env.BASE_URL}images/clyx`;

function image(name: string, width: number, height: number): ImageAsset {
  const small = Math.round((width * 960) / Math.max(width, height));
  return {
    png: `${FOLDER}/${name}.png`,
    webp: `${FOLDER}/${name}-960.webp ${small}w, ${FOLDER}/${name}-1672.webp ${width}w`,
    width,
    height,
  };
}

/** Placement follows CLYX-STUDIO-ASSET-GUIDE.md. All are illustrative brand artwork. */
export const media = {
  hero: image("clyx-hero", 1672, 941),
  heroMobile: image("clyx-mobile-hero", 941, 1672),
  about: image("clyx-about", 1536, 1024),
  vision: image("clyx-vision", 1536, 1024),
  mission: image("clyx-mission", 1672, 940),
  film: image("clyx-film", 1672, 941),
  events: image("clyx-events", 1672, 941),
  post: image("clyx-post", 1672, 941),
  ai: image("clyx-ai-production", 1672, 941),
  preproduction: image("clyx-preproduction", 1536, 1024),
  delivery: image("clyx-delivery", 1536, 1024),
  showreel: image("clyx-showreel", 1672, 941),
  contact: image("clyx-contact", 1672, 941),
} as const;

export type ServiceId = "film" | "events" | "post" | "ai";
export type StepId = "pre" | "production" | "post" | "delivery";

export const serviceMedia: Record<ServiceId, ImageAsset> = {
  film: media.film,
  events: media.events,
  post: media.post,
  ai: media.ai,
};

export const stepMedia: Record<StepId, ImageAsset> = {
  pre: media.preproduction,
  production: media.film,
  post: media.post,
  delivery: media.delivery,
};
