import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

const PickerItem = ({ label, onPress }) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text variant="titleMedium" style={styles.text}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  text: {
    textAlign: "center",
  },
});

export default PickerItem;
