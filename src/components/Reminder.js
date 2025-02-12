import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Reminder = ({ reminder, onPress = null }) => {
  const theme = useTheme();
  if (!reminder) return null;

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.card}>
        <MaterialCommunityIcons
          color={theme.colors.primary}
          name="bell-ring-outline"
          size={25}
        />
        <Text style={styles.reminderText}>{reminder}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default Reminder;
