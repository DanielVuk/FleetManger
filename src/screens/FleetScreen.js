import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { IconButton, Text } from "react-native-paper";
import { deleteActivity } from "../../services/activityServices";
import { deleteVehicle } from "../../services/fleetServices";
import Vehicle from "../components/Vehicle";
import { AppContext } from "../contexts/AppContext";
import { NotificationContext } from "../contexts/NotificationContext";

const FleetScreen = () => {
  const navigation = useNavigation();
  const [state, setState] = useContext(AppContext);
  const { showNotification } = useContext(NotificationContext);

  const handleDelete = (vehicle) => {
    Alert.alert(
      "Delete Confirmation",
      `Are you sure you want to delete ${vehicle.name}? This will also delete all associated activities.`,
      [
        {
          text: "Cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setState({ ...state, loading: true });

              await deleteVehicle(vehicle.id);

              const activitesForDelete = state.activities.filter(
                (a) => a.vehicleId === vehicle.id
              );

              await Promise.all(
                activitesForDelete.map((a) => deleteActivity(a.id))
              );

              const newFleet = state.fleet.filter((v) => v.id !== vehicle.id);

              const newActivities = state.activities.filter(
                (a) => a.vehicleId !== vehicle.id
              );

              setState({
                ...state,
                fleet: newFleet,
                activities: newActivities,
                loading: false,
              });
              showNotification(
                "success",
                `${vehicle.name} successfully removed from your fleet.`
              );
            } catch (error) {
              showNotification(
                "error",
                "Failed to remove vehicle. Please try again."
              );
              setState({ ...state, loading: false });
            }
          },
        },
      ]
    );
  };

  const handleEdit = (vehicle) => {
    navigation.navigate("VehicleDetails", { vehicle });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <View style={styles.header}>
          <Text variant="headlineSmall">My Fleet</Text>
          <IconButton
            icon="plus"
            size={30}
            onPress={() => {
              navigation.navigate("VehicleDetails");
            }}
          />
        </View>
        {state.fleet?.map((vehicle) => (
          <Vehicle
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={() => handleDelete(vehicle)}
            onPress={() => handleEdit(vehicle)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default FleetScreen;
