import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, IconButton, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CategoryCard = ({ category, onDelete, onEdit, onSelect, selected }) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      onPress={onSelect}
      onLongPress={onEdit}
      activeOpacity={0.7}
    >
      <Card
        style={[
          styles.card,
          {
            borderWidth: selected && selected.id === category.id ? 2 : 0,
            borderColor:
              selected && selected.id === category.id
                ? theme.colors.primary
                : "transparent",
            transform:
              selected && selected.id === category.id ? [{ scale: 1.05 }] : [],
          },
        ]}
      >
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
    backgroundColor: "white",
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
  buttonContainer: {
    flexDirection: "row",
  },
});
export default CategoryCard;
