import { EN_TRANSLATIONS } from "./en";
import { HI_TRANSLATIONS } from "./hi";
import { ES_TRANSLATIONS } from "./es";
import { FR_TRANSLATIONS } from "./fr";
import { ZH_TRANSLATIONS } from "./zh";

export const TRANSLATIONS = {
  en: EN_TRANSLATIONS,
  hi: HI_TRANSLATIONS,
  es: ES_TRANSLATIONS,
  fr: FR_TRANSLATIONS,
  zh: ZH_TRANSLATIONS,
};

export type LanguageCode = keyof typeof TRANSLATIONS;

export const getTranslation = (key: string, language: LanguageCode): string => {
  const translations = TRANSLATIONS[language];
  return translations[key as keyof typeof translations] || key;
};

export const getTranslationsForWord = (wordId: string) => {
  return {
    en: getTranslation(wordId, "en"),
    hi: getTranslation(wordId, "hi"),
    es: getTranslation(wordId, "es"),
    fr: getTranslation(wordId, "fr"),
    zh: getTranslation(wordId, "zh"),
  };
};
