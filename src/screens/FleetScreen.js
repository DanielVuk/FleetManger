import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme, Text, IconButton } from "react-native-paper";
import Vehicle from "../components/Vehicle";
import { useNavigation } from "@react-navigation/native";

const FleetScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [state, setState] = useState({
    fleet: [
      {
        id: "1",
        name: "Skoda Superb",
        mileage: 142000,
        year: 2017,
        vin: "1HGBH41JXMN109186",
        purchasePrice: 17000,
        registrationNumber: "PU7631J",
        registrationDate: "11.12.2025",
        owner: "Daniel Vuk",
      },
      {
        id: "2",
        name: "Mercedes Benz E-klasa",
        mileage: 410000,
        year: 2021,
        vin: "1HGCM82633A123456",
        purchasePrice: 20000,
        registrationNumber: "XYZ456",
        registrationDate: "19.1.2026",
        owner: "Antonio Vuk",
      },
    ],
  });

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
        {state.fleet.map((vehicle) => (
          <Vehicle key={vehicle.id} vehicle={vehicle} />
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
