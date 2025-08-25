import { ButtonTemplate, VocabularyItem } from "../../types";
import { HOME_VOCABULARY } from "./home";
import { KITCHEN_VOCABULARY } from "./kitchen";
import { BATHROOM_VOCABULARY } from "./bathroom";
import { CLOTHING_VOCABULARY } from "./clothing";
import { FOOD_VOCABULARY } from "./food";
import { EMOTIONS_VOCABULARY } from "./emotions";
import { ROUTINES_VOCABULARY } from "./routines";
import { PLAY_VOCABULARY } from "./play";
import { ANIMALS_VOCABULARY } from "./animals";
import { COLORS_SHAPES_VOCABULARY } from "./colors-shapes";
import { NUMBERS_TIME_VOCABULARY } from "./numbers-time";
import { WEATHER_VOCABULARY } from "./weather";
import { SCHOOL_VOCABULARY } from "./school";
import { PRONOUNS_VOCABULARY } from "./pronouns";
import { VERBS_VOCABULARY } from "./verbs";
import { DESCRIPTORS_VOCABULARY } from "./descriptors";
import { SOCIAL_VOCABULARY } from "./social";
import { QUESTIONS_VOCABULARY } from "./questions";
import { PEOPLE_VOCABULARY } from "./people";
import { PLACES_VOCABULARY } from "./places";

// Category vocabulary mappings
const CATEGORY_VOCABULARY: { [key: string]: ButtonTemplate[] } = {
  home: HOME_VOCABULARY,
  kitchen: KITCHEN_VOCABULARY,
  bathroom: BATHROOM_VOCABULARY,
  clothing: CLOTHING_VOCABULARY,
  food: FOOD_VOCABULARY,
  emotions: EMOTIONS_VOCABULARY,
  routines: ROUTINES_VOCABULARY,
  play: PLAY_VOCABULARY,
  animals: ANIMALS_VOCABULARY,
  "colors-shapes": COLORS_SHAPES_VOCABULARY,
  "numbers-time": NUMBERS_TIME_VOCABULARY,
  weather: WEATHER_VOCABULARY,
  school: SCHOOL_VOCABULARY,
  pronouns: PRONOUNS_VOCABULARY,
  verbs: VERBS_VOCABULARY,
  descriptors: DESCRIPTORS_VOCABULARY,
  social: SOCIAL_VOCABULARY,
  questions: QUESTIONS_VOCABULARY,
  people: PEOPLE_VOCABULARY,
  places: PLACES_VOCABULARY,
};

// Get vocabulary for a specific category
export const getVocabularyForCategory = (
  categoryId: string
): ButtonTemplate[] => {
  return CATEGORY_VOCABULARY[categoryId] || [];
};

// Get vocabulary for multiple categories
export const getVocabularyForCategories = (
  categoryIds: string[]
): ButtonTemplate[] => {
  const vocabulary: ButtonTemplate[] = [];

  categoryIds.forEach((categoryId) => {
    const categoryVocab = getVocabularyForCategory(categoryId);
    vocabulary.push(...categoryVocab);
  });

  return vocabulary;
};

// Get all vocabulary
export const getAllVocabulary = (): ButtonTemplate[] => {
  const allVocabulary: ButtonTemplate[] = [];

  // Add all category vocabulary
  Object.values(CATEGORY_VOCABULARY).forEach((vocab) => {
    allVocabulary.push(...vocab);
  });

  return allVocabulary;
};

// Get vocabulary by subcategory
export const getVocabularyBySubCategory = (
  categoryId: string,
  subCategoryId: string
): ButtonTemplate[] => {
  const categoryVocab = getVocabularyForCategory(categoryId);
  return categoryVocab.filter((item) => item.subCategory === subCategoryId);
};

// Convert ButtonTemplate to VocabularyItem
export const convertToVocabularyItem = (
  template: ButtonTemplate
): VocabularyItem => ({
  id: template.id,
  text: template.text,
  message: template.message,
  twoWord: template.twoWord,
  isFavorite: false,
  category: template.category,
  color: template.color,
  size: "medium" as const,
  translations: template.translations,
});

// Get all vocabulary items (converted to VocabularyItem format)
export const getAllVocabularyItems = (): VocabularyItem[] => {
  return getAllVocabulary().map(convertToVocabularyItem);
};

// Get vocabulary items for specific categories
export const getVocabularyItemsForCategories = (
  categoryIds: string[]
): VocabularyItem[] => {
  return getVocabularyForCategories(categoryIds).map(convertToVocabularyItem);
};

// Check if a category has subcategories
export const hasSubCategories = (categoryId: string): boolean => {
  const categoryVocab = getVocabularyForCategory(categoryId);
  return categoryVocab.some((item) => item.subCategory);
};

// Get unique subcategories for a category
export const getSubCategories = (categoryId: string): string[] => {
  const categoryVocab = getVocabularyForCategory(categoryId);
  const subCategories = categoryVocab
    .map((item) => item.subCategory)
    .filter(
      (subCategory, index, arr) =>
        subCategory && arr.indexOf(subCategory) === index
    );

  return subCategories as string[];
};
