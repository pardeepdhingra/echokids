import { useState, useEffect, useRef } from "react";

interface UseLazySymbolOptions {
  delay?: number;
  cache?: boolean;
}

// Simple in-memory cache for symbols
const symbolCache = new Map<string, boolean>();

export const useLazySymbol = (
  symbolName: string,
  options: UseLazySymbolOptions = {}
) => {
  const { delay = 50, cache = true } = options;
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!symbolName) {
      setIsLoaded(false);
      setIsLoading(false);
      setError(false);
      return;
    }

    // Check cache first
    if (cache && symbolCache.has(symbolName)) {
      setIsLoaded(true);
      setIsLoading(false);
      setError(false);
      return;
    }

    // Start loading
    if (!isLoaded && !isLoading) {
      setIsLoading(true);
      setError(false);

      // Simulate loading with delay
      timeoutRef.current = setTimeout(() => {
        try {
          // In the future, this would load the actual symbol
          // For now, we just simulate success
          setIsLoaded(true);
          setIsLoading(false);

          // Cache the result
          if (cache) {
            symbolCache.set(symbolName, true);
          }
        } catch (err) {
          setError(true);
          setIsLoading(false);
        }
      }, delay);
    }

    // Cleanup timeout on unmount or symbol change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [symbolName, isLoaded, isLoading, delay, cache]);

  // Clear cache function (useful for testing or memory management)
  const clearCache = () => {
    symbolCache.clear();
  };

  return {
    isLoaded,
    isLoading,
    error,
    clearCache,
  };
};
