export interface LangKeysContract {
  send: string;
}

export type SupportedLanguage = "en" | "ar";

export interface LocalizationEntry {
  ar: string;
  en: string;
}

export interface LocalizationData {
  [key: string]: LocalizationEntry;
}
