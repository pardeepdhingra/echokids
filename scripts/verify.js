#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔍 Starting AAC App Verification...\n");

// Colors for console output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
  bold: "\x1b[1m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`Running: ${description}`, "yellow");
    const result = execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
      cwd: process.cwd(),
    });
    log(`✅ ${description} - PASSED`, "green");
    return { success: true, output: result };
  } catch (error) {
    log(`❌ ${description} - FAILED`, "red");
    log(`Error: ${error.message}`, "red");
    return { success: false, output: error.stdout || error.message };
  }
}

// 1. TypeScript Compilation Check
logSection("TypeScript Compilation");
const tsResult = runCommand("npx tsc --noEmit", "TypeScript compilation check");

// 2. Linting Check
logSection("Code Quality");
const lintResult = runCommand("npx eslint src --ext .ts,.tsx", "ESLint check");

// 3. Test Suite
logSection("Test Suite");
const testResult = runCommand("npm test -- --passWithNoTests", "Unit tests");

// 4. Icon Validation
logSection("Icon Validation");
function validateIcons() {
  try {
    const vocabularyGridPath = path.join(
      __dirname,
      "../src/components/VocabularyGrid.tsx"
    );
    const content = fs.readFileSync(vocabularyGridPath, "utf8");

    // Check for valid Ionicons
    const validIcons = [
      "hand-left",
      "hand-right",
      "heart",
      "heart-outline",
      "restaurant",
      "fast-food",
      "water",
      "cafe",
      "medical",
      "help-circle",
      "bed",
      "moon",
      "happy",
      "sad",
      "flash",
      "warning",
      "star",
      "game-controller",
      "stop-circle",
      "add-circle",
      "checkmark-circle",
      "book",
      "person",
      "people",
      "school",
      "home",
      "leaf",
      "bag",
      "chatbubble",
    ];

    const iconMatches = content.match(/name:\s*["']([^"']+)["']/g);
    const usedIcons = iconMatches
      ? iconMatches.map((match) => {
          const iconName = match.match(/["']([^"']+)["']/)[1];
          return iconName;
        })
      : [];

    const invalidIcons = usedIcons.filter((icon) => !validIcons.includes(icon));

    if (invalidIcons.length > 0) {
      log(`❌ Invalid icons found: ${invalidIcons.join(", ")}`, "red");
      return false;
    } else {
      log("✅ All icons are valid Ionicons", "green");
      return true;
    }
  } catch (error) {
    log(`❌ Icon validation failed: ${error.message}`, "red");
    return false;
  }
}

const iconValidation = validateIcons();

// 5. Voice Configuration Check
logSection("Voice Configuration");
function validateVoiceConfig() {
  try {
    const constantsPath = path.join(__dirname, "../src/constants/index.ts");
    const content = fs.readFileSync(constantsPath, "utf8");

    // Check for voice options
    if (!content.includes("VOICE_OPTIONS")) {
      log("❌ VOICE_OPTIONS not found", "red");
      return false;
    }

    // Check for valid language codes
    const languageCodes = ["en-US", "en-GB", "en-AU"];
    const hasValidLanguages = languageCodes.some((code) =>
      content.includes(code)
    );

    if (!hasValidLanguages) {
      log("❌ No valid language codes found", "red");
      return false;
    }

    log("✅ Voice configuration looks good", "green");
    return true;
  } catch (error) {
    log(`❌ Voice validation failed: ${error.message}`, "red");
    return false;
  }
}

const voiceValidation = validateVoiceConfig();

// 6. Button Mode Logic Check
logSection("Button Mode Logic");
function validateButtonModeLogic() {
  try {
    const vocabularyGridPath = path.join(
      __dirname,
      "../src/components/VocabularyGrid.tsx"
    );
    const content = fs.readFileSync(vocabularyGridPath, "utf8");

    // Check for button mode logic
    if (!content.includes("settings.buttonMode")) {
      log("❌ Button mode logic not found", "red");
      return false;
    }

    if (!content.includes("sentence") || !content.includes("one-word")) {
      log("❌ Button mode types not found", "red");
      return false;
    }

    log("✅ Button mode logic found", "green");
    return true;
  } catch (error) {
    log(`❌ Button mode validation failed: ${error.message}`, "red");
    return false;
  }
}

const buttonModeValidation = validateButtonModeLogic();

// 7. Navigation Check
logSection("Navigation");
function validateNavigation() {
  try {
    const appPath = path.join(__dirname, "../App.tsx");
    const content = fs.readFileSync(appPath, "utf8");

    // Check for required screens
    const requiredScreens = [
      "ModeSelection",
      "ParentVocabulary",
      "ChildVocabulary",
      "Settings",
      "Favorites",
    ];
    const missingScreens = requiredScreens.filter(
      (screen) => !content.includes(screen)
    );

    if (missingScreens.length > 0) {
      log(`❌ Missing screens: ${missingScreens.join(", ")}`, "red");
      return false;
    }

    log("✅ All required screens are configured", "green");
    return true;
  } catch (error) {
    log(`❌ Navigation validation failed: ${error.message}`, "red");
    return false;
  }
}

const navigationValidation = validateNavigation();

// Summary
logSection("Verification Summary");
const allChecks = [
  { name: "TypeScript Compilation", result: tsResult.success },
  { name: "Code Quality (ESLint)", result: lintResult.success },
  { name: "Unit Tests", result: testResult.success },
  { name: "Icon Validation", result: iconValidation },
  { name: "Voice Configuration", result: voiceValidation },
  { name: "Button Mode Logic", result: buttonModeValidation },
  { name: "Navigation", result: navigationValidation },
];

const passedChecks = allChecks.filter((check) => check.result).length;
const totalChecks = allChecks.length;

console.log(
  `\n${colors.bold}Results: ${passedChecks}/${totalChecks} checks passed${colors.reset}\n`
);

allChecks.forEach((check) => {
  const status = check.result ? "✅" : "❌";
  const color = check.result ? "green" : "red";
  log(`${status} ${check.name}`, color);
});

if (passedChecks === totalChecks) {
  log("\n🎉 All verifications passed! The app is ready for testing.", "green");
  process.exit(0);
} else {
  log(
    "\n⚠️  Some verifications failed. Please fix the issues before proceeding.",
    "yellow"
  );
  process.exit(1);
}
