import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Snackbar, useTheme } from "react-native-paper";
import { getUserActivities } from "./services/activityServices";
import { getUser } from "./services/auth";
import { getUserCategories } from "./services/categoryServices";
import { getUserFleet } from "./services/fleetServices";
import storage from "./services/storage";
import { AppContext } from "./src/contexts/AppContext";
import { NotificationContext } from "./src/contexts/NotificationContext";
import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";
import { getUserSettings } from "./services/settingsServices";

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
      const activities = await getUserActivities(user.id);
      const settings = await getUserSettings(user.id);
      // console.log("USER  => ", user);
      // console.log("FLEET  => ", fleet);
      // console.log("CATEGORIES  => ", categories);
      // console.log("ACTIVITIES  => ", activities);
      // console.log("SETTINGS  => ", settings);
      setState((prevState) => ({
        ...prevState,
        user,
        fleet,
        categories,
        activities,
        settings,
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
