import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useTheme, Text, IconButton } from "react-native-paper";

const Vehicle = ({ vehicle }) => {
  const handleDelete = async (vehicle) => {
    console.log("Obrisi ", vehicle.name);
  };

  const theme = useTheme();
  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={require("../../assets/mercedes.jpg")}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.title} variant="titleSmall">
          {vehicle.name}
        </Text>
        <IconButton
          icon="delete"
          iconColor={theme.colors.error}
          onPress={() => handleDelete(vehicle)}
        />
      </View>
    </View>
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
