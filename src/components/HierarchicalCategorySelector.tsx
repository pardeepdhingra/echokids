import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category, CategoryWithSubs, SubCategory } from "../types";
import { CATEGORIES } from "../constants/categories";
import { COLORS } from "../constants";

interface HierarchicalCategorySelectorProps {
  visible: boolean;
  onClose: () => void;
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onSubCategoryToggle: (categoryId: string, subCategoryId: string) => void;
}

export const HierarchicalCategorySelector: React.FC<
  HierarchicalCategorySelectorProps
> = ({
  visible,
  onClose,
  selectedCategories,
  onCategoryToggle,
  onSubCategoryToggle,
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState<
    string | null
  >(null);

  const mainCategories = [
    {
      id: "core",
      name: "Core Communication",
      icon: "chatbubbles-outline",
      color: "#3498DB",
      categories: ["pronouns", "verbs", "descriptors", "social", "questions"],
    },
    {
      id: "daily-life",
      name: "Daily Life",
      icon: "home-outline",
      color: "#E67E22",
      categories: ["home", "kitchen", "bathroom", "clothing", "routines"],
    },
    {
      id: "food-drink",
      name: "Food & Drink",
      icon: "restaurant-outline",
      color: "#E74C3C",
      categories: ["food"],
    },
    {
      id: "activities",
      name: "Activities & Play",
      icon: "game-controller-outline",
      color: "#2ECC71",
      categories: ["play", "animals", "colors-shapes"],
    },
    {
      id: "learning",
      name: "Learning & School",
      icon: "school-outline",
      color: "#16A085",
      categories: ["school", "numbers-time"],
    },
    {
      id: "emotions",
      name: "Feelings & Emotions",
      icon: "heart-outline",
      color: "#F1C40F",
      categories: ["emotions"],
    },
    {
      id: "people-places",
      name: "People & Places",
      icon: "people-outline",
      color: "#4ECDC4",
      categories: ["people", "places"],
    },
    {
      id: "legacy",
      name: "Additional Categories",
      icon: "add-circle-outline",
      color: "#9B59B6",
      categories: ["needs", "activities", "weather"],
    },
  ];

  const getCategoryDetails = (
    categoryId: string
  ): CategoryWithSubs | undefined => {
    return CATEGORIES.find((cat) => cat.id === categoryId);
  };

  const getSelectedCount = (categoryIds: string[]): number => {
    return categoryIds.filter((id) => selectedCategories.includes(id)).length;
  };

  const renderMainCategory = (mainCategory: any) => {
    const selectedCount = getSelectedCount(mainCategory.categories);
    const totalCount = mainCategory.categories.length;

    return (
      <TouchableOpacity
        key={mainCategory.id}
        style={styles.mainCategoryButton}
        onPress={() => setSelectedMainCategory(mainCategory.id)}
      >
        <View style={styles.mainCategoryContent}>
          <View style={styles.mainCategoryIconContainer}>
            <Ionicons
              name={mainCategory.icon as any}
              size={24}
              color={mainCategory.color}
            />
          </View>
          <View style={styles.mainCategoryTextContainer}>
            <Text style={styles.mainCategoryName}>{mainCategory.name}</Text>
            <Text style={styles.mainCategorySubtext}>
              {selectedCount} of {totalCount} categories selected
            </Text>
          </View>
        </View>
        <View style={styles.mainCategoryArrow}>
          <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSubCategories = () => {
    if (!selectedMainCategory) return null;

    const mainCategory = mainCategories.find(
      (cat) => cat.id === selectedMainCategory
    );
    if (!mainCategory) return null;

    return (
      <View style={styles.subCategoriesContainer}>
        <View style={styles.subCategoriesHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedMainCategory(null)}
          >
            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
            <Text style={styles.backButtonText}>Back to Categories</Text>
          </TouchableOpacity>
          <Text style={styles.subCategoriesTitle}>{mainCategory.name}</Text>
        </View>

        <ScrollView style={styles.subCategoriesList}>
          {mainCategory.categories.map((categoryId) => {
            const category = getCategoryDetails(categoryId);
            if (!category) return null;

            const isSelected = selectedCategories.includes(categoryId);
            const hasSubCategories =
              category.subCategories && category.subCategories.length > 0;

            return (
              <View key={categoryId} style={styles.subCategoryItem}>
                <TouchableOpacity
                  style={[
                    styles.subCategoryButton,
                    isSelected && styles.subCategoryButtonSelected,
                  ]}
                  onPress={() => onCategoryToggle(categoryId)}
                >
                  <View style={styles.subCategoryContent}>
                    <View style={styles.subCategoryIconContainer}>
                      <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={category.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.subCategoryName,
                        isSelected && styles.subCategoryNameSelected,
                      ]}
                    >
                      {category.name}
                    </Text>
                  </View>
                  <View style={styles.subCategoryStatus}>
                    <Text
                      style={[
                        styles.subCategoryStatusText,
                        isSelected && styles.subCategoryStatusTextSelected,
                      ]}
                    >
                      {isSelected ? "Visible" : "Hidden"}
                    </Text>
                    <Text style={styles.subCategoryIcon}>
                      {isSelected ? "👁️" : "👁️‍🗨️"}
                    </Text>
                  </View>
                </TouchableOpacity>

                {hasSubCategories && isSelected && (
                  <View style={styles.subSubCategoriesContainer}>
                    {category.subCategories!.map((subCategory: SubCategory) => (
                      <TouchableOpacity
                        key={subCategory.id}
                        style={styles.subSubCategoryButton}
                        onPress={() =>
                          onSubCategoryToggle(categoryId, subCategory.id)
                        }
                      >
                        <Text style={styles.subSubCategoryName}>
                          {subCategory.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Category Management</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {selectedMainCategory ? (
          renderSubCategories()
        ) : (
          <ScrollView style={styles.mainCategoriesList}>
            <Text style={styles.description}>
              Select a category group to manage individual categories and
              subcategories
            </Text>
            {mainCategories.map(renderMainCategory)}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
  },
  closeButton: {
    padding: 5,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    padding: 20,
    paddingBottom: 10,
  },
  mainCategoriesList: {
    flex: 1,
  },
  mainCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  mainCategoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mainCategoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  mainCategoryTextContainer: {
    flex: 1,
  },
  mainCategoryName: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  mainCategorySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  mainCategoryArrow: {
    marginLeft: 10,
  },
  subCategoriesContainer: {
    flex: 1,
  },
  subCategoriesHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 5,
  },
  subCategoriesTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
  subCategoriesList: {
    flex: 1,
  },
  subCategoryItem: {
    marginBottom: 10,
  },
  subCategoryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    borderRadius: 10,
  },
  subCategoryButtonSelected: {
    backgroundColor: COLORS.primary + "20",
  },
  subCategoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  subCategoryIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  subCategoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text,
  },
  subCategoryNameSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  subCategoryStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  subCategoryStatusText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 5,
  },
  subCategoryStatusTextSelected: {
    color: COLORS.primary,
  },
  subCategoryIcon: {
    fontSize: 16,
  },
  subSubCategoriesContainer: {
    marginLeft: 40,
    marginTop: 10,
  },
  subSubCategoryButton: {
    padding: 10,
    backgroundColor: COLORS.background,
    marginBottom: 5,
    borderRadius: 5,
  },
  subSubCategoryName: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
