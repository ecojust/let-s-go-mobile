import { DimensionValue, View, type ViewProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  width?: DimensionValue;
  darkColor?: string;
};

export function ThemedView({
  style,
  width,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <View
      style={[{ backgroundColor }, style, { width: width }]}
      {...otherProps}
    />
  );
}
