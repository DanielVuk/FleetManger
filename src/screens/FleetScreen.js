import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, Text, IconButton } from "react-native-paper";
import Vehicle from "../components/Vehicle";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../contexts/AppContext";
import { deleteVehicle } from "../../services/fleetServices";
import { NotificationContext } from "../contexts/NotificationContext";

const FleetScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [state, setState] = useContext(AppContext);
  const { showNotification } = useContext(NotificationContext);

  console.log("STATE: ", state);

  const handleDelete = async (vehicle) => {
    try {
      setState({ ...state, loading: true });

      await deleteVehicle(vehicle.id);

      const newFleet = [...state.fleet].filter((v) => v.id !== vehicle.id);

      setState({
        ...state,
        fleet: newFleet,
        loading: false,
      });
      showNotification(
        "success",
        `${vehicle.name} successfully removed from your fleet.`
      );
    } catch (error) {
      showNotification("error", "Failed to remove vehicle. Please try again.");
      setState({ ...state, loading: false });
    }
  };

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 20,
          marginTop: 40,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text variant="headlineSmall">My Fleet</Text>
          <IconButton
            icon="plus"
            size={30}
            onPress={() => {
              navigation.navigate("AddVehicle");
            }}
          />
        </View>
        {state.fleet?.map((vehicle) => (
          <Vehicle
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={() => handleDelete(vehicle)}
          />
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "#F4F8F8",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
  },
});

export default FleetScreen;
