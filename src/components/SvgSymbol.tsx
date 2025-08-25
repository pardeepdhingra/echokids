import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { getSymbolUrl, getSymbolInfo } from "../utils/symbolMapping";

interface SvgSymbolProps {
  itemId: string;
  size?: number;
  style?: any;
}

const SvgSymbol: React.FC<SvgSymbolProps> = ({ itemId, size = 64, style }) => {
  const [webViewError, setWebViewError] = useState(false);
  const [webViewLoaded, setWebViewLoaded] = useState(false);

  const symbolInfo = getSymbolInfo(itemId);
  const symbolUrl = getSymbolUrl(itemId);

  if (!symbolInfo || !symbolUrl) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Text style={[styles.fallbackText, { fontSize: size * 0.3 }]}>
          {itemId}
        </Text>
      </View>
    );
  }

  if (webViewError) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Text style={[styles.fallbackText, { fontSize: size * 0.3 }]}>
          {itemId}
        </Text>
      </View>
    );
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: transparent;
            width: 100%;
            height: 100%;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
          }
        </style>
      </head>
      <body>
        <img src="${symbolUrl}" alt="${symbolInfo.keywords.join(", ")}" onerror="window.ReactNativeWebView.postMessage('error')" onload="window.ReactNativeWebView.postMessage('loaded')" />
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <WebView
        source={{ html: htmlContent }}
        style={{
          width: size * 0.8,
          height: size * 0.8,
          backgroundColor: "transparent",
        }}
        onMessage={(event) => {
          if (event.nativeEvent.data === "loaded") {
            setWebViewLoaded(true);
          } else if (event.nativeEvent.data === "error") {
            setWebViewError(true);
            setWebViewLoaded(false);
          }
        }}
        onError={() => {
          setWebViewError(true);
          setWebViewLoaded(false);
        }}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
        javaScriptEnabled={true}
        domStorageEnabled={false}
        startInLoadingState={false}
        onLoadEnd={() => {
          setTimeout(() => {
            if (!webViewLoaded && !webViewError) {
              setWebViewError(true);
            }
          }, 3000);
        }}
      />
      {symbolInfo.category && (
        <Text style={[styles.categoryText, { fontSize: size * 0.15 }]}>
          {symbolInfo.category}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    textAlign: "center",
    color: "#666",
    fontWeight: "bold",
  },
  categoryText: {
    position: "absolute",
    bottom: -20,
    textAlign: "center",
    color: "#666",
    fontWeight: "500",
  },
});

export default SvgSymbol;
