import { View, Text } from "react-native";
import React from "react";
import { Button, useTheme } from "react-native-paper";

export default function WelcomeScreen() {
  const theme = useTheme();
  return (
    <View>
      <Text>WelcomeScreen</Text>
      <Button
        mode="contained"
        buttonColor={theme.colors.primary}
        onPress={() => console.log("Primarni gumb")}
      >
        Login
      </Button>
      <Button
        mode="contained"
        buttonColor={theme.colors.secondary}
        onPress={() => console.log("Sekundarni gumb")}
      >
        Register
      </Button>
    </View>
  );
}
