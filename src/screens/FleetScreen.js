import { View, Text } from "react-native";
import React, { useContext } from "react";
import { Context } from "../../AppContext";
import { Button } from "react-native-paper";
import storage from "../../services/storage";

export default function FleetScreen() {
  const [state, setState] = useContext(Context);

  return (
    <View>
      <Text>FleetScreen</Text>
      <Text>{state?.user.id}</Text>
      <Text>{state?.user.email}</Text>

      <Button
        mode="contained"
        onPress={() => {
          setState({ ...state, user: null });
          storage.removeToken();
        }}
      >
        LOGOUT
      </Button>
    </View>
  );
}
