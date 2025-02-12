import React, { useContext } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import { getCurrentMileage } from "../utils/getCurrentMileage";
import { AppContext } from "../contexts/AppContext";

const Vehicle = ({ vehicle, onDelete, onPress }) => {
  const [state] = useContext(AppContext);
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image style={styles.image} source={{ uri: vehicle.image }} />
      <View style={styles.contentContainer}>
        <View>
          <Text
            style={[styles.title, { color: theme.colors.primary }]}
            variant="titleSmall"
          >
            {vehicle.name} - {vehicle.registrationNumber}
          </Text>
          <Text style={{ color: theme.colors.secondary }} variant="titleSmall">
            Current mileage: {getCurrentMileage(vehicle.id, state)}
          </Text>
        </View>
        <IconButton
          icon="delete"
          iconColor={theme.colors.error}
          onPress={onDelete}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 20,
    overflow: "hidden",
  },
  contentContainer: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  image: {
    width: "100%",
    height: 200,
  },
  title: {
    marginBottom: 7,
    fontWeight: "bold",
  },
  subTitle: {
    fontWeight: "bold",
  },
});
export default Vehicle;
