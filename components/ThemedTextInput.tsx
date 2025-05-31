import {
  TextInput,
  type TextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  DimensionValue,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { hide } from "expo-splash-screen";
import { hideAsync } from "expo-router/build/utils/splash";

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  clearable?: boolean;
  width?: DimensionValue;
  prefix?: string | React.ReactNode;
};

export function ThemedTextInput({
  style,
  value,
  onChangeText,
  clearable = false,
  width = "100%",
  prefix,
  ...rest
}: ThemedTextInputProps) {
  const color = useThemeColor({ light: "black", dark: "black" }, "text");
  const iconColor = useThemeColor(
    { light: "#dbdbdb", dark: "#dbdbdb" },
    "text"
  );

  const styles = StyleSheet.create({
    container: {
      width: width,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#CCCCCC",
      borderRadius: 5,
      backgroundColor: "#FFFFFF",
      paddingHorizontal: 10,
    },
    prefix: {
      marginRight: 4,
      fontSize: 16,
      color: iconColor,
    },
    default: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 15,
      height: 42,
    },
    clearIcon: {
      marginLeft: 5,
    },
  });

  return (
    <View style={[styles.container]}>
      {prefix &&
        (typeof prefix === "string" ? (
          <Text style={styles.prefix}>{prefix}</Text>
        ) : (
          prefix
        ))}
      <TextInput
        style={[{ color }, styles.default, style]}
        value={value}
        onChangeText={onChangeText}
        {...rest}
      />
      {clearable && value && (
        <TouchableOpacity
          style={styles.clearIcon}
          onPress={() => onChangeText?.("")}
        >
          <Ionicons name="close-circle" size={16} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}
