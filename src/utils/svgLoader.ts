import { Asset } from 'expo-asset';

// Cache for loaded SVG content
const svgCache: { [key: string]: string } = {};

// Function to load SVG content from assets
export const loadSvgFromAssets = async (symbolName: string): Promise<string | null> => {
  try {
    // Check cache first
    if (svgCache[symbolName]) {
      return svgCache[symbolName];
    }

    // Try to load from assets
    const assetUri = Asset.fromModule(require(`../../assets/EN-symbols/${symbolName}.svg`));
    await assetUri.downloadAsync();
    
    // For now, return null as we need to implement actual SVG loading
    // In a real implementation, you would read the file content
    console.log(`📁 SVG Loaded: ${symbolName}`);
    
    return null;
  } catch (error) {
    console.error(`❌ Error loading SVG ${symbolName}:`, error);
    return null;
  }
};

// Function to get cached SVG content
export const getCachedSvg = (symbolName: string): string | null => {
  return svgCache[symbolName] || null;
};

// Function to cache SVG content
export const cacheSvg = (symbolName: string, content: string): void => {
  svgCache[symbolName] = content;
};

// Function to preload common symbols
export const preloadCommonSymbols = async (): Promise<void> => {
  const commonSymbols = [
    'apple', 'banana', 'orange', 'milk', 'water', 'happy', 'sad', 'angry',
    'mom', 'dad', 'friend', 'teacher', 'brother', 'sister', 'grandfather', 'grandmother',
    'home', 'school', 'park', 'store', 'playground', 'restaurant', 'hospital', 'library', 'beach'
  ];

  console.log('🔄 Preloading common symbols...');
  
  for (const symbol of commonSymbols) {
    try {
      await loadSvgFromAssets(symbol);
    } catch (error) {
      console.warn(`⚠️ Could not preload ${symbol}:`, error);
    }
  }
  
  console.log('✅ Common symbols preloaded');
};
