import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export default function WelcomeScreen({ navigation }) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />

        <Text
          style={[{ color: theme.colors.primary }, { marginVertical: 20 }]}
          variant="headlineMedium"
        >
          Welcome to Fleet Manager!
        </Text>
        <Text style={{ color: theme.colors.secondary }} variant="titleMedium">
          Simplify your fleet management today.
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          buttonColor={theme.colors.primary}
          mode="contained"
          onPress={() => navigation.navigate("Login")}
          style={styles.button}
          uppercase
        >
          Login
        </Button>
        <Button
          buttonColor={theme.colors.secondary}
          mode="contained"
          onPress={() => navigation.navigate("Register")}
          style={styles.button}
          uppercase
        >
          Register
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 60,
    justifyContent: "center",
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logo: {
    height: 200,
    width: 200,
  },
  logoContainer: {
    position: "absolute",
    alignItems: "center",
    top: 70,
  },
});
