import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { DOCUMENT } from "@angular/common";
import { isPlatformBrowser } from "@angular/common";
import { LangKeysContract, LocalizationData, SupportedLanguage } from "@/types/localization.types";

@Injectable({
  providedIn: "root",
})
export class LocalService {
  private readonly document = inject(DOCUMENT);
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly currentLang = signal<SupportedLanguage>("en");
  private readonly localizationData = signal<LocalizationData>({});
  private readonly langChangeSubject = new BehaviorSubject<SupportedLanguage>("en");
  readonly langChange$ = this.langChangeSubject.asObservable();
  readonly locals = computed<LangKeysContract>(() => {
    const data = this.localizationData();
    const lang = this.currentLang();

    return Object.keys(data).reduce((acc, key) => {
      acc[key as keyof LangKeysContract] = data[key]?.[lang] || this.getMissingKeyFallback(key);
      return acc;
    }, {} as LangKeysContract);
  });
  readonly localChange = this.currentLang;

  constructor() {
    effect(() => {
      const lang = this.currentLang();
      this.updateDocumentAttributes(lang);
    });
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem("app_language") as SupportedLanguage;
      if (savedLang && (savedLang === "en" || savedLang === "ar")) {
        this.setLanguage(savedLang);
      }
    }
  }

  /**
   * Loads translations from the JSON file
   */
  async loadTranslations(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<LocalizationData>("assets/resources/locals.json"));
      this.localizationData.set(data);
    } catch (error) {
      console.error("Failed to load translations:", error);
    }
  }

  /**
   * Sets the current language
   * @param lang The language to set
   * @param reload Whether to reload translations
   */
  setLanguage(lang: SupportedLanguage): void {
    this.currentLang.set(lang);
    this.langChangeSubject.next(lang);
    localStorage.setItem("app_language", lang);
  }

  /**
   * Toggles between supported languages
   */
  toggleLanguage(): void {
    const newLang = this.currentLang() === "en" ? "ar" : "en";
    this.setLanguage(newLang);
  }

  /**
   * Gets the current language
   */
  getCurrentLanguage(): SupportedLanguage {
    return this.currentLang();
  }

  /**
   * Updates document attributes based on language
   * @param lang The language to set
   */
  private updateDocumentAttributes(lang: SupportedLanguage): void {
    this.document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    this.document.documentElement.lang = lang;
    if (lang === "ar") {
      this.document.body.classList.add("rtl");
    } else {
      this.document.body.classList.remove("rtl");
    }
  }

  /**
   * Gets a fallback for missing keys
   * @param key The missing key
   */
  private getMissingKeyFallback(key: string): string {
    return `[MISSING KEY]: ${key}`;
  }

  /**
   * Interpolates a localized string with dynamic placeholders like {{item}}
   * @param key The localization key (must exist in locals)
   * @param params A map of variables to replace in the string
   * @returns The interpolated localized string
   */
  interpolate(key: keyof LangKeysContract, params: Record<string, string | number>): string {
    const template = this.locals()[key] || this.getMissingKeyFallback(key);
    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      const localizedValue = typeof paramValue === "string" && this.locals()[paramValue as keyof LangKeysContract] ? this.locals()[paramValue as keyof LangKeysContract] : paramValue;

      return acc.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, "g"), String(localizedValue));
    }, template);
  }
}
