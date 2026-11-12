/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** "true" publishes the Alias garage at /alias/. Unset = dev-only private preview. */
  readonly PUBLIC_ALIAS_GARAGE?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
