import React, { useContext, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { deleteUser } from "../../services/auth";
import { updateSettings } from "../../services/settingsServices";
import storage from "../../services/storage";
import { AppContext, initialState } from "../contexts/AppContext";
import { NotificationContext } from "../contexts/NotificationContext";

const ProfileScreen = () => {
  const [state, setState] = useContext(AppContext);
  const { showNotification } = useContext(NotificationContext);
  const theme = useTheme();

  const [kmReminder, setKmReminder] = useState(
    state.settings.kmReminder?.toString()
  );
  const [timeReminder, setTimeReminder] = useState(
    state.settings.timeReminder?.toString()
  );

  const handleLogout = async () => {
    await storage.removeToken();
    setState(initialState);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setState({ ...state, loading: true });

              await deleteUser(state.user.id, state.settings.id);
              await storage.removeToken();
              setState(initialState);

              showNotification(
                "success",
                "Your account has been successfully deleted."
              );
            } catch (error) {
              showNotification(
                "error",
                "An error occurred while deleting the account. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleSaveSettings = async () => {
    try {
      setState({ ...state, loading: true });
      await updateSettings({
        id: state.settings.id,
        userId: state.user.id,
        kmReminder,
        timeReminder,
      });

      setState((prevState) => ({
        ...prevState,
        settings: { ...prevState.settings, kmReminder, timeReminder },
        loading: false,
      }));

      showNotification("success", "Your settings have been updated.");
    } catch (error) {
      showNotification(
        "error",
        "An error occurred while updating settings. Please try again."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Image
          source={require("../../assets/logo.png")} // Putanja do tvog loga
          style={styles.logo}
        />

        <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
          {state.user?.email}
        </Text>

        <TextInput
          label="Remind me on (km)"
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          onChangeText={setKmReminder}
          value={kmReminder}
        />
        <TextInput
          label="Remind me within (days)"
          mode="outlined"
          keyboardType="numeric"
          style={styles.input}
          onChangeText={setTimeReminder}
          value={timeReminder}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleSaveSettings}
        >
          Save Settings
        </Button>

        <Button mode="contained" style={styles.button} onPress={handleLogout}>
          Log Out
        </Button>

        <Button
          mode="contained"
          buttonColor={theme.colors.error}
          style={styles.button}
          onPress={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  input: {
    width: "80%",
    marginVertical: 10,
    backgroundColor: "white",
  },
  button: {
    marginTop: 15,
    width: "80%",
  },
});

export default ProfileScreen;
