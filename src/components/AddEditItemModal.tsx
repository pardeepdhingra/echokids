import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { VocabularyItem, ButtonTemplate } from "../types";
import { COLORS, BUTTON_TEMPLATES } from "../constants";

interface AddEditItemModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (item: VocabularyItem) => void;
  item?: VocabularyItem;
  categories: Array<{ id: string; name: string; color: string }>;
  buttonMode: "one-word" | "two-word" | "sentence";
}

export const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  visible,
  onClose,
  onSave,
  item,
  categories,
  buttonMode,
}) => {
  const [text, setText] = useState(item?.text || "");
  const [message, setMessage] = useState(item?.message || "");
  const [selectedImage, setSelectedImage] = useState(item?.image || "");
  const [selectedCategory, setSelectedCategory] = useState(
    item?.category || ""
  );
  const [selectedColor, setSelectedColor] = useState(item?.color || "");
  const [selectedSize, setSelectedSize] = useState(item?.size || "medium");
  const [isFavorite, setIsFavorite] = useState(item?.isFavorite || false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");

  const handleSave = () => {
    if (!text.trim()) {
      Alert.alert("Error", "Please enter button text");
      return;
    }

    if (buttonMode === "sentence" && !message.trim()) {
      Alert.alert("Error", "Please enter a message for sentence mode");
      return;
    }

    const newItem: VocabularyItem = {
      id: item?.id || Date.now().toString(),
      text: text.trim(),
      message: message.trim(),
      image: selectedImage,
      category: selectedCategory,
      color: selectedColor,
      size: selectedSize as "small" | "medium" | "large",
      isFavorite,
    };

    onSave(newItem);
    handleClose();
  };

  const handleClose = () => {
    setText("");
    setMessage("");
    setSelectedImage("");
    setSelectedCategory("");
    setSelectedColor("");
    setSelectedSize("medium");
    setIsFavorite(false);
    setImageSearchQuery("");
    onClose();
  };

  const pickImage = async () => {
    console.log("📷 Pick image function called");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log("📷 Image picker result:", result);
      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setShowImageModal(false);
      }
    } catch (error) {
      console.log("📷 Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please check permissions.");
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setShowImageModal(false);
    }
  };

  const searchImageFromInternet = async () => {
    if (!imageSearchQuery.trim()) {
      Alert.alert("Error", "Please enter a search term");
      return;
    }

    try {
      // Use a simple placeholder image service instead of requiring API key
      const searchTerm = encodeURIComponent(imageSearchQuery.trim());
      const imageUrl = `https://via.placeholder.com/200x200/4CAF50/FFFFFF?text=${searchTerm}`;

      setSelectedImage(imageUrl);
      setShowImageModal(false);
      Alert.alert("Success", "Image selected! You can now save the button.");
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to search for images. Please try uploading your own image."
      );
    }
  };

  const selectTemplate = (template: ButtonTemplate) => {
    setText(template.text);
    setMessage(template.message);
    setSelectedImage(template.image || "");
    setSelectedCategory(template.category);
    setSelectedColor(template.color);
    setShowTemplateModal(false);
  };

  const renderTemplateModal = () => {
    console.log("📋 Rendering template modal, visible:", showTemplateModal);
    if (!showTemplateModal) return null;
    return (
      <Modal visible={showTemplateModal} animationType="slide" transparent>
        <View
          style={[styles.overlay, { backgroundColor: "rgba(255, 0, 0, 0.8)" }]}
        >
          <View style={[styles.modal, { backgroundColor: "#FFFFFF" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Template</Text>
              <TouchableOpacity onPress={() => setShowTemplateModal(false)}>
                <Text style={{ fontSize: 24, color: COLORS.text }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.templateGrid}>
                {BUTTON_TEMPLATES.map((template) => {
                  return (
                    <TouchableOpacity
                      key={template.id}
                      style={styles.templateItem}
                      onPress={() => selectTemplate(template)}
                    >
                      <View style={styles.templateIcon}>
                        <Text style={{ fontSize: 32, color: COLORS.primary }}>
                          {getEmojiForText(template.text)}
                        </Text>
                      </View>
                      <Text style={styles.templateText}>{template.text}</Text>
                      <Text style={styles.templateMessage}>
                        {template.message}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderImageModal = () => {
    console.log("🖼️ Rendering image modal, visible:", showImageModal);
    if (!showImageModal) return null;
    return (
      <Modal visible={showImageModal} animationType="slide" transparent>
        <View
          style={[styles.overlay, { backgroundColor: "rgba(0, 255, 0, 0.8)" }]}
        >
          <View style={[styles.modal, { backgroundColor: "#FFFFFF" }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Image</Text>
              <TouchableOpacity onPress={() => setShowImageModal(false)}>
                <Text style={{ fontSize: 24, color: COLORS.text }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>Upload Image</Text>
                <View style={styles.uploadButtons}>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={pickImage}
                  >
                    <Text style={{ fontSize: 24, color: COLORS.primary }}>
                      📷
                    </Text>
                    <Text style={styles.uploadButtonText}>Photo Library</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={takePhoto}
                  >
                    <Text style={{ fontSize: 24, color: COLORS.primary }}>
                      📸
                    </Text>
                    <Text style={styles.uploadButtonText}>Take Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.imageSection}>
                <Text style={styles.sectionTitle}>Search Internet</Text>
                <View style={styles.searchContainer}>
                  <TextInput
                    style={styles.searchInput}
                    value={imageSearchQuery}
                    onChangeText={setImageSearchQuery}
                    placeholder="Search for images..."
                    placeholderTextColor={COLORS.textSecondary}
                  />
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={searchImageFromInternet}
                  >
                    <Text style={{ fontSize: 20, color: COLORS.surface }}>
                      🔍
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const colorOptions = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#E91E63",
    "#9C27B0",
    "#795548",
    "#607D8B",
    "#2C3E50",
    "#34495E",
    "#7F8C8D",
  ];

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {item ? "Edit Button" : "Add New Button"}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
              >
                <Text style={{ fontSize: 24, color: COLORS.text }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              <TouchableOpacity
                style={styles.templateButton}
                onPress={() => {
                  console.log(
                    "📋 Template button pressed, templates available:",
                    BUTTON_TEMPLATES.length
                  );
                  console.log("📋 Setting showTemplateModal to true");
                  setShowTemplateModal(true);
                }}
              >
                <Text style={{ fontSize: 20, color: COLORS.primary }}>📋</Text>
                <Text style={styles.templateButtonText}>
                  Choose from Templates
                </Text>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Button Text</Text>
                <TextInput
                  style={styles.textInput}
                  value={text}
                  onChangeText={setText}
                  placeholder="Enter button text"
                  maxLength={20}
                />
              </View>

              {buttonMode === "sentence" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Message (TTS)</Text>
                  <TextInput
                    style={[styles.textInput, styles.messageInput]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Enter message for TTS"
                    maxLength={100}
                    multiline
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Image</Text>
                <TouchableOpacity
                  style={styles.imageSelector}
                  onPress={() => {
                    console.log("🖼️ Image button pressed");
                    console.log("🖼️ Setting showImageModal to true");
                    setShowImageModal(true);
                  }}
                >
                  {selectedImage ? (
                    <Image
                      source={{ uri: selectedImage }}
                      style={styles.selectedImage}
                      resizeMode="contain"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text
                        style={{ fontSize: 40, color: COLORS.textSecondary }}
                      >
                        🖼️
                      </Text>
                      <Text style={styles.imagePlaceholderText}>
                        Select Image
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.categorySection}>
                    {categories.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.categoryOption,
                          {
                            backgroundColor: category.color,
                          },
                          selectedCategory === category.id &&
                            styles.selectedCategory,
                        ]}
                        onPress={() => setSelectedCategory(category.id)}
                      >
                        <Text
                          style={[
                            styles.categoryText,
                            selectedCategory === category.id &&
                              styles.selectedCategoryText,
                          ]}
                        >
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Button Color</Text>
                <View style={styles.colorGrid}>
                  {colorOptions.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.selectedColor,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    >
                      {selectedColor === color && (
                        <Text style={{ fontSize: 16, color: COLORS.surface }}>
                          ✓
                        </Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Button Size</Text>
                <View style={styles.sizeButtons}>
                  {["small", "medium", "large"].map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.selectedSizeButton,
                      ]}
                      onPress={() => setSelectedSize(size as any)}
                    >
                      <Text
                        style={[
                          styles.sizeButtonText,
                          selectedSize === size &&
                            styles.selectedSizeButtonText,
                        ]}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.favoriteToggle}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Text
                  style={{
                    fontSize: 24,
                    color: isFavorite ? COLORS.warning : COLORS.textSecondary,
                  }}
                >
                  {isFavorite ? "⭐" : "☆"}
                </Text>
                <Text style={styles.favoriteText}>Add to Favorites</Text>
              </TouchableOpacity>
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {renderImageModal()}
      {renderTemplateModal()}

      {/* Debug indicator for modal visibility */}
      {showTemplateModal && (
        <View
          style={{
            position: "absolute",
            top: 50,
            left: 50,
            backgroundColor: "red",
            padding: 10,
            zIndex: 9999,
          }}
        >
          <Text style={{ color: "white" }}>
            Template Modal Should Be Visible
          </Text>
        </View>
      )}

      {showImageModal && (
        <View
          style={{
            position: "absolute",
            top: 100,
            left: 50,
            backgroundColor: "green",
            padding: 10,
            zIndex: 9999,
          }}
        >
          <Text style={{ color: "white" }}>Image Modal Should Be Visible</Text>
        </View>
      )}
    </>
  );
};

const getEmojiForText = (text: string): string => {
  const EMOJI_MAP: { [key: string]: string } = {
    // Greetings
    hello: "👋",
    goodbye: "👋",
    "thank you": "❤️",
    please: "🙏",
    "happy birthday": "🎂",
    "i love you": "💕",

    // Food & Drink
    food: "🍕",
    hungry: "🍽️",
    water: "💧",
    thirsty: "🥤",
    milk: "🥛",
    sandwich: "🥪",
    burger: "🍔",
    pizza: "🍕",
    spaghetti: "🍝",
    "cold drink": "🥤",
    juice: "🧃",
    breakfast: "🍳",
    lunch: "🥪",
    dinner: "🍽️",
    italian: "🍝",
    indian: "🍛",
    chinese: "🥡",
    thai: "🍜",
    mexican: "🌮",
    apple: "🍎",
    banana: "🍌",
    orange: "🍊",
    grapes: "🍇",
    strawberry: "🍓",
    watermelon: "🍉",
    chips: "🍟",
    "ice-cream": "🍦",
    chocolate: "🍫",
    cookies: "🍪",

    // Basic Needs
    bathroom: "🚽",
    help: "🆘",
    tired: "😴",
    sleep: "😴",

    // Emotions
    happy: "😊",
    sad: "😢",
    angry: "😠",
    scared: "😨",
    excited: "🤩",
    cold: "🥶",
    hot: "🥵",
    surprised: "😲",
    confused: "😕",
    proud: "😌",

    // Activities
    play: "🎮",
    stop: "⏹️",
    more: "➕",
    "all done": "✅",
    book: "📚",
    cycling: "🚴",
    scooter: "🛴",
    tv: "📺",

    // People
    mom: "👩",
    dad: "👨",
    friend: "👥",
    teacher: "👩‍🏫",
    brother: "👦",
    sister: "👧",
    grandpa: "👴",
    grandma: "👵",
    uncle: "👨‍🦱",
    aunt: "👩‍🦰",

    // Places
    home: "🏠",
    school: "🏫",
    park: "🌳",
    store: "🏪",
    playground: "🎪",
    restaurant: "🍽️",
    "mcdonald's": "🍔",
    hospital: "🏥",
    library: "📚",
    beach: "🏖️",
    soap: "🧼",
    shampoo: "🧴",
    spoon: "🥄",
    fork: "🍴",
    knife: "🔪",
    scissors: "✂️",
    toothbrush: "🪥",
    towel: "🛁",
    paper: "📄",
    pencil: "✏️",

    // Weather
    sunny: "☀️",
    rainy: "🌧️",
    snowy: "❄️",
    cloudy: "☁️",
    windy: "💨",

    // Pronouns
    i: "👤",
    me: "👤",
    you: "👤",
    he: "👨",
    she: "👩",
    it: "🔵",
    we: "👥",
    they: "👥",
    my: "👤",
    mine: "👤",
    your: "👤",
    our: "👥",
    their: "👥",

    // Verbs
    go: "🚶",
    want: "💭",
    like: "👍",
    "don't like": "👎",
    come: "👉",
    give: "🤲",
    take: "✋",
    do: "⚡",
    make: "🔨",
    eat: "🍽️",
    drink: "🥤",
    look: "👀",
    see: "👁️",
    hear: "👂",
    know: "🧠",
    think: "🤔",
    say: "💬",
    tell: "📢",
    feel: "💝",
    use: "🔧",
    put: "📦",
    open: "🔓",
    close: "🔒",
    find: "🔍",
    show: "👆",
    work: "💼",
    wait: "⏳",
    start: "▶️",
    finish: "🏁",

    // Descriptors
    big: "🐘",
    small: "🐭",
    fast: "🏃",
    slow: "🐌",
    good: "👍",
    bad: "👎",
    less: "➖",
    all: "📦",
    some: "📄",
    same: "🔄",
    different: "🔄",
    first: "1️⃣",
    last: "🔚",
    next: "⏭️",
    again: "🔄",

    // Social
    yes: "✅",
    no: "❌",
    sorry: "😔",
    okay: "👌",
    wow: "😲",
    cool: "😎",

    // Questions
    what: "❓",
    where: "📍",
    who: "👤",
    when: "⏰",
    why: "🤔",
    how: "❓",

    // Home
    house: "🏠",
    bed: "🛏️",
    chair: "🪑",
    table: "🪑",
    phone: "📱",
    computer: "💻",
    light: "💡",
    door: "🚪",
    window: "🪟",

    // Kitchen
    plate: "🍽️",
    cup: "☕",
    bowl: "🥣",
    bottle: "🍼",

    // Bathroom
    toilet: "🚽",
    sink: "🚰",
    toothpaste: "🪥",

    // Clothing
    shirt: "👕",
    pants: "👖",
    shoes: "👟",
    socks: "🧦",
    jacket: "🧥",
    hat: "🎩",
    dress: "👗",
    coat: "🧥",

    // Food - Staples
    rice: "🍚",
    bread: "🍞",
    pasta: "🍝",
    cereal: "🥣",
    soup: "🍲",

    // Food - Proteins
    chicken: "🍗",
    fish: "🐟",
    egg: "🥚",
    meat: "🥩",
    beans: "🫘",
    cheese: "🧀",

    // Food - Fruits
    grape: "🍇",
    mango: "🥭",

    // Food - Vegetables
    carrot: "🥕",
    potato: "🥔",
    tomato: "🍅",
    cucumber: "🥒",
    corn: "🌽",
    peas: "🫛",
    broccoli: "🥦",

    // Food - Snacks
    cookie: "🍪",
    candy: "🍬",
    cake: "🎂",
    popcorn: "🍿",

    // Food - Drinks
    tea: "🍵",
    coffee: "☕",
    soda: "🥤",

    // Routines & Needs
    hungry: "🍽️",
    thirsty: "🥤",
    sleepy: "😴",
    "bathroom-need": "🚽",
    medicine: "💊",
    pain: "😣",
    hurt: "😢",
    wait: "⏳",
    finished: "✅",
    enough: "✋",

    // Play & Activities
    toy: "🧸",
    game: "🎮",
    ball: "⚽",
    doll: "👸",
    blocks: "🧱",
    music: "🎵",
    dance: "💃",
    sing: "🎤",
    draw: "🎨",
    paint: "🖌️",
    color: "🎨",
    swing: "🔄",
    slide: "🛝",
    tv: "📺",
    tablet: "📱",
    puzzle: "🧩",
    ride: "🚴",
    run: "🏃",
    jump: "🦘",

    // Animals
    dog: "🐕",
    cat: "🐱",
    bird: "🐦",
    fish: "🐟",
    horse: "🐎",
    cow: "🐄",
    sheep: "🐑",
    pig: "🐷",
    chicken: "🐔",
    duck: "🦆",
    rabbit: "🐰",
    lion: "🦁",
    tiger: "🐯",
    elephant: "🐘",
    monkey: "🐒",
    bear: "🐻",

    // Colors & Shapes
    red: "🔴",
    blue: "🔵",
    green: "🟢",
    yellow: "🟡",
    orange: "🟠",
    purple: "🟣",
    pink: "🩷",
    black: "⚫",
    white: "⚪",
    brown: "🟤",
    gray: "🔘",
    circle: "⭕",
    square: "⬜",
    triangle: "🔺",
    rectangle: "⬜",
    star: "⭐",
    heart: "❤️",

    // Numbers & Time
    one: "1️⃣",
    two: "2️⃣",
    three: "3️⃣",
    four: "4️⃣",
    five: "5️⃣",
    six: "6️⃣",
    seven: "7️⃣",
    eight: "8️⃣",
    nine: "9️⃣",
    ten: "🔟",
    eleven: "1️⃣1️⃣",
    twelve: "1️⃣2️⃣",
    thirteen: "1️⃣3️⃣",
    fourteen: "1️⃣4️⃣",
    fifteen: "1️⃣5️⃣",
    sixteen: "1️⃣6️⃣",
    seventeen: "1️⃣7️⃣",
    eighteen: "1️⃣8️⃣",
    nineteen: "1️⃣9️⃣",
    twenty: "2️⃣0️⃣",
    thirty: "3️⃣0️⃣",
    forty: "4️⃣0️⃣",
    fifty: "5️⃣0️⃣",
    hundred: "💯",
    morning: "🌅",
    afternoon: "🌞",
    evening: "🌆",
    night: "🌙",
    today: "📅",
    tomorrow: "📅",
    yesterday: "📅",
    now: "⏰",
    later: "⏰",
    soon: "⏰",
    sun: "☀️",
    rain: "🌧️",
    cloud: "☁️",
    snow: "❄️",
    storm: "⛈️",

    // School & Technology
    student: "👨‍🎓",
    "book-school": "📚",
    pen: "🖊️",
    eraser: "🧽",
    bag: "🎒",
    desk: "🪑",
    "chair-school": "🪑",
    board: "📋",
    read: "📖",
    write: "✍️",
    "draw-school": "🎨",
    cut: "✂️",
    glue: "🩹",
    count: "🔢",
    answer: "💭",
    listen: "👂",
    talk: "💬",
    "tablet-school": "📱",
    "tv-school": "📺",
    internet: "🌐",
    video: "🎥",
    "game-school": "🎮",
  };

  const lowerText = text.toLowerCase();
  return EMOJI_MAP[lowerText] || "📝";
};

const getImageForText = (text: string): string => {
  const IMAGE_MAP: { [key: string]: string } = {
    // Greetings
    hello: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    goodbye: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    "thank you": "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    please: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",

    // Food & Drink
    food: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    hungry: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    water: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    thirsty: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    milk: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",

    // Basic Needs
    bathroom: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    help: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    tired: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    sleep: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",

    // Emotions
    happy: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    sad: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    angry: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    scared: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    excited: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",

    // Activities
    play: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    stop: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    more: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    "all done": "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    book: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",

    // People
    mom: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    dad: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    friend: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    teacher: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",

    // Places
    home: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    school: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    park: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
    store: "https://cdn-icons-png.flaticon.com/512/1828/1828640.png",
  };

  const lowerText = text.toLowerCase();
  return (
    IMAGE_MAP[lowerText] ||
    "https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modal: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    zIndex: 1001,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  templateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  templateButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.background,
  },
  messageInput: {
    height: 80,
    textAlignVertical: "top",
  },
  imageSelector: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  categorySection: {
    flexDirection: "row",
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    opacity: 0.7,
  },
  selectedCategory: {
    opacity: 1,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  categoryText: {
    color: COLORS.surface,
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: COLORS.text,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedColor: {
    borderColor: COLORS.text,
  },
  sizeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 4,
    alignItems: "center",
  },
  selectedSizeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  sizeButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.text,
  },
  selectedSizeButtonText: {
    color: COLORS.surface,
  },
  favoriteToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  favoriteText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  cancelButtonText: {
    textAlign: "center",
    color: COLORS.text,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    textAlign: "center",
    color: COLORS.surface,
    fontWeight: "600",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
  },
  modalContent: {
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
  },
  uploadButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  uploadButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontWeight: "500",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.background,
    marginRight: 8,
  },
  searchButton: {
    padding: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  templateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  templateItem: {
    width: "48%",
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  templateIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  templateText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  templateMessage: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
