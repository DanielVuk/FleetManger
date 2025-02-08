import React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Reminder = ({ reminders }) => {
  const theme = useTheme();
  if (!reminders || reminders.length === 0) return;

  return (
    <FlatList
      data={reminders}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <TouchableWithoutFeedback>
          <View style={styles.card}>
            <MaterialCommunityIcons
              color={theme.colors.primary}
              name="bell-ring-outline"
              size={25}
            />
            <Text style={styles.reminderText}>{item}</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
      style={{ marginTop: 20, width: "90%" }}
    />
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
