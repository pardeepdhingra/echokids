import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { VocabularyItem, AppSettings, Category } from "../types";
import { COLORS } from "../constants";
import { VocabularyGrid } from "../components/VocabularyGrid";
import { loadVocabulary, loadSettings, loadFavorites, loadCategories } from "../utils/storage";

interface ChildVocabularyScreenProps {
  navigation: any;
}

export const ChildVocabularyScreen: React.FC<ChildVocabularyScreenProps> = ({
  navigation,
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
    hiddenCategories: [],
  });
  const [favorites, setFavorites] = useState<VocabularyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFavorites, setShowFavorites] = useState(false);
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [currentMathQuestion, setCurrentMathQuestion] = useState("");
  const correctAnswerRef = useRef<number>(0);

  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 Child screen focused - reloading data");
      loadData();
    }, [])
  );

  // Also reload data when the screen comes into focus from navigation
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log("🔄 Child screen navigation focus - reloading data");
      loadData();
    });

    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const [vocabData, settingsData, favoritesData, categoriesData] = await Promise.all([
      loadVocabulary(),
      loadSettings(),
      loadFavorites(),
      loadCategories(),
    ]);

    console.log("🔄 Child: Loading data - settings:", settingsData);
    console.log("🔄 Child: Hidden categories:", settingsData.hiddenCategories);

    setVocabulary(vocabData);
    setSettings(settingsData);
    setFavorites(favoritesData);
    setCategories(categoriesData);
  };

  const handleItemPress = (item: VocabularyItem) => {
    // In child mode, just play TTS
  };

  const handleItemLongPress = (item: VocabularyItem) => {
    // No editing in child mode - completely disabled
    return;
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ["+", "-", "×"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let answer;
    switch (operator) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "×":
        answer = num1 * num2;
        break;
      default:
        answer = num1 + num2;
    }

    setCurrentMathQuestion(`${num1} ${operator} ${num2} = ?`);
    correctAnswerRef.current = answer;
    return answer;
  };

  const handleParentAccess = () => {
    generateMathQuestion();
    setShowMathModal(true);
  };

  const handleMathSubmit = () => {
    const userAnswer = parseInt(mathAnswer);
    if (userAnswer === correctAnswerRef.current) {
      setShowMathModal(false);
      setMathAnswer("");
      navigation.navigate("ParentVocabulary");
    } else {
      Alert.alert("Incorrect", "Please try again!");
      setMathAnswer("");
      generateMathQuestion(); // Generate new question
    }
  };

  const displayVocabulary = showFavorites ? favorites : vocabulary;
  
  const filteredVocabulary = (() => {
    console.log("🔄 Child: Filtering vocabulary - hidden categories:", settings.hiddenCategories);
    console.log("🔄 Child: Total vocabulary items:", displayVocabulary.length);
    
    // First, filter out items from hidden categories
    let filtered = displayVocabulary.filter(
      (item) => !(settings.hiddenCategories || []).includes(item.category || "")
    );

    console.log("🔄 Child: After hiding categories:", filtered.length);

    // Then apply category filter if enabled
    if (settings.enableChildFilter && selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    console.log("🔄 Child: Final filtered count:", filtered.length);
    return filtered;
  })();

  const renderModeIndicator = () => (
    <View style={styles.modeIndicator}>
      <Text style={{ fontSize: 20, color: COLORS.surface }}>
        {settings.buttonMode === "sentence" ? "💬" : settings.buttonMode === "two-word" ? "📋" : "📝"}
      </Text>
      <Text style={styles.modeText}>
        {settings.buttonMode === "sentence" ? "Talk Mode" : settings.buttonMode === "two-word" ? "Two-Word Mode" : "Word Mode"}
      </Text>
    </View>
  );

  const renderCategoryFilter = () => {
    if (!settings.enableChildFilter) return null;
    
    return (
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
          {categories
            .filter((category) => !(settings.hiddenCategories || []).includes(category.id))
            .map((category) => (
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {showFavorites ? "⭐ Favorites" : "👶 Child Mode"}
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleFavorites}
          >
            <Text
              style={{
                fontSize: 24,
                color: showFavorites ? COLORS.primary : COLORS.warning,
              }}
            >
              {showFavorites ? "📱" : "⭐"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleParentAccess}
          >
            <Text style={{ fontSize: 24, color: COLORS.textSecondary }}>
              👨‍👩‍👧‍👦
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderModeIndicator()}
      {renderCategoryFilter()}

      <View style={styles.content}>
        {displayVocabulary.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 80, color: COLORS.textSecondary }}>
              {showFavorites ? "☆" : "📱"}
            </Text>
            <Text style={styles.emptyText}>
              {showFavorites ? "No favorites yet" : "No buttons to show"}
            </Text>
            <Text style={styles.emptySubtext}>
              {showFavorites
                ? "Add buttons to favorites in parent mode"
                : "Add buttons in parent mode"}
            </Text>
            {showFavorites && (
              <TouchableOpacity
                style={styles.switchButton}
                onPress={() => setShowFavorites(false)}
              >
                <Text style={styles.switchButtonText}>Go to All Buttons</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <VocabularyGrid
            vocabulary={filteredVocabulary}
            settings={settings}
            onItemPress={handleItemPress}
            onItemLongPress={handleItemLongPress}
            isChildMode={true}
          />
        )}
      </View>

      {!showFavorites && favorites.length > 0 && (
        <View style={styles.favoritesIndicator}>
          <Text style={{ fontSize: 16, color: COLORS.warning }}>⭐</Text>
          <Text style={styles.favoritesIndicatorText}>
            {favorites.length} favorite{favorites.length !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      <Modal visible={showMathModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.mathModal}>
            <View style={styles.mathHeader}>
              <Text style={{ fontSize: 40, color: COLORS.primary }}>🛡️</Text>
              <Text style={styles.mathTitle}>Parent Access</Text>
            </View>

            <Text style={styles.mathQuestion}>{currentMathQuestion}</Text>

            <TextInput
              style={styles.mathInput}
              value={mathAnswer}
              onChangeText={setMathAnswer}
              placeholder="Enter answer"
              keyboardType="numeric"
              maxLength={3}
              textAlign="center"
            />

            <View style={styles.mathButtons}>
              <TouchableOpacity
                style={styles.mathCancelButton}
                onPress={() => {
                  setShowMathModal(false);
                  setMathAnswer("");
                }}
              >
                <Text style={styles.mathCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mathSubmitButton}
                onPress={handleMathSubmit}
              >
                <Text style={styles.mathSubmitText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  modeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
  categoryFilter: {
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  categoryChipTextActive: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 30,
  },
  switchButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  switchButtonText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: "600",
  },
  favoritesIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  favoritesIndicatorText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  mathModal: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 30,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  mathHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  mathTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 10,
  },
  mathQuestion: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 20,
  },
  mathInput: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 15,
    fontSize: 24,
    width: "100%",
    marginBottom: 20,
    backgroundColor: COLORS.background,
  },
  mathButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  mathCancelButton: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginRight: 10,
    alignItems: "center",
  },
  mathCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  mathSubmitButton: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: "center",
  },
  mathSubmitText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.surface,
  },
});
