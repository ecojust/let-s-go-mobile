import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
  size?: "small" | "default" | "large";
  disabled?: boolean;
}

export function ThemedButton({
  title,
  onPress,
  style,
  lightColor,
  darkColor,
  size = "default",
  disabled = false,
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor || "#4466ff", dark: darkColor || "#ffffff" },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#FFFFFF", dark: "#000000" },
    "text"
  );

  const disableBackgroundColor = useThemeColor(
    { light: lightColor || "#cccccc", dark: darkColor || "#cccccc" },
    "background"
  );
  const disableTextColor = useThemeColor(
    { light: "rgba(0,0,0,0.3)", dark: "rgba(0,0,0,0.3)" },
    "text"
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: disabled ? disableBackgroundColor : backgroundColor,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.buttonText,
          { color: disabled ? disableTextColor : textColor },
          size === "default" ? styles.default : undefined,
          size === "small" ? styles.small : undefined,
          size === "large" ? styles.large : undefined,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    // padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  small: {
    padding: 8,
    fontSize: 12,
  },
  default: {
    padding: 12,
    fontSize: 18,
  },
  large: {
    padding: 10,
    fontSize: 20,
  },
});
