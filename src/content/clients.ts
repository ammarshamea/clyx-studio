export type Client = {
  name: string;
  /** Path under public/, monochrome or brand-consistent artwork supplied by the client. */
  logo: string;
  url?: string;
};

/** Verified CLYX clients only. The Clients section is left out of the page while this is empty. */
export const clients: readonly Client[] = [];
