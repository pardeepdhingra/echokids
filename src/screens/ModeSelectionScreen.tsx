import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";

interface ModeSelectionScreenProps {
  navigation: any;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  navigation,
}) => {
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [currentMathQuestion, setCurrentMathQuestion] = useState("");
  const correctAnswerRef = useRef<number>(0);

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

  const handleParentToChild = () => {
    navigation.navigate("ChildVocabulary");
  };

  const handleChildToParent = () => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Echo Kids</Text>
        <Text style={styles.subtitle}>Choose Your Mode</Text>
      </View>

      <View style={styles.modeContainer}>
        <TouchableOpacity
          style={[styles.modeButton, styles.parentButton]}
          onPress={() => navigation.navigate("ParentVocabulary")}
        >
          <View style={styles.modeIcon}>
            <Text style={{ fontSize: 60, color: COLORS.surface }}>⚙️</Text>
          </View>
          <Text style={styles.modeTitle}>Parent/Carer Mode</Text>
          <Text style={styles.modeDescription}>
            Create and customize buttons, adjust settings
          </Text>
          <View style={styles.quickSwitch}>
            <Text style={styles.quickSwitchText}>
              Quick Switch to Child Mode
            </Text>
            <TouchableOpacity
              style={styles.quickSwitchButton}
              onPress={handleParentToChild}
            >
              <Text style={{ fontSize: 20, color: COLORS.primary }}>→</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, styles.childButton]}
          onPress={() => navigation.navigate("ChildVocabulary")}
        >
          <View style={styles.modeIcon}>
            <Text style={{ fontSize: 60, color: COLORS.surface }}>😊</Text>
          </View>
          <Text style={styles.modeTitle}>Child Mode</Text>
          <Text style={styles.modeDescription}>
            Simple, colorful buttons for communication
          </Text>
          <View style={styles.quickSwitch}>
            <Text style={styles.quickSwitchText}>Switch to Parent Mode</Text>
            <TouchableOpacity
              style={styles.quickSwitchButton}
              onPress={handleChildToParent}
            >
              <Ionicons name="lock-closed" size={20} color={COLORS.surface} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

      <Modal visible={showMathModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.mathModal}>
            <View style={styles.mathHeader}>
              <Ionicons
                name="shield-checkmark"
                size={40}
                color={COLORS.primary}
              />
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
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  modeContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  modeButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  parentButton: {
    borderLeftWidth: 6,
    borderLeftColor: COLORS.primary,
  },
  childButton: {
    borderLeftWidth: 6,
    borderLeftColor: COLORS.colorful.primary,
  },
  modeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  modeDescription: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  quickSwitch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  quickSwitchText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  quickSwitchButton: {
    padding: 8,
    backgroundColor: COLORS.background,
    borderRadius: 20,
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
