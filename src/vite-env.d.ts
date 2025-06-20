/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 