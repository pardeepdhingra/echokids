export interface VocabularyItem {
  id: string;
  text: string;
  message?: string;
  image?: string;
  isFavorite: boolean;
  category?: string;
  color?: string;
  size?: "small" | "medium" | "large";
  position?: { x: number; y: number };
}

export interface AppSettings {
  gridSize: number;
  ttsVoice: string;
  volume: number;
  speechRate: number;
  buttonMode: "one-word" | "sentence";
  showText: boolean;
  theme: "default" | "colorful" | "minimal";
  enableChildFilter: boolean;
  textSize: "small" | "medium" | "large";
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
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
  image?: string;
  color: string;
}
