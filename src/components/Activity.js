import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { AppContext } from "../contexts/AppContext";

const Activity = ({ activity, onDelete, onEdit }) => {
  const theme = useTheme();
  const [state] = useContext(AppContext);

  const category = state?.categories.find((c) => c.id === activity.categoryId);

  return (
    <TouchableOpacity>
      <View style={styles.card}>
        <MaterialCommunityIcons
          color={theme.colors.primary}
          name={category?.icon}
          size={45}
        />
        <View style={styles.content}>
          <Text style={styles.name}>{activity.name}</Text>
          {activity.amount && (
            <Text style={styles.amount}>{activity.amount} EUR</Text>
          )}
        </View>
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            iconColor={theme.colors.secondary}
            onPress={onEdit}
          />
          <IconButton
            icon="delete"
            iconColor={theme.colors.error}
            onPress={onDelete}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginVertical: 8,
    padding: 15,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  amount: {
    fontSize: 14,
    marginTop: 4,
    color: "gray",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Activity;
