import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedButton({
  title,
  onPress,
  style,
  lightColor,
  darkColor,
}: ThemedButtonProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor || "#4466ff", dark: darkColor || "#ffffff" },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#FFFFFF", dark: "#000000" },
    "text"
  );

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
