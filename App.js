import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import { ActivityIndicator } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { Context } from "./AppContext";
import { StyleSheet } from "react-native";
import { getUser } from "./services/auth";
import storage from "./services/storage";

export default function App() {
  const [state, setState] = useContext(Context);

  const restoreToken = async () => {
    const token = await storage.getToken();

    if (!token) return;

    const user = await getUser(token);
    console.log("USER  => ", user);

    setState({ ...state, user: user });
  };

  useEffect(() => {
    restoreToken();
  }, []);

  console.log("State: ", state);

  return (
    <>
      <NavigationContainer>
        {state.user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <ActivityIndicator
        animating={state.loading}
        style={styles.loader}
        size="large"
      />
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: "50%",
    right: "45%",
  },
});
