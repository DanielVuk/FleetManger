import { View, Text } from "react-native";
import React, { useContext } from "react";
import { Button, useTheme } from "react-native-paper";
import storage from "../../services/storage";
import { AppContext } from "../contexts/AppContext";

export default function HomeScreen() {
  const theme = useTheme();
  const [state, setState] = useContext(AppContext);

  const handleLogout = () => {
    setState({ ...state, user: null });
    storage.removeToken();
  };

  return (
    <View style={{ backgroundColor: theme.colors.primary, height: 200 }}>
      <Text>HomeScreen</Text>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={{ position: "absolute", bottom: 20, right: 20 }}
      >
        LOGOUT
      </Button>
    </View>
  );
}
