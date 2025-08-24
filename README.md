# Echo Kids - AAC Communication App

A comprehensive Augmentative and Alternative Communication (AAC) app built with React Native and Expo, featuring dual-mode functionality for parents/carers and children. Echo Kids helps children with autism, ADHD, and communication challenges express themselves through an intuitive, colorful interface.

## 🎯 Features

### Parent/Carer Mode

- ✅ Create, edit, and delete vocabulary boards
- ✅ Add custom icons and phrases with TTS
- ✅ Adjust grid size (2x2, 3x3, 4x4, 5x5, 6x6)
- ✅ Configure TTS voice and volume settings
- ✅ Manage favorites section
- ✅ Button modes: One-word or Sentence
- ✅ Multiple themes: Default, Colorful, Minimal
- ✅ Math-protected access control

### Child Mode

- ✅ Simple, grid-based vocabulary boards
- ✅ Large, colorful buttons optimized for children with ASD/ADHD
- ✅ Tap-to-speak functionality with high-quality TTS
- ✅ Favorites section for quick access
- ✅ No editing capabilities (child-safe)
- ✅ Minimal navigation and clutter

### Technical Features

- ✅ Offline functionality with iOS native TTS
- ✅ 30+ predefined daily-life vocabulary buttons
- ✅ Valid Ionicons for consistent display
- ✅ TypeScript for type safety
- ✅ Comprehensive testing and verification system
- ✅ Automated quality checks

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS testing)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd AAC/AACApp

# Run automated setup
npm run dev:setup
```

This will:

- Install all dependencies
- Set up Git hooks
- Run initial verification
- Prepare the development environment

### Development

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## 🔍 Verification System

This project includes a comprehensive verification system to ensure code quality and prevent regressions.

### Quick Verification

```bash
npm run verify:quick
```

Checks:

- ✅ File structure integrity
- ✅ Button mode logic (sentence vs one-word)
- ✅ Voice configuration (Apple TTS voices)
- ✅ TTS utility functionality
- ✅ Navigation setup
- ✅ Icon mapping (valid Ionicons)

### Full Verification

```bash
npm run dev:verify
```

Includes:

- ✅ Quick verification checks
- ✅ TypeScript compilation
- ✅ Code quality (ESLint)
- ✅ Test suite with coverage

### Development Workflow Commands

```bash
# Show all available commands
npm run dev:workflow

# Diagnose project health
npm run dev:doctor

# Auto-fix linting issues
npm run dev:fix

# Test production build
npm run dev:build

# Clean and reinstall dependencies
npm run dev:clean

# Run pre-push checks
npm run dev:pre-push
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run dev:test

# Run specific test file
npm test -- VocabularyGrid.test.tsx
```

### Test Coverage

- ✅ VocabularyGrid component functionality
- ✅ TTS utility functions
- ✅ Navigation between modes
- ✅ Button mode logic (sentence vs one-word)
- ✅ Icon mapping validation
- ✅ Constants and configuration

## 🔧 Architecture

### File Structure

```
src/
├── components/          # Reusable UI components
│   ├── VocabularyGrid.tsx
│   └── AddEditItemModal.tsx
├── screens/            # Screen components
│   ├── ModeSelectionScreen.tsx
│   ├── ParentVocabularyScreen.tsx
│   ├── ChildVocabularyScreen.tsx
│   ├── SettingsScreen.tsx
│   └── FavoritesScreen.tsx
├── utils/              # Utility functions
│   ├── tts.ts         # Text-to-speech functionality
│   └── storage.ts     # AsyncStorage helpers
├── types/              # TypeScript type definitions
│   └── index.ts
├── constants/          # App constants and configuration
│   └── index.ts
└── __tests__/          # Test files
    ├── VocabularyGrid.test.tsx
    ├── TTS.test.ts
    ├── Navigation.test.tsx
    ├── ButtonMode.test.tsx
    ├── IconMapping.test.ts
    └── Constants.test.ts
```

### Key Components

#### VocabularyGrid

- Displays vocabulary items in a configurable grid
- Handles button mode logic (sentence vs one-word)
- Manages icon display using Ionicons
- Supports both parent and child modes

#### TTS Utility

- Uses Apple TTS voices for natural speech
- Supports voice selection and configuration
- Handles speech rate and volume control

#### Mode Selection

- Math-protected parent access
- Quick switching between modes
- Secure child-to-parent transition

## 🎨 Customization

### Adding New Vocabulary

1. Edit `src/constants/index.ts`
2. Add new items to `BUTTON_TEMPLATES`
3. Map icons in `VocabularyGrid.tsx`
4. Run verification: `npm run verify:quick`

### Adding New Icons

1. Choose valid Ionicons from [Ionicons Library](https://ionic.io/ionicons)
2. Update `ICON_MAP` in `VocabularyGrid.tsx`
3. Add to validation list in verification scripts
4. Test with `npm run verify:quick`

### Voice Configuration

1. Update `VOICE_OPTIONS` in `src/constants/index.ts`
2. Use Apple TTS bundle identifiers for best quality
3. Test with different voices in settings

## 🚦 Quality Assurance

### Automated Checks

- **Pre-commit hooks**: Run verification before each commit
- **GitHub Actions**: Continuous integration on push/PR
- **TypeScript**: Compile-time type checking
- **ESLint**: Code quality and consistency
- **Jest**: Unit and integration testing

### Manual Testing Checklist

- [ ] Parent mode: Create/edit/delete vocabulary items
- [ ] Child mode: Tap buttons and verify TTS works
- [ ] Mode switching: Math question protection works
- [ ] Settings: Voice, grid size, theme changes work
- [ ] Button modes: Sentence vs one-word behavior
- [ ] Icons: All icons display correctly (no "?" symbols)
- [ ] Offline: App works without internet connection

## 🐛 Troubleshooting

### Common Issues

**Icons not displaying (showing "?")**

```bash
npm run verify:quick
# Check icon mapping validation
```

**TTS voices sound robotic**

```bash
npm run dev:doctor
# Verify Apple TTS configuration
```

**Button modes not working correctly**

```bash
npm test -- ButtonMode.test.tsx
# Run button mode tests
```

**Build failures**

```bash
npm run dev:clean
npm run dev:setup
```

### Getting Help

1. Run `npm run dev:doctor` to diagnose issues
2. Check verification output: `npm run verify:quick`
3. Review test results: `npm test`
4. Check GitHub Actions for CI failures

## 📱 Deployment

### iOS Deployment

```bash
# Test build
npm run dev:build

# Create iOS build
npx expo build:ios
```

### Testing on Device

```bash
# Start with tunnel for device testing
npx expo start --tunnel

# Use Expo Go app to scan QR code
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run full verification: `npm run dev:verify`
5. Run pre-push checks: `npm run dev:pre-push`
6. Submit a pull request

### Development Guidelines

- ✅ Always run verification before committing
- ✅ Write tests for new functionality
- ✅ Use TypeScript strictly (no `any` types)
- ✅ Follow existing code patterns
- ✅ Update documentation for new features

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Icons from [Ionicons](https://ionic.io/ionicons)
- TTS powered by iOS Speech Framework
- Testing with [Jest](https://jestjs.io/) and [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
