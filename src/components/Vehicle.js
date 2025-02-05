import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";

const Vehicle = ({ vehicle, onDelete, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image style={styles.image} source={{ uri: vehicle.image }} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} variant="titleSmall">
          {vehicle.name}
        </Text>
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
