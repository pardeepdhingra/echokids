export interface VocabularyItem {
  id: string;
  text: string;
  message?: string;
  twoWord?: string;
  image?: string;
  isFavorite: boolean;
  category?: string;
  subCategory?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  position?: { x: number; y: number };
  translations?: {
    en: string;
    hi: string;
    es: string;
    fr: string;
    zh: string;
  };
}

export interface AppSettings {
  gridSize: number;
  ttsVoice: string;
  volume: number;
  speechRate: number;
  buttonMode: "one-word" | "two-word" | "sentence";
  showText: boolean;
  theme: "default" | "colorful" | "minimal";
  enableChildFilter: boolean;
  textSize: "small" | "medium" | "large";
  hiddenCategories: string[];
  childAge?: number;
  hasShownAgePrompt?: boolean;
  symbolType: "emoji" | "mulberry";
  language: "en" | "hi" | "es" | "fr" | "zh";
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CategoryWithSubs extends Category {
  subCategories?: SubCategory[];
  parentCategory?: string;
}

export interface AppState {
  vocabulary: VocabularyItem[];
  favorites: VocabularyItem[];
  settings: AppSettings;
  categories: Category[];
}

export interface ButtonTemplate {
  id: string;
  text: string;
  message: string;
  category: string;
  subCategory?: string;
  color: string;
  image?: string;
  twoWord?: string;
  translations?: {
    en: string;
    hi: string;
    es: string;
    fr: string;
    zh: string;
  };
}
