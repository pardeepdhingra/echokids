import { ButtonTemplate } from "../types";

export const getTranslatedText = (
  template: ButtonTemplate,
  language: string
): string => {
  if (
    template.translations &&
    template.translations[language as keyof typeof template.translations]
  ) {
    return template.translations[
      language as keyof typeof template.translations
    ];
  }
  return template.text; // Fallback to English
};

export const getTranslatedMessage = (
  template: ButtonTemplate,
  language: string
): string => {
  // For now, return the original message
  // In the future, we can add message translations
  return template.message;
};
