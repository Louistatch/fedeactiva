/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_FEDAPAY_PUBLIC_KEY: string
  readonly VITE_CINETPAY_PUBLIC_KEY: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_REPORTING: string
  readonly VITE_WIDGET_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
