import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import PickerItem from "./PickerItem";

const AppPicker = ({ items, onSelectItem, placeholder, selectedItem }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.container}>
          <Text variant="titleMedium">
            {selectedItem ? selectedItem.label : placeholder}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView>
          <Button onPress={() => setModalVisible(false)}>Close</Button>
          <FlatList
            data={items}
            keyExtractor={(item) => (item.value ? item.value.toString() : "")}
            renderItem={({ item }) => (
              <PickerItem
                label={item.label}
                onPress={() => {
                  setModalVisible(false);
                  onSelectItem(item);
                }}
              />
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 15,
    marginVertical: 10,
  },
});

export default AppPicker;
