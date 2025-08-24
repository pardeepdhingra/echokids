import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { VocabularyItem, AppSettings, Category } from "../types";
import { COLORS } from "../constants";
import { VocabularyGrid } from "../components/VocabularyGrid";
import { AddEditItemModal } from "../components/AddEditItemModal";
import {
  loadVocabulary,
  saveVocabulary,
  loadSettings,
  loadCategories,
  loadFavorites,
  saveFavorites,
} from "../utils/storage";

interface ParentVocabularyScreenProps {
  navigation: any;
  route?: any;
}

export const ParentVocabularyScreen: React.FC<ParentVocabularyScreenProps> = ({
  navigation,
  route,
}) => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    gridSize: 3,
    ttsVoice: "en-US",
    volume: 1.0,
    speechRate: 0.8,
    buttonMode: "sentence",
    showText: true,
    theme: "colorful",
    enableChildFilter: false,
    textSize: "medium",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<VocabularyItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<VocabularyItem | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Parent screen focused - reloading data");
      loadData();
    }, [])
  );





  const loadData = async () => {
    const [vocabData, settingsData, categoriesData, favoritesData] =
      await Promise.all([
        loadVocabulary(),
        loadSettings(),
        loadCategories(),
        loadFavorites(),
      ]);



    setVocabulary(vocabData);
    setSettings(settingsData);
    setCategories(categoriesData);
    setFavorites(favoritesData);
  };

  const handleItemPress = (item: VocabularyItem) => {
    // In parent mode, long press to edit
  };

  const handleItemLongPress = (item: VocabularyItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleToggleFavorite = async (item: VocabularyItem) => {
    const updatedItem = { ...item, isFavorite: !item.isFavorite };

    // Update vocabulary
    const updatedVocabulary = vocabulary.map((v) =>
      v.id === item.id ? updatedItem : v
    );
    setVocabulary(updatedVocabulary);
    await saveVocabulary(updatedVocabulary);

    // Update favorites
    let updatedFavorites = [...favorites];
    if (updatedItem.isFavorite) {
      const existingFavorite = favorites.find((f) => f.id === item.id);
      if (!existingFavorite) {
        updatedFavorites = [...favorites, updatedItem];
      }
    } else {
      updatedFavorites = favorites.filter((f) => f.id !== item.id);
    }
    setFavorites(updatedFavorites);
    await saveFavorites(updatedFavorites);
  };

  const handleAddItem = () => {
    console.log("➕ Main Add button pressed - opening add modal");
    setEditingItem(undefined);
    setShowAddModal(true);
  };

  const handleSaveItem = async (item: VocabularyItem) => {
    let updatedVocabulary: VocabularyItem[];
    let updatedFavorites: VocabularyItem[];

    if (editingItem) {
      updatedVocabulary = vocabulary.map((v) => (v.id === item.id ? item : v));
    } else {
      updatedVocabulary = [...vocabulary, item];
    }

    setVocabulary(updatedVocabulary);
    await saveVocabulary(updatedVocabulary);

    if (item.isFavorite) {
      const existingFavorite = favorites.find((f) => f.id === item.id);
      if (!existingFavorite) {
        updatedFavorites = [...favorites, item];
        setFavorites(updatedFavorites);
        await saveFavorites(updatedFavorites);
      }
    } else {
      updatedFavorites = favorites.filter((f) => f.id !== item.id);
      setFavorites(updatedFavorites);
      await saveFavorites(updatedFavorites);
    }
  };

  const handleDeleteItem = (item: VocabularyItem) => {
    Alert.alert(
      "Delete Button",
      `Are you sure you want to delete "${item.text}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const updatedVocabulary = vocabulary.filter(
              (v) => v.id !== item.id
            );
            const updatedFavorites = favorites.filter((f) => f.id !== item.id);

            setVocabulary(updatedVocabulary);
            setFavorites(updatedFavorites);

            await Promise.all([
              saveVocabulary(updatedVocabulary),
              saveFavorites(updatedFavorites),
            ]);
          },
        },
      ]
    );
  };



  const filteredVocabulary =
    selectedCategory === "all"
      ? vocabulary
      : vocabulary.filter((item) => item.category === selectedCategory);

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === "all" && styles.categoryChipActive,
          ]}
          onPress={() => setSelectedCategory("all")}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === "all" && styles.categoryChipTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              { backgroundColor: category.color },
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id &&
                  styles.categoryChipTextActive,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderModeIndicator = () => (
    <View style={styles.modeIndicator}>
      <Text style={{ fontSize: 16, color: COLORS.primary }}>
        {settings.buttonMode === "sentence" ? "💬" : "📝"}
      </Text>
      <Text style={styles.modeText}>
        {settings.buttonMode === "sentence" ? "Sentence Mode" : "One Word Mode"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👨‍👩‍👧‍👦 Parent Mode</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("ChildVocabulary")}
          >
            <Text style={{ fontSize: 24, color: COLORS.colorful.primary }}>
              👶
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={{ fontSize: 24, color: COLORS.primary }}>⚙️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate("Favorites")}
          >
            <Text style={{ fontSize: 24, color: COLORS.warning }}>⭐</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderModeIndicator()}
      {renderCategoryFilter()}

      <View style={styles.content}>
        <VocabularyGrid
          vocabulary={filteredVocabulary}
          settings={settings}
          onItemPress={handleItemPress}
          onItemLongPress={handleItemLongPress}
          onToggleFavorite={handleToggleFavorite}
        />
      </View>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabPrimary} onPress={handleAddItem}>
          <Text style={{ fontSize: 30, color: COLORS.surface }}>➕</Text>
        </TouchableOpacity>
      </View>

      <AddEditItemModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveItem}
        item={editingItem}
        categories={categories}
        buttonMode={settings.buttonMode}
      />
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.primary,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#000000",
    borderWidth: 1,
    borderColor: "#000000",
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  categoryChipTextActive: {
    color: COLORS.surface,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 30,
    alignItems: "center",
  },
  fabPrimary: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabSecondary: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
