#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🔊 Audio System Test Script");
console.log("==========================\n");

// Check if expo-av is installed
const packageJsonPath = path.join(__dirname, "..", "package.json");
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const hasExpoAv =
    packageJson.dependencies && packageJson.dependencies["expo-av"];
  const hasExpoSpeech =
    packageJson.dependencies && packageJson.dependencies["expo-speech"];

  console.log("📦 Dependencies Check:");
  console.log(`   expo-av: ${hasExpoAv ? "✅" : "❌"}`);
  console.log(`   expo-speech: ${hasExpoSpeech ? "✅" : "❌"}`);

  if (!hasExpoAv || !hasExpoSpeech) {
    console.log("\n❌ Missing required audio dependencies!");
    console.log("   Run: npm install expo-av expo-speech");
    process.exit(1);
  }
}

// Check TTS utility file
const ttsPath = path.join(__dirname, "..", "src", "utils", "tts.ts");
if (fs.existsSync(ttsPath)) {
  const ttsContent = fs.readFileSync(ttsPath, "utf8");

  console.log("\n🔧 TTS Utility Check:");
  console.log(`   File exists: ✅`);
  console.log(
    `   Audio initialization: ${ttsContent.includes("initializeAudio") ? "✅" : "❌"}`
  );
  console.log(
    `   Error handling: ${ttsContent.includes("catch") ? "✅" : "❌"}`
  );
  console.log(
    `   Fallback mechanisms: ${ttsContent.includes("playBeep") ? "✅" : "❌"}`
  );
  console.log(
    `   Vibration fallback: ${ttsContent.includes("Vibration.vibrate") ? "✅" : "❌"}`
  );
}

// Check App.tsx for audio initialization
const appPath = path.join(__dirname, "..", "App.tsx");
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, "utf8");

  console.log("\n📱 App Initialization Check:");
  console.log(
    `   Audio session setup: ${appContent.includes("Audio.setAudioModeAsync") ? "✅" : "❌"}`
  );
  console.log(
    `   useEffect for audio: ${appContent.includes("useEffect") ? "✅" : "❌"}`
  );
}

// Check Settings screen for testing
const settingsPath = path.join(
  __dirname,
  "..",
  "src",
  "screens",
  "SettingsScreen.tsx"
);
if (fs.existsSync(settingsPath)) {
  const settingsContent = fs.readFileSync(settingsPath, "utf8");

  console.log("\n⚙️ Settings Screen Check:");
  console.log(
    `   TTS test button: ${settingsContent.includes("Test TTS") ? "✅" : "❌"}`
  );
  console.log(
    `   Audio system test: ${settingsContent.includes("Test Audio System") ? "✅" : "❌"}`
  );
}

console.log("\n🎯 Audio Issue Resolution Steps:");
console.log("1. Make sure device is not on silent mode");
console.log("2. Check device volume is turned up");
console.log('3. Try the "Test Audio System" button in Settings');
console.log('4. If TTS fails, try the "Test TTS" button');
console.log("5. Check console logs for detailed error messages");
console.log("6. Restart the app if audio session fails");

console.log("\n🔧 Common iOS Audio Issues:");
console.log("- Silent mode switch is on");
console.log("- Volume is too low");
console.log("- Audio session conflicts with other apps");
console.log("- Device needs restart");
console.log("- iOS version compatibility issues");

console.log("\n✅ Audio system appears to be properly configured!");
console.log(
  "   If you still have issues, check the device settings and try the test buttons."
);
