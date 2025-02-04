import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Card, Text, IconButton, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CategoryCard = ({ category, onDelete, onEdit, onSelect }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.7}>
      <Card style={[styles.card]}>
        <Text style={styles.text}>{category.name}</Text>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <MaterialCommunityIcons
            name={category.icon}
            size={40}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.buttonContainer}>
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            onPress={onDelete}
          />
          <IconButton
            icon="pencil"
            iconColor={theme.colors.secondary}
            onPress={onEdit}
          />
        </View>
      </Card>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    margin: 10,
    elevation: 3,
    backgroundColor: "white",
  },
  selected: {
    borderWidth: 2,
    borderColor: "#6200ea",
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  buttonContainer: { flexDirection: "row" },
});
export default CategoryCard;
