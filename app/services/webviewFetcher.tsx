import React, { useRef, useState } from "react";
import { WebView } from "react-native-webview";
import { DimensionValue, View, type ViewProps } from "react-native";

interface WebViewFetcherProps {
  url: string;
  onContentFetched: (content: string) => void;
  height: DimensionValue;
  injectedScript: string;
}

export const WebViewFetcher = ({
  url,
  onContentFetched,
  height = 300,
  injectedScript = "",
}: WebViewFetcherProps) => {
  const [loading, setLoading] = useState(true);
  const webViewRef = useRef(null);

  const handleMessage = (event: any) => {
    const content = event.nativeEvent.data;
    onContentFetched(content);
  };

  return (
    <View style={{ height: height, opacity: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        onLoad={() => setLoading(false)}
        onMessage={handleMessage}
        injectedJavaScript={injectedScript}
      />
    </View>
  );
};
