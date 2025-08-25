import { ButtonTemplate, VocabularyItem } from "../../types";
import { HOME_VOCABULARY } from "./home";
import { KITCHEN_VOCABULARY } from "./kitchen";
import { BATHROOM_VOCABULARY } from "./bathroom";
import { CLOTHING_VOCABULARY } from "./clothing";
import { FOOD_VOCABULARY } from "./food";
import { EMOTIONS_VOCABULARY } from "./emotions";

// Import existing vocabulary from the old system (legacy templates)
import { BUTTON_TEMPLATES } from "../legacy-templates";

// Category vocabulary mappings
const CATEGORY_VOCABULARY: { [key: string]: ButtonTemplate[] } = {
  home: HOME_VOCABULARY,
  kitchen: KITCHEN_VOCABULARY,
  bathroom: BATHROOM_VOCABULARY,
  clothing: CLOTHING_VOCABULARY,
  food: FOOD_VOCABULARY,
  emotions: EMOTIONS_VOCABULARY,
};

// Legacy vocabulary (from old system)
const LEGACY_VOCABULARY = BUTTON_TEMPLATES.filter(
  (template) =>
    !["home", "kitchen", "bathroom", "clothing", "food", "emotions"].includes(
      template.category
    )
);

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

// Get all vocabulary (new + legacy)
export const getAllVocabulary = (): ButtonTemplate[] => {
  const allVocabulary: ButtonTemplate[] = [];

  // Add new category vocabulary
  Object.values(CATEGORY_VOCABULARY).forEach((vocab) => {
    allVocabulary.push(...vocab);
  });

  // Add legacy vocabulary
  allVocabulary.push(...LEGACY_VOCABULARY);

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
