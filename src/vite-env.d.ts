/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly AI_API_KEY?: string;
  readonly AI_MODEL?: string;
  readonly AI_PROVIDER?: string;
  readonly MAPS_API_KEY?: string;
  readonly WEATHER_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
