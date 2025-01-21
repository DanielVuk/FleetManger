import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.primary, height: 200 }}>
      <Text>HomeScreen</Text>
    </View>
  );
}
