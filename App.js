import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import { ActivityIndicator } from "react-native-paper";
import { useContext, useEffect, useState, useCallback } from "react";
import { Context } from "./AppContext";
import { StyleSheet, View } from "react-native";
import { getUser } from "./services/auth";
import storage from "./services/storage";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [state, setState] = useContext(Context);
  const [appIsReady, setAppIsReady] = useState(false);

  const restoreToken = async () => {
    const token = await storage.getToken();

    if (!token) {
      setState({ ...state, user: null });
      return;
    }
    try {
      console.log("TOKEN NA pocetku: ", token);

      const user = await getUser(token);
      console.log("USER  => ", user);
      setState({ ...state, user: user });
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      setState((prevState) => ({ ...prevState, user: null }));
    }
  };

  const prepare = async () => {
    await restoreToken();
    setAppIsReady(true);
  };

  useEffect(() => {
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <NavigationContainer>
        {state.user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <ActivityIndicator
        animating={state.loading}
        style={styles.loader}
        size="large"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    top: "50%",
    right: "45%",
  },
});
