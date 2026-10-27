/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Studio inbox for the contact form mailto draft. Leave unset until a real address exists. */
  readonly VITE_CONTACT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
