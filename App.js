import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import { ActivityIndicator, Snackbar, useTheme } from "react-native-paper";
import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "./src/contexts/AppContext";
import { StyleSheet, View } from "react-native";
import { getUser } from "./services/auth";
import storage from "./services/storage";
import * as SplashScreen from "expo-splash-screen";
import { NotificationContext } from "./src/contexts/NotificationContext";
import { getUserFleet } from "./services/fleetServices";
import { getUserCategories } from "./services/categoryServices";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const theme = useTheme();
  const [state, setState] = useContext(AppContext);
  const { notification, hideNotification } = useContext(NotificationContext);
  const [appIsReady, setAppIsReady] = useState(false);

  const restoreToken = async () => {
    const token = await storage.getToken();

    if (!token) {
      setState((prevState) => ({ ...prevState, user: null }));

      return;
    }
    try {
      const user = await getUser(token);
      const fleet = await getUserFleet(user.id);
      const categories = await getUserCategories(user.id);
      // console.log("USER  => ", user);
      // console.log("FLEET  => ", fleet);
      // console.log("CATEGORIES  => ", categories);
      setState((prevState) => ({
        ...prevState,
        user,
        fleet,
        categories,
      }));
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
      <Snackbar
        visible={notification.visible}
        onDismiss={hideNotification}
        duration={3000}
        style={{ backgroundColor: theme.colors[notification.type] }}
      >
        {notification.message}
      </Snackbar>
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
