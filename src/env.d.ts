interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  /** Hier kannst du deine Variablen definieren für IntelliSense */
  readonly NG_APP_SUPABASE_URL: string;
  readonly NG_APP_SUPABASE_PUBLIC_KEY: string;
}
